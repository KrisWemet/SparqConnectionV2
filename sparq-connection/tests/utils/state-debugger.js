const path = require('path');
const fs = require('fs').promises;

class StateDebugger {
  constructor(browserManager) {
    this.browser = browserManager;
    this.stateHistory = [];
  }

  async captureReactState(description) {
    const state = await this.browser.page.evaluate(() => {
      // Helper function to safely serialize React state
      const serializeState = (obj, depth = 0, maxDepth = 3) => {
        if (depth > maxDepth) return '[Max Depth Reached]';
        if (obj === null || obj === undefined) return obj;
        if (typeof obj !== 'object') return obj;
        if (obj instanceof Date) return obj.toISOString();
        if (obj instanceof Error) return { error: obj.message };
        
        if (Array.isArray(obj)) {
          return obj.slice(0, 10).map(item => serializeState(item, depth + 1, maxDepth));
        }

        const serialized = {};
        for (const [key, value] of Object.entries(obj)) {
          if (key.startsWith('_') || key.includes('fiber') || key.includes('internal')) continue;
          try {
            serialized[key] = serializeState(value, depth + 1, maxDepth);
          } catch (e) {
            serialized[key] = '[Serialization Error]';
          }
        }
        return serialized;
      };

      // Capture various state sources
      const stateCapture = {
        timestamp: Date.now(),
        url: window.location.href,
        
        // Local storage state
        localStorage: {},
        
        // Session storage state  
        sessionStorage: {},
        
        // Global window state
        globalState: {},
        
        // React context values (if accessible)
        reactContext: {},
        
        // Component states (from React DevTools if available)
        componentStates: [],

        // Custom app state (if exposed)
        appState: {},

        // Performance state
        performance: {
          memory: performance.memory ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize
          } : null,
          timing: performance.timing ? {
            navigationStart: performance.timing.navigationStart,
            loadEventEnd: performance.timing.loadEventEnd
          } : null
        }
      };

      // Capture localStorage
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            stateCapture.localStorage[key] = localStorage.getItem(key);
          }
        }
      } catch (e) {
        stateCapture.localStorage = { error: 'Cannot access localStorage' };
      }

      // Capture sessionStorage
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            stateCapture.sessionStorage[key] = sessionStorage.getItem(key);
          }
        }
      } catch (e) {
        stateCapture.sessionStorage = { error: 'Cannot access sessionStorage' };
      }

      // Capture React state if available
      try {
        // Look for common React roots
        const reactRoot = document.querySelector('#__next') || document.querySelector('#root');
        if (reactRoot && reactRoot._reactInternalFiber) {
          const fiber = reactRoot._reactInternalFiber;
          stateCapture.reactContext.hasFiber = true;
        } else if (reactRoot && reactRoot._reactInternals) {
          const fiber = reactRoot._reactInternals;
          stateCapture.reactContext.hasFiber = true;
        }
      } catch (e) {
        stateCapture.reactContext = { error: 'Cannot access React state' };
      }

      // Capture custom app state if exposed globally
      if (window.__APP_STATE__) {
        stateCapture.appState = serializeState(window.__APP_STATE__);
      }

      // Capture auth state indicators
      stateCapture.authIndicators = {
        hasAuthToken: !!localStorage.getItem('supabase.auth.token'),
        hasSessionCookie: document.cookie.includes('session'),
        isOnProtectedRoute: window.location.pathname.includes('/dashboard'),
        hasUserData: !!document.querySelector('[data-testid="user-info"]')
      };

      // Capture couple state indicators
      stateCapture.coupleIndicators = {
        hasPartnerInfo: !!document.querySelector('[data-testid="partner-info"]'),
        isInviteModalOpen: !!document.querySelector('[data-testid="invite-modal"]'),
        hasConnectionStatus: !!document.querySelector('[data-testid="connection-status"]')
      };

      return stateCapture;
    });

    const stateEntry = {
      description,
      timestamp: new Date().toISOString(),
      state
    };

    this.stateHistory.push(stateEntry);
    
    // Save state to file
    await this.saveStateToFile(stateEntry);
    
    return stateEntry;
  }

  async captureAuthState() {
    return await this.browser.page.evaluate(() => {
      return {
        // Check for auth-related elements
        isOnAuthPage: window.location.pathname.includes('/auth'),
        isOnDashboard: window.location.pathname.includes('/dashboard'),
        hasSignInForm: !!document.querySelector('form input[name="email"]'),
        hasSignUpForm: !!document.querySelector('form input[name="displayName"]'),
        isLoading: !!document.querySelector('.animate-spin'),
        hasErrorMessage: !!document.querySelector('.text-red-600'),
        hasSuccessMessage: !!document.querySelector('.text-green-600'),
        
        // Check form state
        formData: {
          email: document.querySelector('input[name="email"]')?.value || '',
          hasPassword: !!document.querySelector('input[name="password"]')?.value,
          displayName: document.querySelector('input[name="displayName"]')?.value || ''
        },
        
        // Check button states
        buttonStates: {
          isSubmitDisabled: !!document.querySelector('button[type="submit"][disabled]'),
          isLoading: !!document.querySelector('button[type="submit"] .animate-spin')
        }
      };
    });
  }

  async captureCoupleState() {
    return await this.browser.page.evaluate(() => {
      return {
        // Couple connection indicators
        hasPartner: !!document.querySelector('[data-testid="partner-name"]'),
        connectionStatus: document.querySelector('[data-testid="connection-status"]')?.textContent || 'unknown',
        streakCount: document.querySelector('[data-testid="streak-count"]')?.textContent || '0',
        healthScore: document.querySelector('[data-testid="health-score"]')?.textContent || 'unknown',
        
        // Invitation state
        isInviteModalOpen: !!document.querySelector('[data-testid="invite-modal"]'),
        hasInviteCode: !!document.querySelector('[data-testid="invite-code"]'),
        inviteCode: document.querySelector('[data-testid="invite-code"]')?.textContent || '',
        
        // Dashboard state
        isOnDashboard: window.location.pathname.includes('/dashboard'),
        hasWelcomeMessage: !!document.querySelector('h1:contains("Welcome")'),
        hasTodaysQuestion: !!document.querySelector('[data-testid="todays-question"]'),
        
        // Getting started checklist
        checklistItems: Array.from(document.querySelectorAll('[data-testid^="checklist-"]')).map(item => ({
          id: item.getAttribute('data-testid'),
          completed: item.classList.contains('completed') || !!item.querySelector('.text-green-700'),
          text: item.textContent.trim()
        }))
      };
    });
  }

  async detectStateChanges(previousState, currentState) {
    const changes = [];
    
    const compareObjects = (prev, curr, path = '') => {
      if (typeof prev !== typeof curr) {
        changes.push({
          path,
          type: 'type-change',
          from: typeof prev,
          to: typeof curr
        });
        return;
      }

      if (typeof prev === 'object' && prev !== null && curr !== null) {
        // Check for added keys
        for (const key in curr) {
          if (!(key in prev)) {
            changes.push({
              path: path ? `${path}.${key}` : key,
              type: 'added',
              value: curr[key]
            });
          } else {
            compareObjects(prev[key], curr[key], path ? `${path}.${key}` : key);
          }
        }
        
        // Check for removed keys
        for (const key in prev) {
          if (!(key in curr)) {
            changes.push({
              path: path ? `${path}.${key}` : key,
              type: 'removed',
              value: prev[key]
            });
          }
        }
      } else if (prev !== curr) {
        changes.push({
          path,
          type: 'value-change',
          from: prev,
          to: curr
        });
      }
    };

    compareObjects(previousState.state, currentState.state);
    
    return {
      timestamp: new Date().toISOString(),
      fromDescription: previousState.description,
      toDescription: currentState.description,
      changes
    };
  }

  async saveStateToFile(stateEntry) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `state-${this.browser.testName}-${timestamp}.json`;
    const statePath = path.join(__dirname, '../state-dumps', filename);

    await fs.mkdir(path.dirname(statePath), { recursive: true });
    await fs.writeFile(statePath, JSON.stringify(stateEntry, null, 2));
    
    console.log(`🧠 State captured: ${filename}`);
    return statePath;
  }

  async generateStateReport() {
    const report = {
      testName: this.browser.testName,
      timestamp: new Date().toISOString(),
      totalStateCaptures: this.stateHistory.length,
      stateHistory: this.stateHistory,
      changes: []
    };

    // Generate changes between consecutive states
    for (let i = 1; i < this.stateHistory.length; i++) {
      const changes = await this.detectStateChanges(
        this.stateHistory[i - 1],
        this.stateHistory[i]
      );
      report.changes.push(changes);
    }

    // Save report
    const reportPath = path.join(__dirname, '../reports', `state-report-${this.browser.testName}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`📊 State report generated: state-report-${this.browser.testName}.json`);
    return report;
  }

  // Helper method to track specific state transitions
  async trackStateTransition(actionDescription, actionFunction) {
    const beforeState = await this.captureReactState(`before-${actionDescription}`);
    
    // Perform the action
    const result = await actionFunction();
    
    const afterState = await this.captureReactState(`after-${actionDescription}`);
    
    // Detect changes
    const changes = await this.detectStateChanges(beforeState, afterState);
    
    return {
      action: actionDescription,
      before: beforeState,
      after: afterState,
      changes,
      result
    };
  }

  async waitForStateChange(stateSelector, expectedValue, timeout = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const currentState = await this.captureReactState('state-check');
      
      // This would need to be customized based on the actual state structure
      if (this.getNestedValue(currentState.state, stateSelector) === expectedValue) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`State did not change to expected value within ${timeout}ms`);
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  // Method to clear state history (useful between tests)
  clearHistory() {
    this.stateHistory = [];
  }
}

module.exports = StateDebugger;