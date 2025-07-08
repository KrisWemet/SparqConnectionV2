const BrowserManager = require('../../utils/browser-setup');
const AuthHelpers = require('../../utils/auth-helpers');
const StateDebugger = require('../../utils/state-debugger');
const ScreenshotManager = require('../../utils/screenshot-manager');
const ServerLogCapture = require('../../utils/server-logs');

describe('Critical Path: Returning User Authentication', () => {
  let browser, authHelpers, stateDebugger, screenshotManager, serverLogs;
  let existingUser, partnerUser;

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
    await browser.setTestName('returning-user-authentication');
    stateDebugger.clearHistory();
    await serverLogs.clearLogs();
  });

  test('Complete returning user journey: Sign in → Session restore → Dashboard state persistence → Activity continuation', async () => {
    console.log('🧪 Starting returning user authentication test...');

    // PHASE 1: SETUP EXISTING USER WITH HISTORY
    console.log('👤 Phase 1: Setup existing user with partner and activity history');
    
    // Create established user with partner
    existingUser = authHelpers.generateTestUser();
    existingUser.displayName = 'Sarah Johnson';
    existingUser.email = 'sarah.returning@sparqtest.com';
    
    partnerUser = authHelpers.generateTestUser();
    partnerUser.displayName = 'Mike Johnson';
    partnerUser.email = 'mike.partner@sparqtest.com';

    await stateDebugger.trackStateTransition('setup-existing-users', async () => {
      // Create both users
      await authHelpers.signUp(existingUser);
      await authHelpers.signUp(partnerUser);
      
      // Sign in as first user and create invitation
      await authHelpers.signIn(existingUser.email, existingUser.password);
      await browser.page.click('button:has-text("Send Invite")');
      await browser.page.waitForSelector('[role="dialog"]');
      await browser.page.click('button:has-text("Create Invitation")');
      await browser.page.waitForSelector('text="Invitation Created!"');
      
      const inviteCode = await browser.page.textContent('code');
      await browser.page.click('button:has-text("Done")');
      
      // Sign out and sign in as partner to accept invitation
      await browser.page.click('button:has-text("Sign Out")');
      await authHelpers.signIn(partnerUser.email, partnerUser.password);
      await browser.page.goto(`http://localhost:3000/invite/${inviteCode}`);
      await browser.page.click('button:has-text("Accept Invitation")');
      await browser.page.waitForURL('**/dashboard');
      
      console.log('👥 Couple successfully established');
    });

    // Create some activity history (answer a question, create reflection)
    await stateDebugger.trackStateTransition('create-activity-history', async () => {
      // Simulate daily question interaction
      const dailyQuestionExists = await browser.page.isVisible('[data-testid="daily-question"], h3:has-text("Today\'s Question")');
      if (dailyQuestionExists) {
        await browser.page.click('button:has-text("Answer Question")');
        await browser.page.fill('textarea', 'This is my thoughtful response to today\'s question.');
        await browser.page.click('button:has-text("Save Response")');
        await browser.waitForReactRender();
      }
      
      console.log('📝 Activity history created');
    });

    await screenshotManager.takeFullPageScreenshot('user-with-history-established');

    // Sign out to simulate returning user scenario
    await stateDebugger.trackStateTransition('sign-out-established-user', async () => {
      await browser.page.click('button:has-text("Sign Out")');
      await browser.page.waitForURL('http://localhost:3000/');
    });

    // PHASE 2: RETURNING USER DIRECT SIGN IN
    console.log('🔑 Phase 2: Returning user direct sign in');

    await stateDebugger.trackStateTransition('navigate-to-auth-returning', async () => {
      await browser.page.goto('http://localhost:3000/auth');
      await browser.waitForReactRender();
    });

    await screenshotManager.takeFullPageScreenshot('auth-page-returning-user');

    // Test direct sign in (should already be on sign in form)
    await stateDebugger.trackStateTransition('returning-user-signin', async () => {
      await browser.page.fill('input[name="email"]', existingUser.email);
      await browser.page.fill('input[name="password"]', existingUser.password);
      
      const signInStart = Date.now();
      await browser.page.click('button[type="submit"]');
      await browser.page.waitForURL('**/dashboard', { timeout: 15000 });
      await browser.waitForReactRender();
      
      const signInTime = Date.now() - signInStart;
      console.log(`🚀 Sign in completed in ${signInTime}ms`);
    });

    await screenshotManager.takeFullPageScreenshot('returning-user-dashboard-loaded');

    // PHASE 3: VERIFY SESSION AND STATE RESTORATION
    console.log('🔄 Phase 3: Verify session and state restoration');

    // Check couple state is restored
    const restoredCoupleState = await stateDebugger.captureCoupleState();
    expect(restoredCoupleState.hasPartner).toBe(true);
    expect(restoredCoupleState.isOnDashboard).toBe(true);

    // Verify partner information is displayed
    const partnerDisplayed = await browser.page.isVisible('[data-testid="partner-name"], text*="connected with"');
    expect(partnerDisplayed).toBe(true);

    // Check authentication state
    const authState = await stateDebugger.captureAuthState();
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.hasValidSession).toBe(true);

    // PHASE 4: TEST SESSION PERSISTENCE ACROSS REFRESH
    console.log('💾 Phase 4: Test session persistence across refresh');

    const beforeRefreshState = await stateDebugger.captureReactState('before-refresh');

    await stateDebugger.trackStateTransition('test-session-persistence', async () => {
      await browser.page.reload();
      await browser.waitForReactRender();
    });

    await screenshotManager.takeFullPageScreenshot('after-refresh-session-maintained');

    const afterRefreshState = await stateDebugger.captureReactState('after-refresh');

    // Should remain authenticated
    expect(afterRefreshState.state.authIndicators.isOnProtectedRoute).toBe(true);

    // Test session persistence helper
    const sessionPersistent = await authHelpers.testSessionPersistence();
    expect(sessionPersistent).toBe(true);

    // PHASE 5: TEST DEEP LINK HANDLING
    console.log('🔗 Phase 5: Test deep link handling while authenticated');

    await stateDebugger.trackStateTransition('test-deep-link-handling', async () => {
      // Try to access auth page while authenticated (should redirect to dashboard)
      await browser.page.goto('http://localhost:3000/auth');
      await browser.waitForReactRender();
      
      // Should redirect back to dashboard
      const currentUrl = browser.page.url();
      expect(currentUrl).toContain('/dashboard');
    });

    // Test accessing protected routes
    await stateDebugger.trackStateTransition('test-protected-route-access', async () => {
      await browser.page.goto('http://localhost:3000/reflections');
      await browser.waitForReactRender();
      
      // Should successfully access protected route
      const url = browser.page.url();
      expect(url).toContain('/reflections');
    });

    await screenshotManager.takeFullPageScreenshot('protected-route-accessed');

    // PHASE 6: TEST ACTIVITY CONTINUATION
    console.log('📊 Phase 6: Test activity continuation and state preservation');

    // Return to dashboard
    await browser.page.goto('http://localhost:3000/dashboard');
    await browser.waitForReactRender();

    // Check if previous activity is preserved
    const activityState = await browser.page.evaluate(() => {
      return {
        hasConnectionStreak: !!document.querySelector('[data-testid="connection-streak"], text*="streak"'),
        hasRecentActivity: !!document.querySelector('[data-testid="recent-activity"], .activity-list'),
        hasPartnerInfo: !!document.querySelector('[data-testid="partner-name"], text*="connected"'),
        hasDailyQuestion: !!document.querySelector('[data-testid="daily-question"], h3:has-text("Today\'s Question")')
      };
    });

    console.log('📊 Activity State Check:', activityState);

    // Should have preserved couple connection
    expect(activityState.hasPartnerInfo).toBe(true);

    // PHASE 7: TEST CONCURRENT SESSION HANDLING
    console.log('👥 Phase 7: Test concurrent session handling');

    // Open new tab with same user
    const newPage = await browser.context.newPage();
    await stateDebugger.trackStateTransition('test-concurrent-session', async () => {
      await newPage.goto('http://localhost:3000/dashboard');
      await newPage.waitForLoadState('networkidle');
      
      // Both tabs should maintain authentication
      const newPageAuthenticated = await newPage.evaluate(() => {
        return !!document.querySelector('[data-testid="user-menu"], [data-testid="sign-out"]');
      });
      
      expect(newPageAuthenticated).toBe(true);
    });

    await newPage.close();

    // PHASE 8: PERFORMANCE AND SECURITY VALIDATION
    console.log('🔒 Phase 8: Performance and security validation');

    const finalMetrics = await browser.getPerformanceMetrics();
    console.log('📊 Sign-in Performance Metrics:', {
      dashboardLoadTime: finalMetrics.fullyLoaded,
      firstContentfulPaint: finalMetrics.firstContentfulPaint,
      resourceCount: finalMetrics.resourceCount,
      cacheEfficiency: finalMetrics.fromCache || 0
    });

    // Validate performance targets for returning users (should be faster due to caching)
    expect(finalMetrics.fullyLoaded).toBeLessThan(1500); // < 1.5s for returning users
    expect(finalMetrics.firstContentfulPaint).toBeLessThan(800); // < 800ms FCP

    // Check authentication security
    const authLogs = await serverLogs.getAuthLogs();
    const authErrors = authLogs.filter(log => log.level === 'error');
    expect(authErrors.length).toBe(0);

    // Verify secure session handling
    const sessionLogs = authLogs.filter(log => log.event === 'session_refresh' || log.event === 'token_refresh');
    console.log(`🔐 Found ${sessionLogs.length} session management events`);

    // Generate comprehensive evidence
    await browser.captureFullEvidence('returning-user-auth-complete');
    await stateDebugger.generateStateReport();
    await screenshotManager.generateVisualReport('returning-user-authentication');
    await serverLogs.generateDetailedReport();

    console.log('✅ Returning user authentication test completed successfully!');
    console.log(`🎉 ${existingUser.displayName} successfully authenticated and state restored`);
  });

  test('Validate forgot password flow for returning users', async () => {
    console.log('🧪 Testing forgot password flow...');

    await browser.page.goto('http://localhost:3000/auth');
    await browser.waitForReactRender();

    await stateDebugger.trackStateTransition('forgot-password-flow', async () => {
      await browser.page.click('text="Forgot your password?"');
      await browser.waitForReactRender();
      
      // Fill email
      await browser.page.fill('input[name="email"]', 'test@example.com');
      await browser.page.click('button:has-text("Send Reset Link")');
      await browser.page.waitForSelector('text="Check your email"');
    });

    await screenshotManager.captureFormState('password-reset-sent');

    // Verify success state
    const resetState = await browser.page.evaluate(() => {
      return {
        hasSuccessMessage: !!document.querySelector('text="Check your email"'),
        hasBackToSignIn: !!document.querySelector('button:has-text("Back to Sign In")')
      };
    });

    expect(resetState.hasSuccessMessage).toBe(true);
    expect(resetState.hasBackToSignIn).toBe(true);
  });

  test('Validate invalid credential handling', async () => {
    console.log('🧪 Testing invalid credential handling...');

    await browser.page.goto('http://localhost:3000/auth');
    await browser.waitForReactRender();

    await stateDebugger.trackStateTransition('test-invalid-credentials', async () => {
      await browser.page.fill('input[name="email"]', 'invalid@example.com');
      await browser.page.fill('input[name="password"]', 'wrongpassword');
      await browser.page.click('button[type="submit"]');
      
      // Should show error message
      await browser.page.waitForSelector('text*="Invalid"', { timeout: 5000 });
    });

    await screenshotManager.captureErrorState('invalid-credentials');

    const errorState = await browser.page.evaluate(() => {
      return {
        hasErrorMessage: !!document.querySelector('[role="alert"], .error-message, text*="Invalid"'),
        formStillVisible: !!document.querySelector('form'),
        canRetry: !!document.querySelector('button[type="submit"]')
      };
    });

    expect(errorState.hasErrorMessage).toBe(true);
    expect(errorState.formStillVisible).toBe(true);
    expect(errorState.canRetry).toBe(true);
  });

  test('Validate session timeout and renewal', async () => {
    console.log('🧪 Testing session timeout handling...');

    // Create and sign in user
    const timeoutUser = authHelpers.generateTestUser();
    await authHelpers.signUp(timeoutUser);
    await authHelpers.signIn(timeoutUser.email, timeoutUser.password);

    await screenshotManager.takeFullPageScreenshot('session-active');

    // Simulate session expiry by manipulating tokens
    await stateDebugger.trackStateTransition('simulate-session-timeout', async () => {
      // Clear session storage to simulate timeout
      await browser.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      // Try to access protected route
      await browser.page.goto('http://localhost:3000/dashboard');
      await browser.waitForReactRender();
    });

    await screenshotManager.takeFullPageScreenshot('session-expired-redirect');

    // Should redirect to auth page
    const currentUrl = browser.page.url();
    expect(currentUrl).toContain('/auth');

    // Should show session expired message if implemented
    const sessionExpiredIndicator = await browser.page.isVisible('text*="session"');
    console.log(`🔐 Session expired indicator visible: ${sessionExpiredIndicator}`);
  });
});