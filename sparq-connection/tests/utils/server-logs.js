const fs = require('fs').promises;
const path = require('path');

class ServerLogCapture {
  constructor(browserManager) {
    this.browser = browserManager;
    this.logs = [];
    this.logDir = path.join(__dirname, '../logs');
  }

  async setupNetworkLogging() {
    // Enable network domain
    const client = await this.browser.page.target().createCDPSession();
    await client.send('Network.enable');
    await client.send('Runtime.enable');

    // Capture network requests
    client.on('Network.requestWillBeSent', (params) => {
      this.logs.push({
        type: 'network-request',
        timestamp: new Date().toISOString(),
        requestId: params.requestId,
        url: params.request.url,
        method: params.request.method,
        headers: params.request.headers,
        postData: params.request.postData,
        initiator: params.initiator
      });
    });

    // Capture network responses
    client.on('Network.responseReceived', (params) => {
      this.logs.push({
        type: 'network-response',
        timestamp: new Date().toISOString(),
        requestId: params.requestId,
        url: params.response.url,
        status: params.response.status,
        statusText: params.response.statusText,
        headers: params.response.headers,
        mimeType: params.response.mimeType
      });
    });

    // Capture failed requests
    client.on('Network.loadingFailed', (params) => {
      this.logs.push({
        type: 'network-error',
        timestamp: new Date().toISOString(),
        requestId: params.requestId,
        errorText: params.errorText,
        canceled: params.canceled
      });
    });

    // Capture console logs
    client.on('Runtime.consoleAPICalled', (params) => {
      this.logs.push({
        type: 'console',
        timestamp: new Date().toISOString(),
        level: params.type,
        args: params.args.map(arg => arg.value || arg.description || '[Object]'),
        stackTrace: params.stackTrace
      });
    });

    // Capture exceptions
    client.on('Runtime.exceptionThrown', (params) => {
      this.logs.push({
        type: 'exception',
        timestamp: new Date().toISOString(),
        exceptionDetails: params.exceptionDetails,
        text: params.exceptionDetails.text,
        lineNumber: params.exceptionDetails.lineNumber,
        columnNumber: params.exceptionDetails.columnNumber,
        url: params.exceptionDetails.url
      });
    });

    return client;
  }

  async captureSupabaseRequests() {
    // Monitor Supabase API calls specifically
    await this.browser.page.setRequestInterception(true);
    
    this.browser.page.on('request', (request) => {
      const url = request.url();
      
      if (url.includes('supabase') || url.includes('postgrest')) {
        this.logs.push({
          type: 'supabase-request',
          timestamp: new Date().toISOString(),
          url,
          method: request.method(),
          headers: request.headers(),
          postData: request.postData(),
          resourceType: request.resourceType()
        });
      }
      
      request.continue();
    });

    this.browser.page.on('response', (response) => {
      const url = response.url();
      
      if (url.includes('supabase') || url.includes('postgrest')) {
        this.logs.push({
          type: 'supabase-response',
          timestamp: new Date().toISOString(),
          url,
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers()
        });
      }
    });
  }

