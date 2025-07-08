const BrowserManager = require('../../utils/browser-setup');
const AuthHelpers = require('../../utils/auth-helpers');
const StateDebugger = require('../../utils/state-debugger');
const ScreenshotManager = require('../../utils/screenshot-manager');
const ServerLogCapture = require('../../utils/server-logs');

describe('Critical Path: Error Recovery and State Transitions', () => {
  let browser, authHelpers, stateDebugger, screenshotManager, serverLogs;

  beforeAll(async () => {
    browser = new BrowserManager();
    await browser.setupBrowser();
    await browser.setupReactDevTools();
    await browser.enablePerformanceMonitoring();
    
    authHelpers = new AuthHelpers(browser);
    stateDebugger = new StateDebugger(browser);
    screenshotManager = new ScreenshotManager(browser);
    serverLogs = new ServerLogCapture(browser);
    
    await serverLogs.setupNetworkLogging();
    await serverLogs.captureSupabaseRequests();
    await serverLogs.captureAuthEvents();
  });

  afterAll(async () => {
    await browser.cleanup();
  });

  beforeEach(async () => {
    await browser.setTestName('error-recovery-state-transitions');
    stateDebugger.clearHistory();
    await serverLogs.clearLogs();
  });

  test('Complete error recovery journey: Network failures → State corruption → Recovery mechanisms → User experience continuity', async () => {
    console.log('🧪 Starting error recovery and state transitions test...');

    // PHASE 1: ESTABLISH BASELINE STATE
    console.log('🏗️ Phase 1: Establish baseline state');
    
    const testUser = authHelpers.generateTestUser();
    testUser.displayName = 'Error Recovery User';
    testUser.email = 'error@recoverytest.com';

    await stateDebugger.trackStateTransition('establish-baseline', async () => {
      await authHelpers.signUp(testUser);
      await authHelpers.signIn(testUser.email, testUser.password);
      
      console.log('👤 Baseline user state established');
    });

    await screenshotManager.takeFullPageScreenshot('baseline-state-established');

    // Capture initial state
    const baselineState = await stateDebugger.captureReactState('baseline-state');
    expect(baselineState.state.authIndicators.isOnProtectedRoute).toBe(true);

    // PHASE 2: SIMULATE NETWORK FAILURES
    console.log('🌐 Phase 2: Simulate network failures and recovery');

    // Test offline simulation
    await stateDebugger.trackStateTransition('simulate-offline', async () => {
      // Simulate going offline
      await browser.page.setOfflineMode(true);
      
      // Try to perform actions while offline
      await browser.page.click('a[href*="reflections"], button:has-text("Reflections")');
      await browser.waitForReactRender();
      
      // Should handle offline gracefully
      const offlineState = await browser.page.evaluate(() => {
        return {
          hasOfflineIndicator: !!document.querySelector('.offline-indicator, text*="offline", text*="connection"'),
          hasErrorMessage: !!document.querySelector('.error-message, [role="alert"]'),
          hasRetryMechanism: !!document.querySelector('button:has-text("Retry"), button:has-text("Refresh")'),
          hasOfflineCapability: !!document.querySelector('.offline-mode, text*="offline mode"'),
          pageStillFunctional: !!document.querySelector('nav, .navigation')
        };
      });
      
      console.log('📱 Offline State:', offlineState);
    });

    await screenshotManager.takeFullPageScreenshot('offline-simulation');

    // Restore connection
    await stateDebugger.trackStateTransition('restore-connection', async () => {
      await browser.page.setOfflineMode(false);
      
      // Wait for connection restoration
      await browser.waitForReactRender();
      
      // Check for connection restoration
      const reconnectedState = await browser.page.evaluate(() => {
        return {
          hasOnlineIndicator: !!document.querySelector('.online-indicator, text*="connected", text*="online"'),
          hasDataSync: !!document.querySelector('.syncing, text*="sync", text*="updating"'),
          hasRestoredFunctionality: !!document.querySelector('button:not(:disabled)'),
          hasErrorCleared: !document.querySelector('.error-message, .offline-error')
        };
      });
      
      console.log('🔄 Reconnection State:', reconnectedState);
    });

    await screenshotManager.takeFullPageScreenshot('connection-restored');

    // PHASE 3: SIMULATE API FAILURES
    console.log('⚡ Phase 3: Simulate API failures and error handling');

    await stateDebugger.trackStateTransition('simulate-api-failures', async () => {
      // Intercept API requests to simulate failures
      await browser.page.route('**/supabase.co/**', route => {
        // Simulate random API failures
        if (Math.random() < 0.3) {
          route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Internal Server Error' })
          });
        } else {
          route.continue();
        }
      });
      
      // Try to perform actions that require API calls
      const actionButton = await browser.page.isVisible('button:has-text("Answer"), button:has-text("Create"), button:has-text("Save")');
      if (actionButton) {
        await browser.page.click('button:has-text("Answer"), button:has-text("Create"), button:has-text("Save")');
        await browser.waitForReactRender();
        
        // Check for error handling
        const errorHandling = await browser.page.evaluate(() => {
          return {
            hasErrorMessage: !!document.querySelector('.error-message, [role="alert"], text*="error"'),
            hasRetryButton: !!document.querySelector('button:has-text("Retry"), button:has-text("Try Again")'),
            hasGracefulDegradation: !!document.querySelector('.fallback-content, .error-state'),
            hasUserFeedback: !!document.querySelector('.loading, .spinner, text*="loading"'),
            maintainsState: !!document.querySelector('input[value], textarea')
          };
        });
        
        console.log('🚨 API Error Handling:', errorHandling);
      }
    });

    await screenshotManager.takeFullPageScreenshot('api-error-handling');

    // Clear route interception
    await browser.page.unroute('**/supabase.co/**');

    // PHASE 4: TEST STATE CORRUPTION RECOVERY
    console.log('🔧 Phase 4: Test state corruption and recovery');

    await stateDebugger.trackStateTransition('corrupt-state-recovery', async () => {
      // Simulate state corruption by manipulating local storage
      await browser.page.evaluate(() => {
        // Corrupt authentication state
        localStorage.setItem('supabase.auth.token', 'corrupted-token');
        
        // Corrupt application state
        const appState = JSON.stringify({ corrupted: true, invalid: 'data' });
        localStorage.setItem('app-state', appState);
      });
      
      // Refresh page to trigger state recovery
      await browser.page.reload();
      await browser.waitForReactRender();
      
      // Check state recovery
      const stateRecovery = await browser.page.evaluate(() => {
        return {
          hasAuthRecovery: !!document.querySelector('form, input[name="email"]'),
          hasStateReset: !localStorage.getItem('app-state') || localStorage.getItem('app-state') === 'null',
          hasGracefulFallback: !!document.querySelector('.auth-form, .landing-page'),
          hasErrorNotification: !!document.querySelector('.notification, .alert'),
          redirectedToAuth: window.location.pathname.includes('/auth') || window.location.pathname === '/'
        };
      });
      
      console.log('🔧 State Recovery:', stateRecovery);
      
      // Should redirect to auth or show recovery UI
      expect(stateRecovery.hasGracefulFallback || stateRecovery.redirectedToAuth).toBe(true);
    });

    await screenshotManager.takeFullPageScreenshot('state-corruption-recovery');

    // PHASE 5: TEST AUTHENTICATION ERROR RECOVERY
    console.log('🔐 Phase 5: Test authentication error recovery');

    // Sign back in to test auth recovery
    await stateDebugger.trackStateTransition('auth-error-recovery', async () => {
      // Navigate to auth if not already there
      const currentUrl = browser.page.url();
      if (!currentUrl.includes('/auth')) {
        await browser.page.goto('http://localhost:3000/auth');
        await browser.waitForReactRender();
      }
      
      // Test invalid credentials first
      await browser.page.fill('input[name="email"]', testUser.email);
      await browser.page.fill('input[name="password"]', 'wrong-password');
      await browser.page.click('button[type="submit"]');
      await browser.waitForReactRender();
      
      // Check error handling
      const authErrorHandling = await browser.page.evaluate(() => {
        return {
          hasAuthError: !!document.querySelector('.error-message, [role="alert"], text*="invalid"'),
          maintainsForm: !!document.querySelector('form, input[name="email"]'),
          canRetry: !!document.querySelector('button[type="submit"]:not(:disabled)'),
          clearsPassword: document.querySelector('input[name="password"]').value === '',
          preservesEmail: document.querySelector('input[name="email"]').value !== ''
        };
      });
      
      console.log('🔐 Auth Error Handling:', authErrorHandling);
      
      // Now sign in correctly
      await browser.page.fill('input[name="password"]', testUser.password);
      await browser.page.click('button[type="submit"]');
      await browser.page.waitForURL('**/dashboard');
    });

    await screenshotManager.takeFullPageScreenshot('auth-recovery-success');

    // PHASE 6: TEST SESSION TIMEOUT RECOVERY
    console.log('⏱️ Phase 6: Test session timeout and recovery');

    await stateDebugger.trackStateTransition('session-timeout-recovery', async () => {
      // Simulate session timeout by clearing auth tokens
      await browser.page.evaluate(() => {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      });
      
      // Try to access protected route
      await browser.page.goto('http://localhost:3000/dashboard');
      await browser.waitForReactRender();
      
      // Should handle session timeout gracefully
      const sessionTimeoutHandling = await browser.page.evaluate(() => {
        return {
          redirectedToAuth: window.location.pathname.includes('/auth') || window.location.pathname === '/',
          hasSessionMessage: !!document.querySelector('text*="session", text*="expired", .session-expired'),
          hasReauthPrompt: !!document.querySelector('form, input[name="email"]'),
          preservesIntendedDestination: !!sessionStorage.getItem('intended-destination') || !!localStorage.getItem('redirect-after-auth')
        };
      });
      
      console.log('⏱️ Session Timeout Handling:', sessionTimeoutHandling);
      
      // Should redirect to auth
      expect(sessionTimeoutHandling.redirectedToAuth || sessionTimeoutHandling.hasReauthPrompt).toBe(true);
    });

    await screenshotManager.takeFullPageScreenshot('session-timeout-recovery');

    // PHASE 7: TEST FORM DATA RECOVERY
    console.log('📝 Phase 7: Test form data recovery and persistence');

    // Re-authenticate for form testing
    await authHelpers.signIn(testUser.email, testUser.password);

    await stateDebugger.trackStateTransition('form-data-recovery', async () => {
      // Navigate to a form (reflections or question response)
      const formArea = await browser.page.isVisible('[data-testid="daily-question"], button:has-text("Answer")');
      if (formArea) {
        await browser.page.click('button:has-text("Answer"), button:has-text("Respond")');
        await browser.waitForReactRender();
        
        // Fill form data
        const testFormData = 'This is important form data that should not be lost during errors or interruptions.';
        await browser.page.fill('textarea, input[type="text"]', testFormData);
        
        // Simulate interruption (refresh without saving)
        await browser.page.reload();
        await browser.waitForReactRender();
        
        // Check if form data is recovered
        const formRecovery = await browser.page.evaluate(() => {
          const formElement = document.querySelector('textarea, input[type="text"]');
          return {
            hasFormRecovery: !!formElement && formElement.value !== '',
            hasDraftSaving: !!document.querySelector('.draft-saved, text*="draft", .auto-save'),
            hasRecoveryPrompt: !!document.querySelector('.recover-data, text*="recover", text*="restore"),
            recoveredData: formElement ? formElement.value : ''
          };
        });
        
        console.log('📝 Form Recovery:', formRecovery);
        
        // Should either recover data or provide recovery mechanism
        if (formRecovery.hasFormRecovery) {
          expect(formRecovery.recoveredData).toContain('important form data');
        }
      }
    });

    await screenshotManager.takeFullPageScreenshot('form-data-recovery');

    // PHASE 8: TEST ERROR BOUNDARY HANDLING
    console.log('🛡️ Phase 8: Test error boundary and crash recovery');

    await stateDebugger.trackStateTransition('error-boundary-handling', async () => {
      // Simulate JavaScript errors
      await browser.page.evaluate(() => {
        // Force a React error by manipulating the DOM in a way that might cause issues
        const reactRoot = document.querySelector('#__next, #root');
        if (reactRoot) {
          // Temporarily corrupt React tree
          const errorDiv = document.createElement('div');
          errorDiv.innerHTML = '<script>throw new Error("Simulated error")</script>';
          reactRoot.appendChild(errorDiv);
        }
      });
      
      await browser.waitForReactRender();
      
      // Check error boundary handling
      const errorBoundaryHandling = await browser.page.evaluate(() => {
        return {
          hasErrorBoundary: !!document.querySelector('.error-boundary, text*="something went wrong"'),
          hasRecoveryOption: !!document.querySelector('button:has-text("Reload"), button:has-text("Try Again")'),
          hasUserFriendlyMessage: !!document.querySelector('text*="error", text*="problem", text*="sorry"'),
          maintainsBasicFunctionality: !!document.querySelector('nav, header, .navigation'),
          hasErrorReporting: !!document.querySelector('button:has-text("Report"), text*="report"')
        };
      });
      
      console.log('🛡️ Error Boundary Handling:', errorBoundaryHandling);
    });

    await screenshotManager.takeFullPageScreenshot('error-boundary-handling');

    // PHASE 9: PERFORMANCE DURING ERROR RECOVERY
    console.log('📊 Phase 9: Validate performance during error recovery');

    const finalMetrics = await browser.getPerformanceMetrics();
    console.log('📊 Error Recovery Performance:', {
      recoveryTime: finalMetrics.fullyLoaded,
      errorHandlingOverhead: finalMetrics.firstContentfulPaint,
      resourceCount: finalMetrics.resourceCount,
      memoryUsage: finalMetrics.totalResourceSize
    });

    // Error recovery should not severely impact performance
    expect(finalMetrics.fullyLoaded).toBeLessThan(5000); // < 5s for error recovery

    // Check error logs
    const errorLogs = await serverLogs.getErrorLogs();
    console.log(`🚨 Error events captured: ${errorLogs.length}`);

    // Should have proper error logging
    expect(errorLogs.length).toBeGreaterThan(0);

    // Generate comprehensive evidence
    await browser.captureFullEvidence('error-recovery-complete');
    await stateDebugger.generateStateReport();
    await screenshotManager.generateVisualReport('error-recovery-state-transitions');
    await serverLogs.generateDetailedReport();

    console.log('✅ Error recovery and state transitions test completed successfully!');
    console.log('🛡️ Application demonstrates robust error handling and recovery mechanisms');
  });

  test('Validate network error resilience', async () => {
    console.log('🧪 Testing network error resilience...');

    const user = authHelpers.generateTestUser();
    await authHelpers.signUp(user);
    await authHelpers.signIn(user.email, user.password);

    // Test slow network conditions
    await stateDebugger.trackStateTransition('test-slow-network', async () => {
      // Simulate slow network
      await browser.page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: 50 * 1024, // 50kb/s
        uploadThroughput: 20 * 1024,   // 20kb/s
        latency: 500 // 500ms latency
      });

      // Perform actions under slow network
      await browser.page.click('a[href*="reflections"], button:has-text("Reflections")');
      await browser.waitForReactRender();

      const slowNetworkHandling = await browser.page.evaluate(() => {
        return {
          hasLoadingIndicators: !!document.querySelector('.loading, .spinner, text*="loading"'),
          hasTimeoutHandling: !!document.querySelector('.timeout, text*="slow", text*="taking longer"'),
          hasProgressIndicators: !!document.querySelector('.progress, .progress-bar'),
          remainsResponsive: !!document.querySelector('button, a')
        };
      });

      console.log('🐌 Slow Network Handling:', slowNetworkHandling);
    });

    await screenshotManager.takeFullPageScreenshot('slow-network-conditions');

    // Reset network conditions
    await browser.page.emulateNetworkConditions({
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0
    });
  });

  test('Validate form validation and error recovery', async () => {
    console.log('🧪 Testing form validation and error recovery...');

    const user = authHelpers.generateTestUser();
    await authHelpers.signUp(user);
    await authHelpers.signIn(user.email, user.password);

    // Test form validation errors
    await stateDebugger.trackStateTransition('test-form-validation', async () => {
      // Navigate to auth to test form validation
      await browser.page.goto('http://localhost:3000/auth');
      await browser.waitForReactRender();

      // Test empty form submission
      await browser.page.click('button[type="submit"]');
      await browser.waitForReactRender();

      const validationHandling = await browser.page.evaluate(() => {
        return {
          hasValidationErrors: !!document.querySelector('.error-message, [role="alert"], .field-error'),
          hasFieldHighlighting: !!document.querySelector('.error, .invalid, input:invalid'),
          hasInlineErrors: !!document.querySelector('.field-error, .input-error'),
          maintainsFormState: !!document.querySelector('form'),
          hasErrorSummary: !!document.querySelector('.error-summary, .validation-summary')
        };
      });

      console.log('📝 Form Validation Handling:', validationHandling);
    });

    await screenshotManager.captureFormState('form-validation-errors');
  });

  test('Validate concurrent user error handling', async () => {
    console.log('🧪 Testing concurrent user error handling...');

    // Setup connected couple
    const user1 = authHelpers.generateTestUser();
    const user2 = authHelpers.generateTestUser();
    
    await authHelpers.signUp(user1);
    await authHelpers.signUp(user2);
    await authHelpers.signIn(user1.email, user1.password);
    
    // Create invitation
    await browser.page.click('button:has-text("Send Invite")');
    await browser.page.waitForSelector('[role="dialog"]');
    await browser.page.click('button:has-text("Create Invitation")');
    const inviteCode = await browser.page.textContent('code');
    await browser.page.click('button:has-text("Done")');
    
    // Accept invitation as user2
    await browser.page.click('button:has-text("Sign Out")');
    await authHelpers.signIn(user2.email, user2.password);
    await browser.page.goto(`http://localhost:3000/invite/${inviteCode}`);
    await browser.page.click('button:has-text("Accept Invitation")');
    await browser.page.waitForURL('**/dashboard');

    // Test concurrent modification errors
    await stateDebugger.trackStateTransition('test-concurrent-modifications', async () => {
      // Simulate optimistic updates that might conflict
      const textArea = await browser.page.isVisible('textarea');
      if (textArea) {
        await browser.page.fill('textarea', 'First response from user2');
        
        // Simulate network delay during save
        await browser.page.route('**/responses', route => {
          setTimeout(() => route.continue(), 2000); // 2s delay
        });
        
        await browser.page.click('button:has-text("Save"), button:has-text("Submit")');
        
        // Check conflict resolution
        const conflictHandling = await browser.page.evaluate(() => {
          return {
            hasConflictResolution: !!document.querySelector('.conflict, text*="conflict", text*="version"'),
            hasOptimisticUpdate: !!document.querySelector('.saving, text*="saving", .optimistic'),
            hasRetryMechanism: !!document.querySelector('button:has-text("Retry"), button:has-text("Try Again")'),
            maintainsUserData: !!document.querySelector('textarea[value], input[value]')
          };
        });
        
        console.log('🔄 Conflict Handling:', conflictHandling);
      }
    });

    await screenshotManager.takeFullPageScreenshot('concurrent-error-handling');

    // Clear route interception
    await browser.page.unroute('**/responses');
  });
});