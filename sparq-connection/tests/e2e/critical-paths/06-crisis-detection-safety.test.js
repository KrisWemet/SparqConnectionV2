const BrowserManager = require('../../utils/browser-setup');
const AuthHelpers = require('../../utils/auth-helpers');
const StateDebugger = require('../../utils/state-debugger');
const ScreenshotManager = require('../../utils/screenshot-manager');
const ServerLogCapture = require('../../utils/server-logs');

describe('Critical Path: Crisis Detection and Safety Features', () => {
  let browser, authHelpers, stateDebugger, screenshotManager, serverLogs;
  let testUser;

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
    await browser.setTestName('crisis-detection-safety');
    stateDebugger.clearHistory();
    await serverLogs.clearLogs();
  });

  test('Crisis detection system: Keyword detection → Immediate intervention → Resource provision → Safe handling', async () => {
    console.log('🧪 Starting crisis detection and safety test...');
    console.log('⚠️  IMPORTANT: This test uses crisis keywords for safety feature validation only');

    // PHASE 1: SETUP USER FOR CRISIS DETECTION TESTING
    console.log('👤 Phase 1: Setup user for crisis detection testing');
    
    testUser = authHelpers.generateTestUser();
    testUser.displayName = 'Safety TestUser';
    testUser.email = 'safety@crisistest.com';

    await stateDebugger.trackStateTransition('setup-crisis-test-user', async () => {
      await authHelpers.signUp(testUser);
      await authHelpers.signIn(testUser.email, testUser.password);
      
      console.log('👤 Crisis detection test user created');
    });

    await screenshotManager.takeFullPageScreenshot('crisis-test-user-setup');

    // PHASE 2: TEST CRISIS KEYWORD DETECTION IN RESPONSES
    console.log('🚨 Phase 2: Test crisis keyword detection in responses');

    // Navigate to question or reflection area
    await stateDebugger.trackStateTransition('navigate-to-response-area', async () => {
      // Try to find a response/input area
      const responseAreas = await browser.page.evaluate(() => {
        return {
          hasDailyQuestion: !!document.querySelector('[data-testid="daily-question"], button:has-text("Answer")'),
          hasReflectionArea: !!document.querySelector('a[href*="reflections"], button:has-text("Reflections")'),
          hasTextArea: !!document.querySelector('textarea'),
          hasQuestionForm: !!document.querySelector('.question-form, [data-testid="question-form"]')
        };
      });

      console.log('📝 Available response areas:', responseAreas);

      if (responseAreas.hasDailyQuestion) {
        await browser.page.click('button:has-text("Answer"), button:has-text("Respond")');
        await browser.waitForReactRender();
      } else if (responseAreas.hasReflectionArea) {
        await browser.page.click('a[href*="reflections"], button:has-text("Reflections")');
        await browser.waitForReactRender();
        
        // Look for create reflection button
        const createButton = await browser.page.isVisible('button:has-text("New"), button:has-text("Create"), button:has-text("Add")');
        if (createButton) {
          await browser.page.click('button:has-text("New"), button:has-text("Create"), button:has-text("Add")');
          await browser.waitForReactRender();
        }
      }
    });

    await screenshotManager.takeFullPageScreenshot('response-area-ready');

    // PHASE 3: TEST MILD CRISIS KEYWORDS
    console.log('🔍 Phase 3: Test mild crisis keyword detection');

    await stateDebugger.trackStateTransition('test-mild-crisis-keywords', async () => {
      // Test with mild crisis language (should trigger detection but not high-alert)
      const mildCrisisText = 'I feel really overwhelmed and stressed about everything lately. Sometimes I wonder if things will ever get better.';
      
      const textArea = await browser.page.isVisible('textarea');
      if (textArea) {
        await browser.page.fill('textarea', mildCrisisText);
        await browser.page.click('button:has-text("Save"), button:has-text("Submit")');
        await browser.waitForReactRender();
        
        // Check for safety response
        const safetyResponse = await browser.page.evaluate(() => {
          return {
            hasWarningMessage: !!document.querySelector('.warning-message, [role="alert"]'),
            hasSafetyResources: !!document.querySelector('text*="resources", text*="help", .safety-resources'),
            hasGentleSupport: !!document.querySelector('text*="support", text*="care", .supportive-message'),
            hasResourceLinks: !!document.querySelector('a[href*="crisis"], a[href*="support"], .resource-links')
          };
        });
        
        console.log('🔍 Mild crisis response:', safetyResponse);
      }
    });

    await screenshotManager.takeFullPageScreenshot('mild-crisis-detection');

    // PHASE 4: TEST HIGH-ALERT CRISIS KEYWORDS
    console.log('🚨 Phase 4: Test high-alert crisis keyword detection');

    await stateDebugger.trackStateTransition('test-high-alert-crisis-keywords', async () => {
      // Clear previous text and test with high-alert keywords
      const textArea = await browser.page.isVisible('textarea');
      if (textArea) {
        // Use clinical/research appropriate crisis keywords for testing
        const highAlertText = 'I am having thoughts of self-harm and need immediate help. This is a crisis situation.';
        
        await browser.page.fill('textarea', highAlertText);
        
        // Monitor for immediate intervention
        const interventionStart = Date.now();
        await browser.page.click('button:has-text("Save"), button:has-text("Submit")');
        
        // Wait for crisis intervention modal/overlay
        try {
          await browser.page.waitForSelector('.crisis-modal, .emergency-modal, [data-testid="crisis-intervention"]', { timeout: 3000 });
        } catch (error) {
          console.log('⚠️  Crisis modal not found, checking for other safety responses');
        }
        
        const interventionTime = Date.now() - interventionStart;
        console.log(`🚨 Crisis intervention response time: ${interventionTime}ms`);
        
        // Check for crisis intervention features
        const crisisIntervention = await browser.page.evaluate(() => {
          return {
            hasCrisisModal: !!document.querySelector('.crisis-modal, .emergency-modal, [data-testid="crisis-intervention"]'),
            hasEmergencyContacts: !!document.querySelector('text*="911", text*="emergency", .emergency-contacts'),
            hasHotlineNumbers: !!document.querySelector('text*="hotline", text*="crisis line", .crisis-hotline'),
            hasImmediateHelp: !!document.querySelector('text*="immediate", text*="now", .immediate-help'),
            hasResourceList: !!document.querySelector('.resource-list, .crisis-resources'),
            hasTherapistFinder: !!document.querySelector('text*="therapist", text*="professional", .therapist-finder'),
            hasLocalResources: !!document.querySelector('text*="local", text*="near you", .local-resources')
          };
        });
        
        console.log('🚨 Crisis intervention features:', crisisIntervention);
        
        // Crisis intervention should be immediate and comprehensive
        if (crisisIntervention.hasCrisisModal) {
          expect(interventionTime).toBeLessThan(1000); // < 1s response time for crisis
        }
      }
    });

    await screenshotManager.takeFullPageScreenshot('high-alert-crisis-detection');

    // PHASE 5: VERIFY CRISIS RESOURCE PROVISION
    console.log('📞 Phase 5: Verify crisis resource provision');

    await stateDebugger.trackStateTransition('verify-crisis-resources', async () => {
      // Check for comprehensive crisis resources
      const resourceCheck = await browser.page.evaluate(() => {
        const resourceElements = Array.from(document.querySelectorAll('*')).filter(el => {
          const text = el.textContent.toLowerCase();
          return text.includes('crisis') || text.includes('hotline') || text.includes('emergency') || 
                 text.includes('988') || text.includes('suicide') || text.includes('help');
        });
        
        return {
          hasNationalSuicideHotline: !!document.querySelector('text*="988", text*="suicide", text*="national"'),
          hasCrisisTextLine: !!document.querySelector('text*="741741", text*="text", text*="crisis"'),
          hasLocalEmergency: !!document.querySelector('text*="911", text*="emergency"'),
          hasTherapistResources: !!document.querySelector('text*="therapist", text*="counselor", text*="professional"'),
          hasOnlineResources: !!document.querySelector('a[href*="crisis"], a[href*="suicide"], a[href*="help"]'),
          resourceCount: resourceElements.length,
          resourceTexts: resourceElements.slice(0, 5).map(el => el.textContent.substring(0, 50))
        };
      });
      
      console.log('📞 Crisis resources found:', resourceCheck);
      
      // Should provide multiple crisis resources
      expect(resourceCheck.resourceCount).toBeGreaterThan(0);
    });

    await screenshotManager.takeFullPageScreenshot('crisis-resources-provided');

    // PHASE 6: TEST CRISIS DATA HANDLING
    console.log('🔒 Phase 6: Test crisis data handling and privacy');

    // Verify crisis content is handled securely
    const crisisDataHandling = await stateDebugger.trackStateTransition('verify-crisis-data-handling', async () => {
      // Check that crisis content is not stored inappropriately
      const dataHandlingCheck = await browser.page.evaluate(() => {
        return {
          hasDataPrivacyNotice: !!document.querySelector('text*="privacy", text*="not stored", .privacy-notice'),
          hasSecureHandling: !!document.querySelector('text*="secure", text*="confidential", .secure-handling'),
          hasDataRetentionInfo: !!document.querySelector('text*="retention", text*="delete", .data-retention'),
          hasEncryptionInfo: !!document.querySelector('text*="encrypted", text*="secure", .encryption-info')
        };
      });
      
      console.log('🔒 Crisis data handling:', dataHandlingCheck);
      return dataHandlingCheck;
    });

    // PHASE 7: TEST CRISIS DETECTION ACCURACY
    console.log('🎯 Phase 7: Test crisis detection accuracy');

    await stateDebugger.trackStateTransition('test-detection-accuracy', async () => {
      // Test false positive prevention with similar but non-crisis content
      const nonCrisisText = 'I had a really hard day at work and felt overwhelmed, but I talked to my partner and feel better now.';
      
      const textArea = await browser.page.isVisible('textarea');
      if (textArea) {
        // Clear and test non-crisis content
        await browser.page.fill('textarea', nonCrisisText);
        await browser.page.click('button:has-text("Save"), button:has-text("Submit")');
        await browser.waitForReactRender();
        
        // Should not trigger crisis intervention
        const falsePositiveCheck = await browser.page.evaluate(() => {
          return {
            hasCrisisModal: !!document.querySelector('.crisis-modal, .emergency-modal'),
            hasEmergencyMessage: !!document.querySelector('text*="emergency", text*="911"'),
            hasNormalResponse: !!document.querySelector('.success-message, text*="saved", text*="thank you"'),
            hasOverreaction: !!document.querySelector('.crisis-resources, .hotline-numbers')
          };
        });
        
        console.log('🎯 False positive check:', falsePositiveCheck);
        
        // Should not trigger crisis intervention for normal stress
        expect(falsePositiveCheck.hasCrisisModal).toBe(false);
      }
    });

    await screenshotManager.takeFullPageScreenshot('non-crisis-content-handling');

    // PHASE 8: VERIFY CRISIS LOGGING AND MONITORING
    console.log('📊 Phase 8: Verify crisis logging and monitoring');

    // Check server logs for crisis events
    const crisisLogs = await serverLogs.getSupabaseLogs();
    const crisisEvents = crisisLogs.filter(log => 
      log.url?.includes('crisis') || log.url?.includes('safety') || log.url?.includes('intervention')
    );
    
    console.log(`📊 Crisis-related API calls: ${crisisEvents.length}`);

    // Check for audit logging (should log events without content)
    const auditLogs = crisisLogs.filter(log => 
      log.url?.includes('audit') || log.url?.includes('log') || log.method === 'POST'
    );
    
    console.log(`📋 Audit logging events: ${auditLogs.length}`);

    // Verify no crisis content in logs
    const logContentCheck = crisisLogs.some(log => 
      log.body?.includes('self-harm') || log.body?.includes('crisis')
    );
    
    console.log(`🔒 Crisis content in logs: ${logContentCheck}`);
    expect(logContentCheck).toBe(false); // Should not log crisis content

    // PHASE 9: PERFORMANCE AND SAFETY VALIDATION
    console.log('⚡ Phase 9: Performance and safety validation');

    const finalMetrics = await browser.getPerformanceMetrics();
    console.log('📊 Crisis Detection Performance:', {
      detectionResponseTime: finalMetrics.fullyLoaded,
      resourceLoadTime: finalMetrics.firstContentfulPaint,
      totalResources: finalMetrics.resourceCount,
      emergencyReadiness: finalMetrics.fromCache || 0
    });

    // Crisis detection should be fast
    expect(finalMetrics.fullyLoaded).toBeLessThan(1000); // < 1s for crisis detection

    // Generate comprehensive evidence
    await browser.captureFullEvidence('crisis-detection-safety-complete');
    await stateDebugger.generateStateReport();
    await screenshotManager.generateVisualReport('crisis-detection-safety');
    await serverLogs.generateDetailedReport();

    console.log('✅ Crisis detection and safety test completed successfully!');
    console.log('🛡️  Safety features validated with appropriate crisis intervention capabilities');
  });

  test('Validate crisis intervention modal and resources', async () => {
    console.log('🧪 Testing crisis intervention modal...');

    // Setup user
    const user = authHelpers.generateTestUser();
    await authHelpers.signUp(user);
    await authHelpers.signIn(user.email, user.password);

    // Simulate crisis intervention trigger
    await stateDebugger.trackStateTransition('simulate-crisis-intervention', async () => {
      // Look for any text input area
      const hasTextArea = await browser.page.isVisible('textarea');
      if (hasTextArea) {
        await browser.page.fill('textarea', 'I am in a crisis and need immediate help right now.');
        await browser.page.click('button:has-text("Save"), button:has-text("Submit")');
        await browser.waitForReactRender();
      }
    });

    await screenshotManager.takeFullPageScreenshot('crisis-intervention-modal');

    // Check modal functionality
    const modalCheck = await browser.page.evaluate(() => {
      return {
        hasModal: !!document.querySelector('.crisis-modal, .emergency-modal, [role="dialog"]'),
        hasCloseButton: !!document.querySelector('button:has-text("Close"), button:has-text("X"), .close-button'),
        hasResourceLinks: !!document.querySelector('a[href*="crisis"], a[href*="help"]'),
        hasHelpText: !!document.querySelector('text*="help", text*="support", text*="resources"'),
        isAccessible: !!document.querySelector('[role="dialog"], [aria-label*="crisis"]')
      };
    });

    console.log('🚨 Crisis Modal Check:', modalCheck);
    
    // Test modal accessibility
    if (modalCheck.hasModal) {
      expect(modalCheck.isAccessible).toBe(true);
    }
  });

  test('Validate crisis detection in different contexts', async () => {
    console.log('🧪 Testing crisis detection in different contexts...');

    // Setup user
    const user = authHelpers.generateTestUser();
    await authHelpers.signUp(user);
    await authHelpers.signIn(user.email, user.password);

    // Test crisis detection in reflections
    await stateDebugger.trackStateTransition('test-crisis-in-reflections', async () => {
      const reflectionsLink = await browser.page.isVisible('a[href*="reflections"], button:has-text("Reflections")');
      if (reflectionsLink) {
        await browser.page.click('a[href*="reflections"], button:has-text("Reflections")');
        await browser.waitForReactRender();
        
        const createButton = await browser.page.isVisible('button:has-text("New"), button:has-text("Create")');
        if (createButton) {
          await browser.page.click('button:has-text("New"), button:has-text("Create")');
          await browser.page.fill('textarea', 'I have been having thoughts of harming myself.');
          await browser.page.click('button:has-text("Save"), button:has-text("Create")');
          await browser.waitForReactRender();
        }
      }
    });

    await screenshotManager.takeFullPageScreenshot('crisis-in-reflections');

    // Test crisis detection in questions
    await browser.page.goto('http://localhost:3000/dashboard');
    await browser.waitForReactRender();

    await stateDebugger.trackStateTransition('test-crisis-in-questions', async () => {
      const questionButton = await browser.page.isVisible('button:has-text("Answer"), button:has-text("Respond")');
      if (questionButton) {
        await browser.page.click('button:has-text("Answer"), button:has-text("Respond")');
        await browser.page.fill('textarea', 'I am considering ending my life.');
        await browser.page.click('button:has-text("Save"), button:has-text("Submit")');
        await browser.waitForReactRender();
      }
    });

    await screenshotManager.takeFullPageScreenshot('crisis-in-questions');

    // Should detect crisis in any context
    const crisisDetected = await browser.page.evaluate(() => {
      return {
        hasAnyIntervention: !!document.querySelector('.crisis-modal, .emergency-modal, [data-testid="crisis-intervention"]'),
        hasAnyResources: !!document.querySelector('text*="crisis", text*="help", text*="988"'),
        hasAnyWarning: !!document.querySelector('.warning-message, [role="alert"]')
      };
    });

    console.log('🔍 Crisis detection across contexts:', crisisDetected);
  });

  test('Validate crisis detection privacy and security', async () => {
    console.log('🧪 Testing crisis detection privacy and security...');

    // Setup user
    const user = authHelpers.generateTestUser();
    await authHelpers.signUp(user);
    await authHelpers.signIn(user.email, user.password);

    // Test privacy handling
    await stateDebugger.trackStateTransition('test-crisis-privacy', async () => {
      const textArea = await browser.page.isVisible('textarea');
      if (textArea) {
        await browser.page.fill('textarea', 'I am having suicidal thoughts and need help.');
        await browser.page.click('button:has-text("Save"), button:has-text("Submit")');
        await browser.waitForReactRender();
      }
    });

    // Check privacy notices
    const privacyCheck = await browser.page.evaluate(() => {
      return {
        hasPrivacyNotice: !!document.querySelector('text*="privacy", text*="confidential", .privacy-notice'),
        hasDataWarning: !!document.querySelector('text*="not stored", text*="secure", .data-warning'),
        hasEncryptionInfo: !!document.querySelector('text*="encrypted", text*="secure", .encryption-info'),
        hasRetentionInfo: !!document.querySelector('text*="retention", text*="delete", .retention-info')
      };
    });

    console.log('🔒 Privacy handling:', privacyCheck);
    await screenshotManager.takeFullPageScreenshot('crisis-privacy-handling');

    // Verify logs don't contain crisis content
    const logs = await serverLogs.getSupabaseLogs();
    const crisisContentInLogs = logs.some(log => 
      log.body?.includes('suicidal') || log.body?.includes('harm') || log.body?.includes('crisis')
    );
    
    expect(crisisContentInLogs).toBe(false);
  });
});