  async captureAuthEvents() {
    // Monitor authentication-related events
    await this.browser.page.evaluateOnNewDocument(() => {
      // Override localStorage to capture auth token changes
      const originalSetItem = localStorage.setItem;
      const originalRemoveItem = localStorage.removeItem;
      
      localStorage.setItem = function(key, value) {
        if (key.includes('auth') || key.includes('supabase')) {
          window.authEvents = window.authEvents || [];
          window.authEvents.push({
            type: 'auth-storage-set',
            timestamp: new Date().toISOString(),
            key,
            valueType: typeof value,
            hasValue: !!value
          });
        }
        return originalSetItem.call(this, key, value);
      };

      localStorage.removeItem = function(key) {
        if (key.includes('auth') || key.includes('supabase')) {
          window.authEvents = window.authEvents || [];
          window.authEvents.push({
            type: 'auth-storage-remove',
            timestamp: new Date().toISOString(),
            key
          });
        }
        return originalRemoveItem.call(this, key);
      };

      // Override fetch to capture auth API calls
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && (url.includes('auth') || url.includes('login') || url.includes('signup'))) {
          window.authEvents = window.authEvents || [];
          window.authEvents.push({
            type: 'auth-api-call',
            timestamp: new Date().toISOString(),
            url,
            method: args[1]?.method || 'GET'
          });
        }
        return originalFetch.apply(this, args);
      };
    });
  }

  async getAuthEvents() {
    const authEvents = await this.browser.page.evaluate(() => {
      return window.authEvents || [];
    });

    authEvents.forEach(event => {
      this.logs.push({
        ...event,
        source: 'browser-auth-events'
      });
    });

    return authEvents;
  }

  async captureDatabaseQueries() {
    // This would require server-side logging setup
    // For now, we'll capture what we can see from the browser side
    
    await this.browser.page.evaluateOnNewDocument(() => {
      // Monitor for database-related console logs
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = function(...args) {
        if (args.some(arg => typeof arg === 'string' && (
          arg.includes('SQL') || 
          arg.includes('query') || 
          arg.includes('database') ||
          arg.includes('RLS')
        ))) {
          window.dbEvents = window.dbEvents || [];
          window.dbEvents.push({
            type: 'database-log',
            timestamp: new Date().toISOString(),
            level: 'log',
            message: args.join(' ')
          });
        }
        return originalLog.apply(this, args);
      };

      console.error = function(...args) {
        if (args.some(arg => typeof arg === 'string' && (
          arg.includes('SQL') || 
          arg.includes('query') || 
          arg.includes('database') ||
          arg.includes('RLS')
        ))) {
          window.dbEvents = window.dbEvents || [];
          window.dbEvents.push({
            type: 'database-error',
            timestamp: new Date().toISOString(),
            level: 'error',
            message: args.join(' ')
          });
        }
        return originalError.apply(this, args);
      };
    });
  }

  async getDatabaseEvents() {
    const dbEvents = await this.browser.page.evaluate(() => {
      return window.dbEvents || [];
    });

    dbEvents.forEach(event => {
      this.logs.push({
        ...event,
        source: 'browser-db-events'
      });
    });

    return dbEvents;
  }

  async capturePerformanceLogs() {
    const performanceEntries = await this.browser.page.evaluate(() => {
      const entries = performance.getEntries();
      return entries.map(entry => ({
        name: entry.name,
        entryType: entry.entryType,
        startTime: entry.startTime,
        duration: entry.duration,
        initiatorType: entry.initiatorType,
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
        decodedBodySize: entry.decodedBodySize
      }));
    });

    performanceEntries.forEach(entry => {
      this.logs.push({
        type: 'performance',
        timestamp: new Date().toISOString(),
        ...entry
      });
    });

    return performanceEntries;
  }

  async saveLogs(description) {
    await fs.mkdir(this.logDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `logs-${this.browser.testName}-${description}-${timestamp}.json`;
    const logPath = path.join(this.logDir, filename);

    const logData = {
      testName: this.browser.testName,
      description,
      timestamp: new Date().toISOString(),
      url: this.browser.page.url(),
      logs: this.logs,
      summary: this.generateLogSummary()
    };

    await fs.writeFile(logPath, JSON.stringify(logData, null, 2));
    console.log(`📝 Logs saved: ${filename}`);
    
    return logPath;
  }

  generateLogSummary() {
    const summary = {
      totalLogs: this.logs.length,
      byType: {},
      errors: [],
      warnings: [],
      networkRequests: 0,
      supabaseRequests: 0,
      authEvents: 0,
      exceptions: 0
    };

    this.logs.forEach(log => {
      // Count by type
      summary.byType[log.type] = (summary.byType[log.type] || 0) + 1;

      // Collect errors and warnings
      if (log.type === 'exception' || log.level === 'error') {
        summary.errors.push(log);
        summary.exceptions++;
      }
      
      if (log.level === 'warn') {
        summary.warnings.push(log);
      }

      // Count specific types
      if (log.type.includes('network')) {
        summary.networkRequests++;
      }
      
      if (log.type.includes('supabase')) {
        summary.supabaseRequests++;
      }
      
      if (log.type.includes('auth')) {
        summary.authEvents++;
      }
    });

    return summary;
  }

  async filterLogs(criteria) {
    return this.logs.filter(log => {
      if (criteria.type && log.type !== criteria.type) return false;
      if (criteria.level && log.level !== criteria.level) return false;
      if (criteria.url && !log.url?.includes(criteria.url)) return false;
      if (criteria.timeRange) {
        const logTime = new Date(log.timestamp).getTime();
        if (logTime < criteria.timeRange.start || logTime > criteria.timeRange.end) {
          return false;
        }
      }
      return true;
    });
  }

  async getErrorLogs() {
    return this.filterLogs({ level: 'error' });
  }

  async getSupabaseLogs() {
    return this.logs.filter(log => log.type.includes('supabase'));
  }

  async getAuthLogs() {
    return this.logs.filter(log => log.type.includes('auth'));
  }

  async clearLogs() {
    this.logs = [];
  }

  async generateDetailedReport() {
    const report = {
      testName: this.browser.testName,
      generatedAt: new Date().toISOString(),
      url: this.browser.page.url(),
      summary: this.generateLogSummary(),
      timeline: this.generateTimeline(),
      errorAnalysis: await this.analyzeErrors(),
      performanceAnalysis: await this.analyzePerformance(),
      networkAnalysis: await this.analyzeNetworkActivity()
    };

    const reportPath = path.join(__dirname, '../reports', `detailed-log-report-${this.browser.testName}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`📊 Detailed log report generated: detailed-log-report-${this.browser.testName}.json`);
    return report;
  }

  generateTimeline() {
    return this.logs
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(log => ({
        timestamp: log.timestamp,
        type: log.type,
        summary: this.generateLogSummary(log)
      }));
  }

  async analyzeErrors() {
    const errors = await this.getErrorLogs();
    const analysis = {
      totalErrors: errors.length,
      errorTypes: {},
      criticalErrors: [],
      patterns: []
    };

    errors.forEach(error => {
      const errorType = error.type || 'unknown';
      analysis.errorTypes[errorType] = (analysis.errorTypes[errorType] || 0) + 1;

      // Identify critical errors
      if (error.text?.includes('auth') || 
          error.text?.includes('database') || 
          error.text?.includes('RLS') ||
          error.status >= 500) {
        analysis.criticalErrors.push(error);
      }
    });

    return analysis;
  }

  async analyzePerformance() {
    const performanceLogs = this.logs.filter(log => log.type === 'performance');
    
    const analysis = {
      totalResources: performanceLogs.length,
      slowRequests: performanceLogs.filter(log => log.duration > 1000),
      largeResources: performanceLogs.filter(log => log.transferSize > 1000000),
      averageLoadTime: 0,
      totalTransferSize: 0
    };

    if (performanceLogs.length > 0) {
      analysis.averageLoadTime = performanceLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / performanceLogs.length;
      analysis.totalTransferSize = performanceLogs.reduce((sum, log) => sum + (log.transferSize || 0), 0);
    }

    return analysis;
  }

  async analyzeNetworkActivity() {
    const networkLogs = this.logs.filter(log => log.type.includes('network'));
    
    const analysis = {
      totalRequests: networkLogs.length,
      requestsByMethod: {},
      requestsByDomain: {},
      failedRequests: networkLogs.filter(log => log.type === 'network-error'),
      slowRequests: [],
      supabaseActivity: networkLogs.filter(log => log.url?.includes('supabase'))
    };

    networkLogs.forEach(log => {
      if (log.method) {
        analysis.requestsByMethod[log.method] = (analysis.requestsByMethod[log.method] || 0) + 1;
      }
      
      if (log.url) {
        try {
          const domain = new URL(log.url).hostname;
          analysis.requestsByDomain[domain] = (analysis.requestsByDomain[domain] || 0) + 1;
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });

    return analysis;
  }
}

module.exports = ServerLogCapture;