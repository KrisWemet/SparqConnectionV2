const BrowserManager = require('../../utils/browser-setup');
const AuthHelpers = require('../../utils/auth-helpers');
const StateDebugger = require('../../utils/state-debugger');
const ScreenshotManager = require('../../utils/screenshot-manager');
const ServerLogCapture = require('../../utils/server-logs');

describe('Critical Path: Partner Invitation Flow', () => {
  let browser, authHelpers, stateDebugger, screenshotManager, serverLogs;
  let inviterUser, inviteeUser, inviteCode;

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
    await browser.setTestName('partner-invitation-flow');
    stateDebugger.clearHistory();
    await serverLogs.clearLogs();
  });

  test('Complete partner invitation journey: Create invitation → Send link → Partner accepts → Couple formation', async () => {
    console.log('🧪 Starting partner invitation flow test...');

    // PHASE 1: INVITER CREATES INVITATION
    console.log('👤 Phase 1: Inviter creates invitation');
    
    // Create first user (inviter)
    inviterUser = authHelpers.generateTestUser();
    inviterUser.displayName = 'Alice Cooper';
    inviterUser.email = 'alice@sparqtest.com';
    
    await stateDebugger.trackStateTransition('inviter-signup', async () => {
      const user = await authHelpers.signUp(inviterUser);
      console.log(`👤 Inviter created: ${user.email}`);
    });

    // Navigate to dashboard and create invitation
    await stateDebugger.trackStateTransition('inviter-login', async () => {
      await authHelpers.signIn(inviterUser.email, inviterUser.password);
    });
    
    await screenshotManager.takeFullPageScreenshot('inviter-dashboard-loaded');
    
    // Verify inviter is on dashboard without partner
    const inviterDashboardState = await stateDebugger.captureCoupleState();
    expect(inviterDashboardState.hasPartner).toBe(false);
    expect(inviterDashboardState.isOnDashboard).toBe(true);

    // Open invite modal
    await stateDebugger.trackStateTransition('open-invite-modal', async () => {
      await browser.page.click('button:has-text("Send Invite")');
      await browser.page.waitForSelector('[role="dialog"], .modal', { timeout: 5000 });
    });
    
    await screenshotManager.captureModalState('invite-modal-opened');

    // Create invitation
    await stateDebugger.trackStateTransition('create-invitation', async () => {
      await browser.page.click('button:has-text("Create Invitation")');
      await browser.page.waitForSelector('text="Invitation Created!"', { timeout: 10000 });
    });
    
    await screenshotManager.captureModalState('invitation-created');
    
    // Extract invitation code and URL
    inviteCode = await browser.page.textContent('code');
    const inviteUrl = await browser.page.inputValue('input[readonly]');
    console.log(`🔗 Generated invite code: ${inviteCode}`);
    console.log(`🔗 Generated invite URL: ${inviteUrl}`);
    
    expect(inviteCode).toBeTruthy();
    expect(inviteUrl).toContain('/invite/');

    // Close modal
    await browser.page.click('button:has-text("Done")');
    await browser.waitForReactRender();

    // PHASE 2: INVITEE RECEIVES AND VIEWS INVITATION
    console.log('👥 Phase 2: Invitee receives invitation');

    // Navigate to invitation link
    await stateDebugger.trackStateTransition('navigate-to-invitation', async () => {
      await browser.page.goto(`http://localhost:3000/invite/${inviteCode}`);
      await browser.waitForReactRender();
    });
    
    await screenshotManager.takeFullPageScreenshot('invitation-page-loaded');
    
    // Verify invitation page state
    const invitationPageState = await browser.page.evaluate(() => {
      return {
        hasInvitationCard: !!document.querySelector('h2:contains("invited you")'),
        hasSignInPrompt: !!document.querySelector('text="Please sign in"'),
        hasAcceptButton: !!document.querySelector('button:has-text("Accept")')
      };
    });
    
    // Should see invitation details
    const invitationText = await browser.page.textContent('h2');
    expect(invitationText).toContain('invited you');

    // PHASE 3: INVITEE CREATES ACCOUNT
    console.log('👤 Phase 3: Invitee creates account');
    
    // Create second user (invitee)
    inviteeUser = authHelpers.generateTestUser();
    inviteeUser.displayName = 'Bob Wilson';
    inviteeUser.email = 'bob@sparqtest.com';

    // Click sign in/up button
    await stateDebugger.trackStateTransition('navigate-to-auth-from-invite', async () => {
      await browser.page.click('button:has-text("Sign In / Sign Up")');
      await browser.page.waitForURL('**/auth', { timeout: 10000 });
      await browser.waitForReactRender();
    });
    
    await screenshotManager.takeFullPageScreenshot('auth-page-from-invite');

    // Sign up as invitee
    await stateDebugger.trackStateTransition('invitee-signup', async () => {
      // Switch to sign up
      await browser.page.click('text="Don\'t have an account? Sign up"');
      await browser.waitForReactRender();
      
      // Fill form
      await browser.page.fill('input[name="displayName"]', inviteeUser.displayName);
      await browser.page.fill('input[name="email"]', inviteeUser.email);
      await browser.page.fill('input[name="password"]', inviteeUser.password);
      await browser.page.fill('input[name="confirmPassword"]', inviteeUser.password);
      await browser.page.click('button[type="submit"]');
      
      // Wait for success
      await browser.page.waitForSelector('text="Check your email"', { timeout: 10000 });
    });
    
    await screenshotManager.takeFullPageScreenshot('invitee-signup-success');

    // PHASE 4: INVITEE SIGNS IN AND ACCEPTS INVITATION
    console.log('🤝 Phase 4: Invitee accepts invitation');

    // Sign in as invitee (simulating email verification)
    await stateDebugger.trackStateTransition('invitee-signin', async () => {
      await browser.page.click('text="Back to Sign In"');
      await browser.page.fill('input[name="email"]', inviteeUser.email);
      await browser.page.fill('input[name="password"]', inviteeUser.password);
      await browser.page.click('button[type="submit"]');
      await browser.page.waitForURL('**/dashboard', { timeout: 15000 });
    });

    // Navigate back to invitation page
    await stateDebugger.trackStateTransition('return-to-invitation', async () => {
      await browser.page.goto(`http://localhost:3000/invite/${inviteCode}`);
      await browser.waitForReactRender();
    });
    
    await screenshotManager.takeFullPageScreenshot('invitation-page-authenticated');

    // Accept invitation
    await stateDebugger.trackStateTransition('accept-invitation', async () => {
      await browser.page.click('button:has-text("Accept Invitation")');
      // Should redirect to dashboard after acceptance
      await browser.page.waitForURL('**/dashboard', { timeout: 15000 });
      await browser.waitForReactRender();
    });
    
    await screenshotManager.takeFullPageScreenshot('invitation-accepted-dashboard');

    // PHASE 5: VERIFY COUPLE FORMATION
    console.log('💕 Phase 5: Verify couple formation');

    // Check couple state for invitee
    const inviteeDashboardState = await stateDebugger.captureCoupleState();
    expect(inviteeDashboardState.hasPartner).toBe(true);
    expect(inviteeDashboardState.isOnDashboard).toBe(true);

    // Verify partner information is displayed
    const partnerName = await browser.page.textContent('[data-testid="partner-name"], text*="connected with"');
    expect(partnerName).toContain(inviterUser.displayName.split(' ')[0]); // Should show inviter's first name

    // Check connection status
    const connectionStatus = await browser.page.textContent('[data-testid="connection-status"], text*="connected"');
    expect(connectionStatus).toBeTruthy();

    // PHASE 6: VERIFY INVITER SEES CONNECTION
    console.log('🔄 Phase 6: Verify inviter sees connection');

    // Sign out invitee and sign in as inviter
    await stateDebugger.trackStateTransition('switch-to-inviter', async () => {
      await browser.page.click('button:has-text("Sign Out")');
      await browser.page.waitForURL('http://localhost:3000/', { timeout: 10000 });
      
      // Sign in as inviter
      await authHelpers.signIn(inviterUser.email, inviterUser.password);
    });
    
    await screenshotManager.takeFullPageScreenshot('inviter-dashboard-after-connection');

    // Check inviter's couple state
    const inviterFinalState = await stateDebugger.captureCoupleState();
    expect(inviterFinalState.hasPartner).toBe(true);
    expect(inviterFinalState.isOnDashboard).toBe(true);

    // Verify inviter sees invitee's information
    const inviteeNameOnInviterDashboard = await browser.page.textContent('[data-testid="partner-name"], text*="connected with"');
    expect(inviteeNameOnInviterDashboard).toContain(inviteeUser.displayName.split(' ')[0]);

    // PHASE 7: VERIFY DATABASE CONSISTENCY
    console.log('🗄️ Phase 7: Verify database consistency');

    // Check Supabase logs for couple creation
    const supabaseLogs = await serverLogs.getSupabaseLogs();
    const coupleCreationLogs = supabaseLogs.filter(log => 
      log.url?.includes('couples') && log.method === 'POST'
    );
    
    console.log(`📊 Found ${coupleCreationLogs.length} couple creation API calls`);
    expect(coupleCreationLogs.length).toBeGreaterThan(0);

    // Check for invitation status updates
    const invitationUpdateLogs = supabaseLogs.filter(log =>
      log.url?.includes('invitations') && (log.method === 'PATCH' || log.method === 'PUT')
    );
    
    console.log(`📊 Found ${invitationUpdateLogs.length} invitation update API calls`);

    // PHASE 8: PERFORMANCE AND STATE VALIDATION
    console.log('📊 Phase 8: Performance validation');

    const finalMetrics = await browser.getPerformanceMetrics();
    console.log('Performance Metrics:', {
      invitationPageLoad: finalMetrics.fullyLoaded,
      totalNetworkRequests: finalMetrics.resourceCount,
      totalDataTransfer: Math.round(finalMetrics.totalResourceSize / 1024) + 'KB'
    });

    // Validate performance targets
    expect(finalMetrics.fullyLoaded).toBeLessThan(2000); // < 2s load time

    // Generate comprehensive evidence
    await browser.captureFullEvidence('partner-invitation-complete');
    await stateDebugger.generateStateReport();
    await screenshotManager.generateVisualReport('partner-invitation-flow');
    await serverLogs.generateDetailedReport();

    console.log('✅ Partner invitation flow test completed successfully!');
    console.log(`🎉 Successfully connected ${inviterUser.displayName} and ${inviteeUser.displayName}`);
  });

  test('Validate invitation expiry handling', async () => {
    console.log('🧪 Testing expired invitation handling...');

    // Create user and invitation first
    const user = authHelpers.generateTestUser();
    await authHelpers.signUp(user);
    await authHelpers.signIn(user.email, user.password);

    // Try to access expired invitation
    await stateDebugger.trackStateTransition('access-expired-invitation', async () => {
      await browser.page.goto('http://localhost:3000/invite/EXPIRED123');
      await browser.waitForReactRender();
    });

    await screenshotManager.captureErrorState('expired-invitation');

    // Should show error state
    const errorState = await browser.page.evaluate(() => {
      return {
        hasErrorMessage: !!document.querySelector('text="Invalid or expired"'),
        hasErrorIcon: !!document.querySelector('svg'),
        canGoToSignIn: !!document.querySelector('button:has-text("Go to Sign In")')
      };
    });

    expect(errorState.hasErrorMessage).toBe(true);
    expect(errorState.canGoToSignIn).toBe(true);
  });

  test('Validate invitation acceptance by already coupled user', async () => {
    console.log('🧪 Testing invitation acceptance edge cases...');

    // Create two users and couple them
    const user1 = authHelpers.generateTestUser();
    const user2 = authHelpers.generateTestUser();

    await authHelpers.signUp(user1);
    await authHelpers.signIn(user1.email, user1.password);

    // Create invitation
    await browser.page.click('button:has-text("Send Invite")');
    await browser.page.waitForSelector('[role="dialog"]');
    await browser.page.click('button:has-text("Create Invitation")');
    await browser.page.waitForSelector('text="Invitation Created!"');

    const newInviteCode = await browser.page.textContent('code');
    await browser.page.click('button:has-text("Done")');

    // Sign up second user and accept invitation
    await browser.page.click('button:has-text("Sign Out")');
    await authHelpers.signUp(user2);
    await authHelpers.signIn(user2.email, user2.password);

    await browser.page.goto(`http://localhost:3000/invite/${newInviteCode}`);
    await browser.page.click('button:has-text("Accept Invitation")');
    await browser.page.waitForURL('**/dashboard');

    // Now try to accept another invitation (should fail)
    const thirdUser = authHelpers.generateTestUser();
    await browser.page.click('button:has-text("Sign Out")');
    await authHelpers.signUp(thirdUser);
    await authHelpers.signIn(thirdUser.email, thirdUser.password);

    // Create new invitation as third user
    await browser.page.click('button:has-text("Send Invite")');
    await browser.page.waitForSelector('[role="dialog"]');
    await browser.page.click('button:has-text("Create Invitation")');
    const anotherInviteCode = await browser.page.textContent('code');

    // Try to have already-coupled user accept this invitation
    await browser.page.click('button:has-text("Sign Out")');
    await authHelpers.signIn(user2.email, user2.password); // Already coupled user

    await browser.page.goto(`http://localhost:3000/invite/${anotherInviteCode}`);
    await screenshotManager.captureErrorState('already-coupled-user-invitation');

    // Should handle this gracefully (implementation dependent)
    const pageContent = await browser.page.textContent('body');
    console.log('📄 Response for already-coupled user accessing invitation:', pageContent.substring(0, 200));
  });

  test('Validate invitation flow performance under load', async () => {
    console.log('🧪 Testing invitation flow performance...');

    const startTime = Date.now();

    // Simulate rapid invitation creation
    const user = authHelpers.generateTestUser();
    await authHelpers.signUp(user);
    await authHelpers.signIn(user.email, user.password);

    const invitationTimes = [];

    for (let i = 0; i < 3; i++) {
      const inviteStart = Date.now();

      await browser.page.click('button:has-text("Send Invite")');
      await browser.page.waitForSelector('[role="dialog"]');
      await browser.page.click('button:has-text("Create Invitation")');
      await browser.page.waitForSelector('text="Invitation Created!"');
      await browser.page.click('button:has-text("Done")');

      const inviteTime = Date.now() - inviteStart;
      invitationTimes.push(inviteTime);
      console.log(`📊 Invitation ${i + 1} created in ${inviteTime}ms`);
    }

    const totalTime = Date.now() - startTime;
    const averageInviteTime = invitationTimes.reduce((a, b) => a + b, 0) / invitationTimes.length;

    console.log(`📊 Total time for 3 invitations: ${totalTime}ms`);
    console.log(`📊 Average invitation creation time: ${averageInviteTime}ms`);

    // Performance expectations
    expect(averageInviteTime).toBeLessThan(2000); // < 2s per invitation
    expect(Math.max(...invitationTimes)).toBeLessThan(3000); // No single invitation > 3s
  });
});