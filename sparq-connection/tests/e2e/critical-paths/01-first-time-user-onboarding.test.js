const BrowserManager = require('../../utils/browser-setup');
const AuthHelpers = require('../../utils/auth-helpers');
const StateDebugger = require('../../utils/state-debugger');
const ScreenshotManager = require('../../utils/screenshot-manager');
const ServerLogCapture = require('../../utils/server-logs');

describe('Critical Path: First-Time User Onboarding', () => {
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
    
    // Setup logging
    await serverLogs.setupNetworkLogging();
    await serverLogs.captureSupabaseRequests();
    await serverLogs.captureAuthEvents();
  });

  afterAll(async () => {
    await browser.cleanup();
  });

  beforeEach(async () => {
    await browser.setTestName('first-time-user-onboarding');
    stateDebugger.clearHistory();
    await serverLogs.clearLogs();
  });

  test('Complete first-time user journey: Landing → Auth → Sign Up → Email Verification → Dashboard → Invite Partner', async () => {
    console.log('🧪 Starting first-time user onboarding test...');

    // STEP 1: Landing Page
    await stateDebugger.trackStateTransition('navigate-to-landing', async () => {
      await browser.page.goto('http://localhost:3000');
      await browser.waitForReactRender();
    });
    
    await screenshotManager.takeFullPageScreenshot('landing-page-loaded');
    
    // Verify landing page state
    const landingState = await stateDebugger.captureReactState('landing-page-state');
    expect(landingState.state.authIndicators.isOnProtectedRoute).toBe(false);
    
    // Check performance metrics
    const landingMetrics = await browser.getPerformanceMetrics();
    expect(landingMetrics.fullyLoaded).toBeLessThan(2000); // < 2s load time
    console.log(`📊 Landing page loaded in ${landingMetrics.fullyLoaded}ms`);

    // STEP 2: Navigate to Auth
    await stateDebugger.trackStateTransition('navigate-to-auth', async () => {
      await browser.page.click('text="Start Your Journey"');
      await browser.page.waitForURL('**/auth');
      await browser.waitForReactRender();
    });
    
    await screenshotManager.takeFullPageScreenshot('auth-page-loaded');
    
    // Verify auth page state
    const authPageState = await stateDebugger.captureAuthState();
    expect(authPageState.isOnAuthPage).toBe(true);
    expect(authPageState.hasSignInForm).toBe(true);

    // STEP 3: Switch to Sign Up
    await stateDebugger.trackStateTransition('switch-to-signup', async () => {
      await browser.page.click('text="Don\'t have an account? Sign up"');
      await browser.waitForReactRender();
    });
    
    await screenshotManager.captureFormState('signup-form-displayed');
    
    // Verify signup form is displayed
    const signupState = await stateDebugger.captureAuthState();
    expect(signupState.hasSignUpForm).toBe(true);

    // STEP 4: Fill and Submit Sign Up Form
    const testUser = authHelpers.generateTestUser();
    console.log(`👤 Creating test user: ${testUser.email}`);
    
    await stateDebugger.trackStateTransition('fill-signup-form', async () => {
      await browser.page.fill('input[name="displayName"]', testUser.displayName);
      await browser.page.fill('input[name="email"]', testUser.email);
      await browser.page.fill('input[name="password"]', testUser.password);
      await browser.page.fill('input[name="confirmPassword"]', testUser.password);
    });
    
    await screenshotManager.captureFormState('signup-form-filled');
    
    // Submit form and track state transition
    await stateDebugger.trackStateTransition('submit-signup', async () => {
      await browser.page.click('button[type="submit"]');
      // Wait for success state
      await browser.page.waitForSelector('h2:has-text("Check your email")', { timeout: 10000 });
    });
    
    await screenshotManager.takeFullPageScreenshot('signup-success');
    
    // Verify success state
    const successState = await stateDebugger.captureAuthState();
    expect(successState.hasSuccessMessage).toBe(true);
    
    // Check for any auth errors
    const authLogs = await serverLogs.getAuthLogs();
    const authErrors = authLogs.filter(log => log.level === 'error');
    if (authErrors.length > 0) {
      console.warn('⚠️ Auth errors detected:', authErrors);
    }

    // STEP 5: Simulate Email Verification (since we can't access real email)
    // In a real test, you'd need to integrate with email service or use a test email
    console.log('📧 In real scenario, user would click email verification link...');
    
    // For demo purposes, we'll directly sign in with the created user
    await stateDebugger.trackStateTransition('simulate-email-verification', async () => {
      // Go back to sign in
      await browser.page.click('text="Back to Sign In"');
      await browser.waitForReactRender();
      
      // Sign in with the new user (simulating post-verification)
      await browser.page.fill('input[name="email"]', testUser.email);
      await browser.page.fill('input[name="password"]', testUser.password);
      await browser.page.click('button[type="submit"]');
      
      // Wait for dashboard redirect
      await browser.page.waitForURL('**/dashboard', { timeout: 15000 });
      await browser.waitForReactRender();
    });
    
    await screenshotManager.takeFullPageScreenshot('dashboard-first-login');

    // STEP 6: Verify Dashboard State
    const dashboardState = await stateDebugger.captureReactState('dashboard-first-visit');
    expect(dashboardState.state.authIndicators.isOnProtectedRoute).toBe(true);
    
    const coupleState = await stateDebugger.captureCoupleState();
    expect(coupleState.hasPartner).toBe(false); // New user shouldn't have partner yet
    expect(coupleState.isOnDashboard).toBe(true);
    
    // Check welcome message
    const welcomeMessage = await browser.page.textContent('h1');
    expect(welcomeMessage).toContain('Hi');
    expect(welcomeMessage).toContain(testUser.displayName.split(' ')[0]); // First name

    // STEP 7: Open Invite Modal
    await stateDebugger.trackStateTransition('open-invite-modal', async () => {
      await browser.page.click('button:has-text("Send Invite")');
      await browser.page.waitForSelector('[data-testid="invite-modal"], .modal, [role="dialog"]', { timeout: 5000 });
    });
    
    await screenshotManager.captureModalState('invite-modal-opened');
    
    // Verify modal state
    const modalState = await stateDebugger.captureCoupleState();
    expect(modalState.isInviteModalOpen).toBe(true);

    // STEP 8: Create Invitation
    await stateDebugger.trackStateTransition('create-invitation', async () => {
      // Leave email empty to create shareable link
      await browser.page.click('button:has-text("Create Invitation")');
      await browser.page.waitForSelector('h2:has-text("Invitation Created!")', { timeout: 10000 });
    });
    
    await screenshotManager.captureModalState('invitation-created');
    
    // Verify invitation was created
    const invitationState = await stateDebugger.captureCoupleState();
    expect(invitationState.hasInviteCode).toBe(true);
    
    // Extract invite code for future tests
    const inviteCode = await browser.page.textContent('[data-testid="invite-code"], code');
    console.log(`🔗 Generated invite code: ${inviteCode}`);

    // STEP 9: Performance and State Validation
    const finalMetrics = await browser.getPerformanceMetrics();
    console.log('📊 Final Performance Metrics:', {
      totalLoadTime: finalMetrics.fullyLoaded,
      firstContentfulPaint: finalMetrics.firstContentfulPaint,
      resourceCount: finalMetrics.resourceCount,
      totalResourceSize: Math.round(finalMetrics.totalResourceSize / 1024) + 'KB'
    });
    
    // Validate performance targets
    expect(finalMetrics.fullyLoaded).toBeLessThan(2000); // < 2s total
    expect(finalMetrics.firstContentfulPaint).toBeLessThan(1000); // < 1s FCP
    
    // Generate evidence and reports
    await browser.captureFullEvidence('onboarding-complete');
    await stateDebugger.generateStateReport();
    await screenshotManager.generateVisualReport('first-time-user-onboarding');
    await serverLogs.saveLogs('onboarding-complete');
    await serverLogs.generateDetailedReport();
    
    console.log('✅ First-time user onboarding test completed successfully!');
  });

  test('Validate onboarding state persistence across page refresh', async () => {
    console.log('🧪 Testing onboarding state persistence...');
    
    // Sign in with test user first
    await authHelpers.signInWithTestUser(0);
    await screenshotManager.takeFullPageScreenshot('signed-in-dashboard');
    
    const beforeRefreshState = await stateDebugger.captureReactState('before-refresh');
    
    // Refresh page
    await stateDebugger.trackStateTransition('page-refresh', async () => {
      await browser.page.reload();
      await browser.waitForReactRender();
    });
    
    await screenshotManager.takeFullPageScreenshot('after-refresh-dashboard');
    
    const afterRefreshState = await stateDebugger.captureReactState('after-refresh');
    
    // Should still be authenticated and on dashboard
    expect(afterRefreshState.state.authIndicators.isOnProtectedRoute).toBe(true);
    
    // Compare states to ensure session persistence
    const stateChanges = await stateDebugger.detectStateChanges(beforeRefreshState, afterRefreshState);
    console.log('🔍 State changes after refresh:', stateChanges.changes.length);
    
    // Session should persist
    expect(await authHelpers.testSessionPersistence()).toBe(true);
  });

  test('Validate onboarding error handling', async () => {
    console.log('🧪 Testing onboarding error scenarios...');
    
    // Test form validation
    await authHelpers.testAuthValidation();
    
    // Test authentication errors
    await authHelpers.testAuthErrors();
    
    // Capture error states
    await screenshotManager.captureErrorState('auth-validation-errors');
    
    const errorLogs = await serverLogs.getErrorLogs();
    console.log(`🚨 Captured ${errorLogs.length} error logs during validation testing`);
    
    // Should handle errors gracefully without crashes
    const finalState = await stateDebugger.captureReactState('error-handling-complete');
    expect(finalState.state.url).toContain('/auth'); // Should still be on auth page
  });

  test('Validate onboarding accessibility', async () => {
    console.log('🧪 Testing onboarding accessibility...');
    
    await browser.page.goto('http://localhost:3000/auth');
    await browser.waitForReactRender();
    
    // Test keyboard navigation
    await browser.page.keyboard.press('Tab'); // Should focus first input
    await browser.page.keyboard.press('Tab'); // Should focus second input
    
    await screenshotManager.takeFullPageScreenshot('accessibility-keyboard-focus');
    
    // Test screen reader attributes
    const accessibilityInfo = await browser.page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      return Array.from(inputs).map(input => ({
        hasLabel: !!input.labels?.length || !!input.getAttribute('aria-label'),
        hasAriaDescribedBy: !!input.getAttribute('aria-describedby'),
        isRequired: input.required,
        type: input.type
      }));
    });
    
    // All inputs should have proper labels
    accessibilityInfo.forEach(input => {
      expect(input.hasLabel).toBe(true);
    });
    
    console.log('♿ Accessibility validation completed');
  });
});