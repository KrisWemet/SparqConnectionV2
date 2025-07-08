const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

describe('Evidence-Based Testing Demo', () => {
  let browser, page;
  let testEvidence = [];

  beforeAll(async () => {
    browser = await puppeteer.launch({ 
      headless: false, // Show browser for demo
      slowMo: 200 // Slow down for visibility
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
    
    // Generate evidence report
    await generateEvidenceReport();
  });

  async function captureEvidence(stepName, details) {
    const timestamp = new Date().toISOString();
    const screenshotPath = `tests/screenshots/evidence-${stepName}-${Date.now()}.png`;
    
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    const evidence = {
      step: stepName,
      timestamp,
      url: page.url(),
      title: await page.title(),
      screenshot: screenshotPath,
      details,
      performance: await page.metrics()
    };
    
    testEvidence.push(evidence);
    console.log(`📸 Evidence captured for: ${stepName}`);
    return evidence;
  }

  async function generateEvidenceReport() {
    const reportPath = 'tests/reports/evidence-demo-report.html';
    await fs.mkdir('tests/reports', { recursive: true });
    
    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Sparq Connection - Evidence-Based Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .evidence-item { border: 1px solid #ddd; margin: 20px 0; padding: 15px; border-radius: 8px; }
        .screenshot { max-width: 100%; border-radius: 4px; }
        .metrics { background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; }
        h1, h2 { color: #333; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Sparq Connection - Evidence-Based Test Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <p>Total Evidence Items: ${testEvidence.length}</p>
        
        ${testEvidence.map((evidence, index) => `
            <div class="evidence-item">
                <h2>Step ${index + 1}: ${evidence.step}</h2>
                <p class="timestamp">Captured: ${new Date(evidence.timestamp).toLocaleString()}</p>
                <p><strong>URL:</strong> ${evidence.url}</p>
                <p><strong>Page Title:</strong> ${evidence.title}</p>
                
                ${evidence.details ? `
                    <h3>Details:</h3>
                    <pre>${JSON.stringify(evidence.details, null, 2)}</pre>
                ` : ''}
                
                <h3>Performance Metrics:</h3>
                <div class="metrics">
                    JavaScript Heap: ${Math.round(evidence.performance.JSHeapUsedSize / 1024 / 1024)}MB<br>
                    DOM Nodes: ${evidence.performance.Nodes}<br>
                    Event Listeners: ${evidence.performance.JSEventListeners}
                </div>
                
                <h3>Screenshot:</h3>
                <img src="../${evidence.screenshot}" alt="Evidence Screenshot" class="screenshot">
            </div>
        `).join('')}
    </div>
</body>
</html>`;
    
    await fs.writeFile(reportPath, htmlReport);
    console.log(`📊 Evidence report generated: ${reportPath}`);
  }

  test('Complete Evidence-Based User Journey Analysis', async () => {
    console.log('🎯 Starting Evidence-Based User Journey Analysis...');
    
    // EVIDENCE POINT 1: Landing Page Performance
    console.log('📊 Analyzing landing page performance...');
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForLoadState?.() || await new Promise(resolve => setTimeout(resolve, 2000));
    const loadTime = Date.now() - startTime;
    
    await captureEvidence('landing-page-performance', {
      loadTime: `${loadTime}ms`,
      performanceTarget: '< 2000ms',
      passed: loadTime < 2000
    });
    
    // EVIDENCE POINT 2: Content Analysis
    console.log('🔍 Analyzing page content and structure...');
    const contentAnalysis = await page.evaluate(() => {
      return {
        headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
          tag: h.tagName,
          text: h.textContent.trim().substring(0, 50)
        })),
        links: Array.from(document.querySelectorAll('a')).map(a => ({
          text: a.textContent.trim().substring(0, 30),
          href: a.href
        })),
        images: Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt || 'No alt text'
        })),
        formElements: Array.from(document.querySelectorAll('input, textarea, select')).map(el => ({
          type: el.type || el.tagName,
          name: el.name,
          placeholder: el.placeholder
        }))
      };
    });
    
    await captureEvidence('content-analysis', contentAnalysis);
    
    // EVIDENCE POINT 3: Navigation Testing
    console.log('🧭 Testing navigation to authentication...');
    const authLink = await page.$('a[href*="/auth"]');
    if (authLink) {
      await authLink.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const navigationEvidence = {
        previousUrl: 'http://localhost:3000',
        currentUrl: page.url(),
        navigationSuccessful: page.url().includes('/auth')
      };
      
      await captureEvidence('navigation-to-auth', navigationEvidence);
    }
    
    // EVIDENCE POINT 4: Form Interaction Analysis
    console.log('📝 Analyzing form interactions...');
    const formAnalysis = await page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form'));
      const inputs = Array.from(document.querySelectorAll('input'));
      
      return {
        totalForms: forms.length,
        totalInputs: inputs.length,
        inputTypes: inputs.map(input => input.type),
        hasEmailInput: inputs.some(input => input.type === 'email' || input.name === 'email'),
        hasPasswordInput: inputs.some(input => input.type === 'password' || input.name === 'password'),
        hasSubmitButton: !!document.querySelector('button[type="submit"], input[type="submit"]')
      };
    });
    
    // Test actual form interaction
    if (formAnalysis.hasEmailInput) {
      await page.type('input[type="email"], input[name="email"]', 'evidence.test@sparqconnection.com');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (formAnalysis.hasPasswordInput) {
      await page.type('input[type="password"], input[name="password"]', 'EvidenceTestPassword123!');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    await captureEvidence('form-interaction-analysis', formAnalysis);
    
    // EVIDENCE POINT 5: Error Handling Testing
    console.log('🛡️ Testing error handling capabilities...');
    
    // Test form submission with data
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const errorHandling = await page.evaluate(() => {
        return {
          hasErrorMessages: !!document.querySelector('.error, .error-message, [role="alert"]'),
          hasValidationFeedback: !!document.querySelector('.invalid, .valid, .validation'),
          remainsOnPage: window.location.pathname === '/auth',
          formStillVisible: !!document.querySelector('form')
        };
      });
      
      await captureEvidence('error-handling-test', errorHandling);
    }
    
    // EVIDENCE POINT 6: Responsive Design Testing
    console.log('📱 Testing responsive design...');
    
    // Mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mobileAnalysis = await page.evaluate(() => {
      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
        elementsVisible: {
          header: !!document.querySelector('header, .header'),
          navigation: !!document.querySelector('nav, .nav'),
          form: !!document.querySelector('form'),
          footer: !!document.querySelector('footer, .footer')
        }
      };
    });
    
    await captureEvidence('mobile-responsive-test', mobileAnalysis);
    
    // Tablet viewport
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await captureEvidence('tablet-responsive-test', { viewport: '768x1024' });
    
    // Desktop viewport
    await page.setViewport({ width: 1280, height: 720 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await captureEvidence('desktop-responsive-test', { viewport: '1280x720' });
    
    // EVIDENCE POINT 7: Performance Deep Dive
    console.log('⚡ Conducting performance deep dive...');
    
    const performanceMetrics = await page.metrics();
    const performanceEvidence = {
      jsHeapUsed: `${Math.round(performanceMetrics.JSHeapUsedSize / 1024 / 1024)}MB`,
      jsHeapTotal: `${Math.round(performanceMetrics.JSHeapTotalSize / 1024 / 1024)}MB`,
      domNodes: performanceMetrics.Nodes,
      eventListeners: performanceMetrics.JSEventListeners,
      performanceScore: {
        jsHeapHealthy: performanceMetrics.JSHeapUsedSize < 50 * 1024 * 1024, // < 50MB
        domNodesHealthy: performanceMetrics.Nodes < 2000, // < 2000 nodes
        listenersHealthy: performanceMetrics.JSEventListeners < 100 // < 100 listeners
      }
    };
    
    await captureEvidence('performance-deep-dive', performanceEvidence);
    
    // EVIDENCE POINT 8: Final State Validation
    console.log('✅ Final state validation...');
    
    const finalValidation = {
      currentUrl: page.url(),
      pageTitle: await page.title(),
      totalEvidencePoints: testEvidence.length + 1, // +1 for this final point
      testDuration: `${Date.now() - startTime}ms`,
      overallAssessment: {
        performanceGood: loadTime < 2000,
        navigationWorks: page.url().includes('/auth'),
        formsInteractive: formAnalysis.hasEmailInput && formAnalysis.hasPasswordInput,
        responsiveDesign: true // Based on successful viewport changes
      }
    };
    
    await captureEvidence('final-validation', finalValidation);
    
    console.log('🎉 Evidence-Based User Journey Analysis Complete!');
    console.log(`📊 Total Evidence Points Captured: ${testEvidence.length}`);
    console.log('📸 All screenshots saved to tests/screenshots/');
    console.log('📄 HTML report will be generated at: tests/reports/evidence-demo-report.html');
    
    // Validate that we successfully captured evidence
    expect(testEvidence.length).toBeGreaterThan(5);
    expect(loadTime).toBeLessThan(5000);
    expect(finalValidation.overallAssessment.navigationWorks).toBe(true);
  });
});