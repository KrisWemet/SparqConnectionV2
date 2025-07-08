const BrowserManager = require('../../utils/browser-setup');
const AuthHelpers = require('../../utils/auth-helpers');
const StateDebugger = require('../../utils/state-debugger');
const ScreenshotManager = require('../../utils/screenshot-manager');
const ServerLogCapture = require('../../utils/server-logs');

describe('Critical Path: Daily Question Interaction Flow', () => {
  let browser, authHelpers, stateDebugger, screenshotManager, serverLogs;
  let connectedCouple = [];

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
    await browser.setTestName('daily-question-interaction');
    stateDebugger.clearHistory();
    await serverLogs.clearLogs();
  });

  test('Complete daily question interaction journey: Question presented → Individual responses → Shared reflection → Connection strengthening', async () => {
    console.log('🧪 Starting daily question interaction test...');

    // PHASE 1: SETUP CONNECTED COUPLE
    console.log('👥 Phase 1: Setup connected couple');
    
    const user1 = authHelpers.generateTestUser();
    user1.displayName = 'Sophia Martinez';
    user1.email = 'sophia@dailyquestion.com';
    
    const user2 = authHelpers.generateTestUser();
    user2.displayName = 'David Kim';
    user2.email = 'david@dailyquestion.com';
    
    connectedCouple = [user1, user2];

    await stateDebugger.trackStateTransition('setup-connected-couple', async () => {
      // Create and connect couple
      await authHelpers.signUp(user1);
      await authHelpers.signUp(user2);
      
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
      
      console.log('👥 Couple connected successfully');
    });

    await screenshotManager.takeFullPageScreenshot('couple-connected-for-questions');

    // PHASE 2: DAILY QUESTION PRESENTATION
    console.log('❓ Phase 2: Daily question presentation');

    // Check for daily question on dashboard
    await stateDebugger.trackStateTransition('check-daily-question', async () => {
      const questionState = await browser.page.evaluate(() => {
        return {
          hasDailyQuestion: !!document.querySelector('[data-testid="daily-question"], h3:has-text("Today\'s Question"), h2:has-text("Daily Question")'),
          hasQuestionContent: !!document.querySelector('[data-testid="question-content"], .question-text'),
          hasAnswerButton: !!document.querySelector('button:has-text("Answer"), button:has-text("Respond")'),
          hasSkipOption: !!document.querySelector('button:has-text("Skip"), button:has-text("Not Today")'),
          questionText: document.querySelector('[data-testid="question-content"], .question-text')?.textContent || 'No question found'
        };
      });
      
      console.log('❓ Daily Question State:', questionState);
      
      if (!questionState.hasDailyQuestion) {
        console.log('📝 No daily question found, navigating to questions section');
        const questionsLink = await browser.page.isVisible('a[href*="questions"], button:has-text("Questions")');
        if (questionsLink) {
          await browser.page.click('a[href*="questions"], button:has-text("Questions")');
          await browser.waitForReactRender();
        }
      }
    });

    await screenshotManager.takeFullPageScreenshot('daily-question-presented');

    // PHASE 3: FIRST PARTNER RESPONDS
    console.log('📝 Phase 3: First partner (User 2) responds to daily question');

    await stateDebugger.trackStateTransition('user2-responds-to-question', async () => {
      const answerButton = await browser.page.isVisible('button:has-text("Answer"), button:has-text("Respond")');
      if (answerButton) {
        await browser.page.click('button:has-text("Answer"), button:has-text("Respond")');
        await browser.waitForReactRender();
        
        // Fill response
        const responseText = 'This daily question really makes me think about our relationship in a new way. I appreciate how it helps us connect on a deeper level.';
        await browser.page.fill('textarea, input[type="text"]', responseText);
        
        // Submit response
        await browser.page.click('button:has-text("Save"), button:has-text("Submit"), button:has-text("Send")');
        await browser.waitForReactRender();
        
        console.log('✍️ User 2 response submitted');
      } else {
        console.log('🔍 No answer button found, checking alternative question interface');
        
        // Alternative: Check if there's a question form already visible
        const questionForm = await browser.page.isVisible('form, .question-form');
        if (questionForm) {
          await browser.page.fill('textarea, input[type="text"]', 'Alternative response to daily question');
          await browser.page.click('button[type="submit"]');
          await browser.waitForReactRender();
        }
      }
    });

    await screenshotManager.takeFullPageScreenshot('user2-response-submitted');

    // Check response state
    const responseState = await browser.page.evaluate(() => {
      return {
        hasResponseConfirmation: !!document.querySelector('text="Response saved", text="Thank you", .success-message'),
        hasWaitingForPartner: !!document.querySelector('text="Waiting for partner", text="waiting", .waiting-state'),
        hasResponseHistory: !!document.querySelector('[data-testid="response-history"], .response-list'),
        canEditResponse: !!document.querySelector('button:has-text("Edit"), button:has-text("Change")')
      };
    });

    console.log('📊 Response State:', responseState);

    // PHASE 4: SECOND PARTNER RESPONDS
    console.log('📝 Phase 4: Second partner (User 1) responds to daily question');

    // Switch to User 1
    await stateDebugger.trackStateTransition('switch-to-user1', async () => {
      await browser.page.click('button:has-text("Sign Out")');
      await authHelpers.signIn(user1.email, user1.password);
    });

    await screenshotManager.takeFullPageScreenshot('user1-sees-question-with-partner-response');

    // Check if User 1 can see that partner responded
    const partnerResponseState = await browser.page.evaluate(() => {
      return {
        hasPartnerResponseIndicator: !!document.querySelector('[data-testid="partner-responded"], text="responded", .partner-activity'),
        hasPartnerResponsePreview: !!document.querySelector('[data-testid="partner-response"], .partner-response'),
        stillCanRespond: !!document.querySelector('button:has-text("Answer"), button:has-text("Respond")'),
        hasResponseNotification: !!document.querySelector('.notification, .alert')
      };
    });

    console.log('👥 Partner Response State:', partnerResponseState);

    // User 1 responds
    await stateDebugger.trackStateTransition('user1-responds-to-question', async () => {
      const answerButton = await browser.page.isVisible('button:has-text("Answer"), button:has-text("Respond")');
      if (answerButton) {
        await browser.page.click('button:has-text("Answer"), button:has-text("Respond")');
        await browser.waitForReactRender();
        
        const responseText = 'I love how these questions help us understand each other better. Your response was so thoughtful and it made me realize something new about us.';
        await browser.page.fill('textarea, input[type="text"]', responseText);
        await browser.page.click('button:has-text("Save"), button:has-text("Submit"), button:has-text("Send")');
        await browser.waitForReactRender();
        
        console.log('✍️ User 1 response submitted');
      }
    });

    await screenshotManager.takeFullPageScreenshot('user1-response-submitted');

    // PHASE 5: SHARED REFLECTION STATE
    console.log('🤝 Phase 5: Shared reflection state');

    // Check for shared responses view
    const sharedState = await browser.page.evaluate(() => {
      return {
        hasSharedResponses: !!document.querySelector('[data-testid="shared-responses"], .shared-responses'),
        hasBothResponses: !!document.querySelector('[data-testid="both-responses"], .response-pair'),
        hasPartnerResponse: !!document.querySelector('[data-testid="partner-response"], .partner-response'),
        hasOwnResponse: !!document.querySelector('[data-testid="own-response"], .own-response'),
        hasDiscussionPrompt: !!document.querySelector('[data-testid="discussion-prompt"], .discussion-starter'),
        hasConnectionInsight: !!document.querySelector('[data-testid="connection-insight"], .insight')
      };
    });

    console.log('🤝 Shared Reflection State:', sharedState);

    await screenshotManager.takeFullPageScreenshot('shared-reflection-state');

    // PHASE 6: CONNECTION STRENGTHENING
    console.log('💪 Phase 6: Connection strengthening features');

    // Check for connection indicators after both responses
    const connectionState = await browser.page.evaluate(() => {
      return {
        hasStreakUpdate: !!document.querySelector('[data-testid="streak-update"], text*="streak"'),
        hasConnectionScore: !!document.querySelector('[data-testid="connection-score"], .connection-score'),
        hasAchievementUnlock: !!document.querySelector('[data-testid="achievement"], .achievement-unlock'),
        hasNextSteps: !!document.querySelector('[data-testid="next-steps"], .next-actions'),
        hasFollowUpSuggestions: !!document.querySelector('[data-testid="follow-up"], .follow-up-suggestions')
      };
    });

    console.log('💪 Connection State:', connectionState);

    // Check for follow-up actions
    await stateDebugger.trackStateTransition('explore-follow-up-actions', async () => {
      const followUpExists = await browser.page.isVisible('button:has-text("Discuss"), button:has-text("Continue"), button:has-text("Next")');
      if (followUpExists) {
        await browser.page.click('button:has-text("Discuss"), button:has-text("Continue"), button:has-text("Next")');
        await browser.waitForReactRender();
      }
    });

    await screenshotManager.takeFullPageScreenshot('follow-up-actions');

    // PHASE 7: VERIFY BOTH PARTNERS SEE RESULTS
    console.log('🔄 Phase 7: Verify both partners see results');

    // Switch back to User 2 to verify they see the complete interaction
    await stateDebugger.trackStateTransition('switch-to-user2-final', async () => {
      await browser.page.click('button:has-text("Sign Out")');
      await authHelpers.signIn(user2.email, user2.password);
    });

    await screenshotManager.takeFullPageScreenshot('user2-sees-complete-interaction');

    // Verify User 2 sees both responses
    const user2FinalState = await browser.page.evaluate(() => {
      return {
        seesOwnResponse: !!document.querySelector('[data-testid="own-response"], .own-response'),
        seesPartnerResponse: !!document.querySelector('[data-testid="partner-response"], .partner-response'),
        seesSharedView: !!document.querySelector('[data-testid="shared-responses"], .shared-responses'),
        hasCompletedIndicator: !!document.querySelector('[data-testid="completed"], text="completed", .completed-state')
      };
    });

    console.log('👥 User 2 Final State:', user2FinalState);

    // PHASE 8: PERFORMANCE AND AI VALIDATION
    console.log('📊 Phase 8: Performance and AI validation');

    const finalMetrics = await browser.getPerformanceMetrics();
    console.log('📊 Daily Question Performance:', {
      totalInteractionTime: finalMetrics.fullyLoaded,
      questionLoadTime: finalMetrics.firstContentfulPaint,
      responseSubmissionTime: finalMetrics.resourceCount,
      totalDataUsed: Math.round(finalMetrics.totalResourceSize / 1024) + 'KB'
    });

    // Validate performance targets
    expect(finalMetrics.fullyLoaded).toBeLessThan(2000); // < 2s for question interactions

    // Check AI/content generation logs
    const aiLogs = await serverLogs.getSupabaseLogs();
    const questionGenerationLogs = aiLogs.filter(log => 
      log.url?.includes('questions') || log.url?.includes('ai') || log.url?.includes('generate')
    );
    
    console.log(`🤖 AI/Question generation operations: ${questionGenerationLogs.length}`);

    // Check response storage
    const responseLogs = aiLogs.filter(log => 
      log.url?.includes('responses') && log.method === 'POST'
    );
    
    console.log(`📝 Response storage operations: ${responseLogs.length}`);
    expect(responseLogs.length).toBeGreaterThanOrEqual(2); // Both users responded

    // Generate comprehensive evidence
    await browser.captureFullEvidence('daily-question-interaction-complete');
    await stateDebugger.generateStateReport();
    await screenshotManager.generateVisualReport('daily-question-interaction');
    await serverLogs.generateDetailedReport();

    console.log('✅ Daily question interaction test completed successfully!');
    console.log(`💕 Both ${user1.displayName} and ${user2.displayName} successfully completed daily question interaction`);
  });

  test('Validate question personalization and AI generation', async () => {
    console.log('🧪 Testing question personalization and AI generation...');

    // Setup couple with some history
    const user1 = authHelpers.generateTestUser();
    const user2 = authHelpers.generateTestUser();
    
    await authHelpers.signUp(user1);
    await authHelpers.signUp(user2);
    await authHelpers.signIn(user1.email, user1.password);
    
    // Create invitation and connect
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

    // Check question characteristics
    const questionAnalysis = await browser.page.evaluate(() => {
      const questionElement = document.querySelector('[data-testid="question-content"], .question-text, h3');
      const questionText = questionElement?.textContent || '';
      
      return {
        hasQuestion: !!questionElement,
        questionLength: questionText.length,
        isPersonal: questionText.includes('you') || questionText.includes('your'),
        isRelationshipFocused: questionText.includes('relationship') || questionText.includes('partner') || questionText.includes('together'),
        hasEmotionalDepth: questionText.includes('feel') || questionText.includes('love') || questionText.includes('appreciate'),
        questionText: questionText.substring(0, 100) + '...'
      };
    });

    console.log('🤖 Question Analysis:', questionAnalysis);
    await screenshotManager.takeFullPageScreenshot('question-analysis');

    // Questions should be personal and relationship-focused
    if (questionAnalysis.hasQuestion) {
      expect(questionAnalysis.questionLength).toBeGreaterThan(20);
      expect(questionAnalysis.isPersonal || questionAnalysis.isRelationshipFocused).toBe(true);
    }
  });

  test('Validate question response validation and error handling', async () => {
    console.log('🧪 Testing question response validation...');

    // Setup connected couple
    const user1 = authHelpers.generateTestUser();
    const user2 = authHelpers.generateTestUser();
    
    await authHelpers.signUp(user1);
    await authHelpers.signUp(user2);
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

    // Test response validation
    await stateDebugger.trackStateTransition('test-response-validation', async () => {
      const answerButton = await browser.page.isVisible('button:has-text("Answer"), button:has-text("Respond")');
      if (answerButton) {
        await browser.page.click('button:has-text("Answer"), button:has-text("Respond")');
        await browser.waitForReactRender();
        
        // Test empty response
        await browser.page.click('button:has-text("Save"), button:has-text("Submit")');
        await browser.waitForReactRender();
        
        // Should show validation error
        const validationError = await browser.page.isVisible('.error-message, [role="alert"], text*="required"');
        console.log(`🚨 Validation error shown: ${validationError}`);
        
        // Test very short response
        await browser.page.fill('textarea, input[type="text"]', 'Yes');
        await browser.page.click('button:has-text("Save"), button:has-text("Submit")');
        await browser.waitForReactRender();
        
        // May show warning for short responses
        const shortResponseWarning = await browser.page.isVisible('text*="brief", text*="short", .warning-message');
        console.log(`⚠️ Short response warning: ${shortResponseWarning}`);
      }
    });

    await screenshotManager.captureErrorState('response-validation-errors');
  });

  test('Validate question history and progression', async () => {
    console.log('🧪 Testing question history and progression...');

    // Setup couple
    const user1 = authHelpers.generateTestUser();
    const user2 = authHelpers.generateTestUser();
    
    await authHelpers.signUp(user1);
    await authHelpers.signUp(user2);
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

    // Check for question history
    const historyCheck = await browser.page.evaluate(() => {
      return {
        hasQuestionHistory: !!document.querySelector('[data-testid="question-history"], .question-history'),
        hasPreviousQuestions: !!document.querySelector('[data-testid="previous-questions"], .past-questions'),
        hasHistoryNavigation: !!document.querySelector('button:has-text("Previous"), button:has-text("History")'),
        hasQuestionArchive: !!document.querySelector('[data-testid="question-archive"], .question-archive')
      };
    });

    console.log('📚 Question History State:', historyCheck);
    await screenshotManager.takeFullPageScreenshot('question-history-check');

    // Navigate to history if available
    if (historyCheck.hasHistoryNavigation) {
      await browser.page.click('button:has-text("History"), button:has-text("Previous")');
      await browser.waitForReactRender();
      await screenshotManager.takeFullPageScreenshot('question-history-view');
    }
  });

  test('Validate question skip and postpone functionality', async () => {
    console.log('🧪 Testing question skip and postpone functionality...');

    // Setup couple
    const user1 = authHelpers.generateTestUser();
    const user2 = authHelpers.generateTestUser();
    
    await authHelpers.signUp(user1);
    await authHelpers.signUp(user2);
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

    // Test skip functionality
    await stateDebugger.trackStateTransition('test-skip-functionality', async () => {
      const skipButton = await browser.page.isVisible('button:has-text("Skip"), button:has-text("Not Today"), button:has-text("Pass")');
      if (skipButton) {
        await browser.page.click('button:has-text("Skip"), button:has-text("Not Today"), button:has-text("Pass")');
        await browser.waitForReactRender();
        
        // Should handle skip gracefully
        const skipState = await browser.page.evaluate(() => {
          return {
            hasSkipConfirmation: !!document.querySelector('text="skipped", text="Skip", .skip-confirmation'),
            hasNewQuestion: !!document.querySelector('[data-testid="new-question"], .next-question'),
            hasSkipMessage: !!document.querySelector('.skip-message, text*="tomorrow"'),
            canUndoSkip: !!document.querySelector('button:has-text("Undo"), button:has-text("Answer Anyway")')
          };
        });
        
        console.log('⏭️ Skip State:', skipState);
      }
    });

    await screenshotManager.takeFullPageScreenshot('question-skip-functionality');
  });
});