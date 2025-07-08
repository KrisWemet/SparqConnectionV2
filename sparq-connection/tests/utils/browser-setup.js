const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

class BrowserManager {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testName = '';
    this.screenshotCounter = 0;
  }

  async setupBrowser(options = {}) {
    const defaultOptions = {
      headless: process.env.CI ? true : false,
      devtools: !process.env.CI,
      slowMo: process.env.CI ? 0 : 50,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    };

    this.browser = await puppeteer.launch({
      ...defaultOptions,
      ...options
    });

    this.page = await this.browser.newPage();
    
    // Set viewport for consistent screenshots
    await this.page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 1
    });

    // Enable console logging
    this.page.on('console', msg => {
      console.log(`[BROWSER ${msg.type().toUpperCase()}]:`, msg.text());
    });

    // Enable error logging
    this.page.on('pageerror', error => {
      console.error('[PAGE ERROR]:', error.message);
    });

    // Enable request/response logging
    this.page.on('request', request => {
      console.log(`[REQUEST]: ${request.method()} ${request.url()}`);
    });

    this.page.on('response', response => {
      console.log(`[RESPONSE]: ${response.status()} ${response.url()}`);
    });

    return { browser: this.browser, page: this.page };
  }

  async setupReactDevTools() {
    // Install React DevTools extension for state debugging
    const reactDevToolsPath = path.join(__dirname, '../fixtures/react-devtools-extension');
    
    try {
      await this.page.evaluateOnNewDocument(() => {
        // Enable React DevTools
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = function() {};
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberUnmount = function() {};
      });
    } catch (error) {
      console.warn('Could not setup React DevTools:', error.message);
    }
  }

  async enablePerformanceMonitoring() {
    await this.page.evaluateOnNewDocument(() => {
      // Performance monitoring setup
      window.performanceMetrics = {
        navigationStart: performance.timing.navigationStart,
        measurements: [],
        marks: []
      };

      // Override console methods to capture logs
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      window.capturedLogs = [];

      console.log = (...args) => {
        window.capturedLogs.push({ type: 'log', message: args.join(' '), timestamp: Date.now() });
        originalLog.apply(console, args);
      };

      console.error = (...args) => {
        window.capturedLogs.push({ type: 'error', message: args.join(' '), timestamp: Date.now() });
        originalError.apply(console, args);
      };

      console.warn = (...args) => {
        window.capturedLogs.push({ type: 'warn', message: args.join(' '), timestamp: Date.now() });
        originalWarn.apply(console, args);
      };
    });
  }

  async takeScreenshot(description) {
    if (!this.page) throw new Error('Browser not initialized');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${this.testName}-${this.screenshotCounter++}-${description}-${timestamp}.png`;
    const screenshotPath = path.join(__dirname, '../screenshots', filename);

    // Ensure screenshots directory exists
    await fs.mkdir(path.dirname(screenshotPath), { recursive: true });

    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    console.log(`📸 Screenshot saved: ${filename}`);
    return screenshotPath;
  }

  async captureNetworkLogs() {
    const requests = [];
    const responses = [];

    this.page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        timestamp: Date.now()
      });
    });

    this.page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers(),
        timestamp: Date.now()
      });
    });

    return { requests, responses };
  }

  async getReactState() {
    return await this.page.evaluate(() => {
      // Access React Fiber for state inspection
      const reactFiber = document.querySelector('#__next')._reactInternalFiber ||
                        document.querySelector('#__next')._reactInternals;
      
      if (!reactFiber) return null;

      const getComponentState = (fiber) => {
        const states = [];
        
        const traverse = (node) => {
          if (node.memoizedState) {
            states.push({
              componentName: node.type?.name || 'Unknown',
              state: node.memoizedState,
              props: node.memoizedProps
            });
          }
          
          if (node.child) traverse(node.child);
          if (node.sibling) traverse(node.sibling);
        };

        traverse(fiber);
        return states;
      };

      return getComponentState(reactFiber);
    });
  }

  async getCapturedLogs() {
    return await this.page.evaluate(() => {
      return window.capturedLogs || [];
    });
  }

  async getPerformanceMetrics() {
    return await this.page.evaluate(() => {
      const timing = performance.timing;
      const navigation = performance.getEntriesByType('navigation')[0];
      
      return {
        // Page load metrics
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullyLoaded: timing.loadEventEnd - timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        
        // Navigation metrics
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ssl: timing.connectEnd - timing.secureConnectionStart,
        ttfb: timing.responseStart - timing.requestStart,
        download: timing.responseEnd - timing.responseStart,
        
        // Resource metrics
        resourceCount: performance.getEntriesByType('resource').length,
        totalResourceSize: performance.getEntriesByType('resource').reduce((total, resource) => {
          return total + (resource.transferSize || 0);
        }, 0),

        // Custom metrics
        customMetrics: window.performanceMetrics || {}
      };
    });
  }

  async waitForReactRender() {
    // Wait for React to finish rendering
    await this.page.waitForFunction(() => {
      return !document.querySelector('[data-testid="loading"]') &&
             !document.querySelector('.animate-spin');
    }, { timeout: 10000 });
  }

  async setTestName(name) {
    this.testName = name.replace(/[^a-zA-Z0-9]/g, '-');
    this.screenshotCounter = 0;
  }

  async cleanup() {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Helper method for evidence-based debugging
  async captureFullEvidence(description) {
    const evidence = {
      timestamp: new Date().toISOString(),
      description,
      screenshot: await this.takeScreenshot(description),
      reactState: await this.getReactState(),
      consoleLogs: await this.getCapturedLogs(),
      performanceMetrics: await this.getPerformanceMetrics(),
      url: this.page.url()
    };

    // Save evidence to file
    const evidencePath = path.join(__dirname, '../evidence', `${this.testName}-${description}-evidence.json`);
    await fs.mkdir(path.dirname(evidencePath), { recursive: true });
    await fs.writeFile(evidencePath, JSON.stringify(evidence, null, 2));

    return evidence;
  }
}

module.exports = BrowserManager;