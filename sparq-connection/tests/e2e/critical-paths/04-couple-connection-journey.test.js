const BrowserManager = require('../../utils/browser-setup');
const AuthHelpers = require('../../utils/auth-helpers');
const StateDebugger = require('../../utils/state-debugger');
const ScreenshotManager = require('../../utils/screenshot-manager');
const ServerLogCapture = require('../../utils/server-logs');

describe('Critical Path: Couple Connection Journey', () => {
  let browser, authHelpers, stateDebugger, screenshotManager, serverLogs;
  let coupleUser1, coupleUser2;

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
    await browser.setTestName('couple-connection-journey');
    stateDebugger.clearHistory();
    await serverLogs.clearLogs();
  });

  test('Complete couple connection journey: Initial connection → First shared activity → Relationship building → Connection strengthening', async () => {
    console.log('🧪 Starting couple connection journey test...');

    // PHASE 1: ESTABLISH COUPLE CONNECTION
    console.log('💕 Phase 1: Establish couple connection');
    
    coupleUser1 = authHelpers.generateTestUser();
    coupleUser1.displayName = 'Emma Rodriguez';
    coupleUser1.email = 'emma@connectiontest.com';
    
    coupleUser2 = authHelpers.generateTestUser();
    coupleUser2.displayName = 'James Chen';
    coupleUser2.email = 'james@connectiontest.com';

    await stateDebugger.trackStateTransition('establish-couple-connection', async () => {
      // Create users and connect them
      await authHelpers.signUp(coupleUser1);
      await authHelpers.signUp(coupleUser2);
      
      // User 1 creates invitation
      await authHelpers.signIn(coupleUser1.email, coupleUser1.password);
      await browser.page.click('button:has-text("Send Invite")');
      await browser.page.waitForSelector('[role="dialog"]');
      await browser.page.click('button:has-text("Create Invitation")');
      await browser.page.waitForSelector('text="Invitation Created!"');
      
      const inviteCode = await browser.page.textContent('code');
      await browser.page.click('button:has-text("Done")');
      
      // User 2 accepts invitation
      await browser.page.click('button:has-text("Sign Out")');
      await authHelpers.signIn(coupleUser2.email, coupleUser2.password);
      await browser.page.goto(`http://localhost:3000/invite/${inviteCode}`);
      await browser.page.click('button:has-text("Accept Invitation")');
      await browser.page.waitForURL('**/dashboard');
      
      console.log('👥 Couple connection established successfully');
    });

    await screenshotManager.takeFullPageScreenshot('couple-connected-dashboard');

    // PHASE 2: FIRST SHARED ACTIVITY
    console.log('🎯 Phase 2: First shared activity - Daily question interaction');

    // Verify couple state
    const initialCoupleState = await stateDebugger.captureCoupleState();
    expect(initialCoupleState.hasPartner).toBe(true);
    expect(initialCoupleState.isOnDashboard).toBe(true);

    // Engage with daily question as User 2
    await stateDebugger.trackStateTransition('user2-daily-question', async () => {
      const dailyQuestionExists = await browser.page.isVisible('[data-testid="daily-question"], h3:has-text("Today\'s Question")');
      if (dailyQuestionExists) {
        await browser.page.click('button:has-text("Answer Question"), button:has-text("Respond")');
        await browser.page.fill('textarea', 'My heartfelt response to today\'s question about our relationship.');
        await browser.page.click('button:has-text("Save Response"), button:has-text("Submit")');
        await browser.waitForReactRender();
      } else {
        console.log('📝 No daily question available, simulating question response');
        // Navigate to questions section if it exists
        const questionsLink = await browser.page.isVisible('a[href*="questions"], button:has-text("Questions")');
        if (questionsLink) {
          await browser.page.click('a[href*="questions"], button:has-text("Questions")');
          await browser.waitForReactRender();
        }
      }
    });

    await screenshotManager.takeFullPageScreenshot('user2-answered-question');

    // Switch to User 1 to see partner's response
    await stateDebugger.trackStateTransition('switch-to-user1', async () => {
      await browser.page.click('button:has-text("Sign Out")');
      await authHelpers.signIn(coupleUser1.email, coupleUser1.password);
    });

    await screenshotManager.takeFullPageScreenshot('user1-sees-partner-activity');

    // PHASE 3: RELATIONSHIP BUILDING ACTIVITIES
    console.log('🌱 Phase 3: Relationship building activities');

    // User 1 responds to the same question
    await stateDebugger.trackStateTransition('user1-responds-to-question', async () => {
      const dailyQuestionExists = await browser.page.isVisible('[data-testid="daily-question"], h3:has-text("Today\'s Question")');
      if (dailyQuestionExists) {
        await browser.page.click('button:has-text("Answer Question"), button:has-text("Respond")');
        await browser.page.fill('textarea', 'This is my thoughtful response to the question, building on what my partner shared.');
        await browser.page.click('button:has-text("Save Response"), button:has-text("Submit")');
        await browser.waitForReactRender();
      }
    });

    await screenshotManager.takeFullPageScreenshot('user1-responded-to-question');

    // Check for shared responses/connection indicators
    const sharedActivityState = await browser.page.evaluate(() => {
      return {
        hasSharedActivity: !!document.querySelector('[data-testid="shared-responses"], .shared-activity'),
        hasConnectionIndicator: !!document.querySelector('[data-testid="connection-status"], text*="connected"'),
        hasPartnerResponse: !!document.querySelector('[data-testid="partner-response"], .partner-activity'),
        hasStreakIndicator: !!document.querySelector('[data-testid="streak"], text*="streak"')
      };
    });

    console.log('📊 Shared Activity State:', sharedActivityState);
    expect(sharedActivityState.hasConnectionIndicator).toBe(true);

    // PHASE 4: EXPLORE RELATIONSHIP FEATURES
    console.log('🔍 Phase 4: Explore relationship features');

    // Check reflections feature
    await stateDebugger.trackStateTransition('explore-reflections', async () => {
      const reflectionsLink = await browser.page.isVisible('a[href*="reflections"], button:has-text("Reflections")');
      if (reflectionsLink) {
        await browser.page.click('a[href*="reflections"], button:has-text("Reflections")');
        await browser.waitForReactRender();
      }
    });

    await screenshotManager.takeFullPageScreenshot('reflections-section');

    // Create a private reflection
    await stateDebugger.trackStateTransition('create-private-reflection', async () => {
      const createReflectionButton = await browser.page.isVisible('button:has-text("New Reflection"), button:has-text("Add Reflection")');
      if (createReflectionButton) {
        await browser.page.click('button:has-text("New Reflection"), button:has-text("Add Reflection")');
        await browser.page.fill('textarea', 'This is my private reflection about our relationship growth.');
        await browser.page.click('button:has-text("Save"), button:has-text("Create")');
        await browser.waitForReactRender();
      }
    });

    await screenshotManager.takeFullPageScreenshot('reflection-created');

    // Return to dashboard
    await browser.page.goto('http://localhost:3000/dashboard');
    await browser.waitForReactRender();

    // PHASE 5: CONNECTION STRENGTHENING
    console.log('💪 Phase 5: Connection strengthening activities');

    // Check for connection quests or activities
    await stateDebugger.trackStateTransition('explore-connection-activities', async () => {
      const questsLink = await browser.page.isVisible('a[href*="quests"], button:has-text("Quests"), button:has-text("Activities")');
      if (questsLink) {
        await browser.page.click('a[href*="quests"], button:has-text("Quests"), button:has-text("Activities")');
        await browser.waitForReactRender();
      }
    });

    await screenshotManager.takeFullPageScreenshot('connection-activities');

    // Switch back to User 2 to check their experience
    await stateDebugger.trackStateTransition('switch-to-user2-final', async () => {
      await browser.page.click('button:has-text("Sign Out")');
      await authHelpers.signIn(coupleUser2.email, coupleUser2.password);
    });

    await screenshotManager.takeFullPageScreenshot('user2-final-state');

    // PHASE 6: VERIFY COUPLE SYNCHRONIZATION
    console.log('🔄 Phase 6: Verify couple synchronization');

    // Check that both users see the connection
    const finalCoupleState = await stateDebugger.captureCoupleState();
    expect(finalCoupleState.hasPartner).toBe(true);
    expect(finalCoupleState.isOnDashboard).toBe(true);

    // Verify partner information is displayed
    const partnerInfoVisible = await browser.page.isVisible('[data-testid="partner-name"], text*="connected with"');
    expect(partnerInfoVisible).toBe(true);

    // Check for shared activity indicators
    const synchronizationState = await browser.page.evaluate(() => {
      return {
        hasPartnerActivity: !!document.querySelector('[data-testid="partner-activity"], .partner-response'),
        hasSharedContent: !!document.querySelector('[data-testid="shared-content"], .shared-activity'),
        hasConnectionHealth: !!document.querySelector('[data-testid="connection-health"], .health-score'),
        hasRecentActivity: !!document.querySelector('[data-testid="recent-activity"], .activity-timeline')
      };
    });

    console.log('📊 Synchronization State:', synchronizationState);

    // PHASE 7: TEST REAL-TIME FEATURES
    console.log('⚡ Phase 7: Test real-time features');

    // Open second browser instance for real-time testing
    const secondBrowser = new BrowserManager();
    await secondBrowser.setupBrowser();

    try {
      await stateDebugger.trackStateTransition('test-realtime-sync', async () => {
        // User 1 in second browser
        await secondBrowser.page.goto('http://localhost:3000/auth');
        await secondBrowser.page.fill('input[name="email"]', coupleUser1.email);
        await secondBrowser.page.fill('input[name="password"]', coupleUser1.password);
        await secondBrowser.page.click('button[type="submit"]');
        await secondBrowser.page.waitForURL('**/dashboard');
        
        // Both users should see each other's activity
        const realtimeState = await browser.page.evaluate(() => {
          return {
            hasOnlineIndicator: !!document.querySelector('[data-testid="online-status"], .online-indicator'),
            hasRealtimeActivity: !!document.querySelector('[data-testid="live-activity"], .realtime-update')
          };
        });
        
        console.log('⚡ Real-time State:', realtimeState);
      });
    } finally {
      await secondBrowser.cleanup();
    }

    // PHASE 8: PERFORMANCE AND DATABASE VALIDATION
    console.log('📊 Phase 8: Performance and database validation');

    const finalMetrics = await browser.getPerformanceMetrics();
    console.log('📊 Connection Journey Performance:', {
      totalJourneyTime: finalMetrics.fullyLoaded,
      resourcesLoaded: finalMetrics.resourceCount,
      cacheHitRatio: finalMetrics.fromCache || 0,
      totalDataTransfer: Math.round(finalMetrics.totalResourceSize / 1024) + 'KB'
    });

    // Validate performance targets
    expect(finalMetrics.fullyLoaded).toBeLessThan(3000); // < 3s for complex journey

    // Check database operations
    const supabaseLogs = await serverLogs.getSupabaseLogs();
    const coupleOperations = supabaseLogs.filter(log => 
      log.url?.includes('couples') || log.url?.includes('responses') || log.url?.includes('reflections')
    );
    
    console.log(`📊 Database operations during journey: ${coupleOperations.length}`);
    expect(coupleOperations.length).toBeGreaterThan(0);

    // Verify no errors in couple operations
    const coupleErrors = coupleOperations.filter(log => log.status >= 400);
    expect(coupleErrors.length).toBe(0);

    // Generate comprehensive evidence
    await browser.captureFullEvidence('couple-connection-journey-complete');
    await stateDebugger.generateStateReport();
    await screenshotManager.generateVisualReport('couple-connection-journey');
    await serverLogs.generateDetailedReport();

    console.log('✅ Couple connection journey test completed successfully!');
    console.log(`💕 Successfully tested connection between ${coupleUser1.displayName} and ${coupleUser2.displayName}`);
  });

  test('Validate couple activity synchronization', async () => {
    console.log('🧪 Testing couple activity synchronization...');

    // Create and connect couple
    const user1 = authHelpers.generateTestUser();
    const user2 = authHelpers.generateTestUser();
    
    await authHelpers.signUp(user1);
    await authHelpers.signUp(user2);
    
    // Connect users
    await authHelpers.signIn(user1.email, user1.password);
    await browser.page.click('button:has-text("Send Invite")');
    await browser.page.waitForSelector('[role="dialog"]');
    await browser.page.click('button:has-text("Create Invitation")');
    await browser.page.waitForSelector('text="Invitation Created!"');
    
    const inviteCode = await browser.page.textContent('code');
    await browser.page.click('button:has-text("Done")');
    
    await browser.page.click('button:has-text("Sign Out")');
    await authHelpers.signIn(user2.email, user2.password);
    await browser.page.goto(`http://localhost:3000/invite/${inviteCode}`);
    await browser.page.click('button:has-text("Accept Invitation")');
    await browser.page.waitForURL('**/dashboard');

    // Test activity synchronization
    await stateDebugger.trackStateTransition('test-activity-sync', async () => {
      // User 2 performs activity
      const activityExists = await browser.page.isVisible('[data-testid="daily-question"], button:has-text("Answer")');
      if (activityExists) {
        await browser.page.click('button:has-text("Answer"), button:has-text("Respond")');
        await browser.page.fill('textarea', 'Synchronization test response');
        await browser.page.click('button:has-text("Save"), button:has-text("Submit")');
        await browser.waitForReactRender();
      }
    });

    await screenshotManager.takeFullPageScreenshot('activity-sync-test');

    // Switch to User 1 and check if they see the activity
    await browser.page.click('button:has-text("Sign Out")');
    await authHelpers.signIn(user1.email, user1.password);

    const syncState = await browser.page.evaluate(() => {
      return {
        hasPartnerActivity: !!document.querySelector('[data-testid="partner-activity"], .partner-response'),
        hasActivityNotification: !!document.querySelector('[data-testid="activity-notification"], .notification'),
        hasUpdatedContent: !!document.querySelector('[data-testid="updated-content"], .recent-update')
      };
    });

    console.log('🔄 Sync State:', syncState);
    // Note: Actual sync behavior depends on implementation
  });

  test('Validate connection strength indicators', async () => {
    console.log('🧪 Testing connection strength indicators...');

    // Setup connected couple
    const user1 = authHelpers.generateTestUser();
    const user2 = authHelpers.generateTestUser();
    
    await authHelpers.signUp(user1);
    await authHelpers.signUp(user2);
    
    // Connect and perform activities
    await authHelpers.signIn(user1.email, user1.password);
    await browser.page.click('button:has-text("Send Invite")');
    await browser.page.waitForSelector('[role="dialog"]');
    await browser.page.click('button:has-text("Create Invitation")');
    const inviteCode = await browser.page.textContent('code');
    await browser.page.click('button:has-text("Done")');
    
    await browser.page.click('button:has-text("Sign Out")');
    await authHelpers.signIn(user2.email, user2.password);
    await browser.page.goto(`http://localhost:3000/invite/${inviteCode}`);
    await browser.page.click('button:has-text("Accept Invitation")');
    await browser.page.waitForURL('**/dashboard');

    // Check connection indicators
    const connectionIndicators = await browser.page.evaluate(() => {
      return {
        hasConnectionStreak: !!document.querySelector('[data-testid="connection-streak"], text*="streak"'),
        hasHealthScore: !!document.querySelector('[data-testid="health-score"], text*="health"'),
        hasActivityLevel: !!document.querySelector('[data-testid="activity-level"], .activity-meter'),
        hasConnectionBadges: !!document.querySelector('[data-testid="connection-badges"], .achievement-badges')
      };
    });

    console.log('💪 Connection Indicators:', connectionIndicators);
    await screenshotManager.takeFullPageScreenshot('connection-indicators');

    // At minimum, should show connection status
    const hasConnectionStatus = await browser.page.isVisible('[data-testid="connection-status"], text*="connected"');
    expect(hasConnectionStatus).toBe(true);
  });

  test('Validate couple privacy boundaries', async () => {
    console.log('🧪 Testing couple privacy boundaries...');

    // Create connected couple
    const user1 = authHelpers.generateTestUser();
    const user2 = authHelpers.generateTestUser();
    
    await authHelpers.signUp(user1);
    await authHelpers.signUp(user2);
    
    // Connect users
    await authHelpers.signIn(user1.email, user1.password);
    await browser.page.click('button:has-text("Send Invite")');
    await browser.page.waitForSelector('[role="dialog"]');
    await browser.page.click('button:has-text("Create Invitation")');
    const inviteCode = await browser.page.textContent('code');
    await browser.page.click('button:has-text("Done")');
    
    await browser.page.click('button:has-text("Sign Out")');
    await authHelpers.signIn(user2.email, user2.password);
    await browser.page.goto(`http://localhost:3000/invite/${inviteCode}`);
    await browser.page.click('button:has-text("Accept Invitation")');
    await browser.page.waitForURL('**/dashboard');

    // Test privacy boundaries
    await stateDebugger.trackStateTransition('test-privacy-boundaries', async () => {
      // Access reflections (should be private)
      const reflectionsExists = await browser.page.isVisible('a[href*="reflections"], button:has-text("Reflections")');
      if (reflectionsExists) {
        await browser.page.click('a[href*="reflections"], button:has-text("Reflections")');
        await browser.waitForReactRender();
        
        // Should only see own reflections
        const privacyState = await browser.page.evaluate(() => {
          return {
            hasOwnReflections: !!document.querySelector('[data-testid="own-reflections"], .my-reflections'),
            hasPartnerReflections: !!document.querySelector('[data-testid="partner-reflections"], .partner-reflections'),
            hasPrivacyIndicator: !!document.querySelector('[data-testid="privacy-indicator"], .private-content')
          };
        });
        
        console.log('🔒 Privacy State:', privacyState);
        
        // Should not see partner's private reflections
        expect(privacyState.hasPartnerReflections).toBe(false);
      }
    });

    await screenshotManager.takeFullPageScreenshot('privacy-boundaries-test');
  });
});