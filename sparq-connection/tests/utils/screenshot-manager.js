const path = require('path');
const fs = require('fs').promises;
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

class ScreenshotManager {
  constructor(browserManager) {
    this.browser = browserManager;
    this.screenshotDir = path.join(__dirname, '../screenshots');
    this.baselineDir = path.join(__dirname, '../baselines');
    this.diffDir = path.join(__dirname, '../diffs');
    this.counter = 0;
  }

  async ensureDirectories() {
    await fs.mkdir(this.screenshotDir, { recursive: true });
    await fs.mkdir(this.baselineDir, { recursive: true });
    await fs.mkdir(this.diffDir, { recursive: true });
  }

  async takeScreenshot(description, options = {}) {
    await this.ensureDirectories();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${this.browser.testName}-${this.counter++}-${description}-${timestamp}.png`;
    const screenshotPath = path.join(this.screenshotDir, filename);

    const defaultOptions = {
      fullPage: true,
      clip: null
    };

    const screenshotOptions = { ...defaultOptions, ...options };

    await this.browser.page.screenshot({
      path: screenshotPath,
      ...screenshotOptions
    });

    console.log(`📸 Screenshot saved: ${filename}`);
    
    return {
      filename,
      path: screenshotPath,
      description,
      timestamp: new Date().toISOString(),
      url: this.browser.page.url(),
      viewport: await this.browser.page.viewport()
    };
  }

  async takeElementScreenshot(selector, description) {
    const element = await this.browser.page.$(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    const boundingBox = await element.boundingBox();
    if (!boundingBox) {
      throw new Error(`Element has no bounding box: ${selector}`);
    }

    return await this.takeScreenshot(`element-${description}`, {
      clip: boundingBox,
      fullPage: false
    });
  }

  async takeViewportScreenshot(description) {
    return await this.takeScreenshot(`viewport-${description}`, {
      fullPage: false
    });
  }

  async takeFullPageScreenshot(description) {
    return await this.takeScreenshot(`fullpage-${description}`, {
      fullPage: true
    });
  }

  async captureFormState(description) {
    // Get all form inputs and their values
    const formData = await this.browser.page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form'));
      return forms.map(form => {
        const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
        return {
          formIndex: Array.from(document.querySelectorAll('form')).indexOf(form),
          inputs: inputs.map(input => ({
            type: input.type,
            name: input.name || input.id,
            value: input.type === 'password' ? '[HIDDEN]' : input.value,
            placeholder: input.placeholder,
            required: input.required,
            disabled: input.disabled
          }))
        };
      });
    });

    const screenshot = await this.takeScreenshot(`form-${description}`);
    
    return {
      ...screenshot,
      formData
    };
  }

  async captureModalState(description) {
    // Wait for any modals to be visible
    await this.browser.page.waitForSelector('[role="dialog"], .modal, [data-testid*="modal"]', { 
      timeout: 1000 
    }).catch(() => {
      // No modal found, that's okay
    });

    const modalInfo = await this.browser.page.evaluate(() => {
      const modals = document.querySelectorAll('[role="dialog"], .modal, [data-testid*="modal"]');
      return Array.from(modals).map(modal => ({
        isVisible: modal.offsetParent !== null,
        className: modal.className,
        testId: modal.getAttribute('data-testid'),
        title: modal.querySelector('h1, h2, h3, .modal-title')?.textContent,
        hasBackdrop: !!modal.parentElement?.classList.contains('backdrop')
      }));
    });

    const screenshot = await this.takeScreenshot(`modal-${description}`);
    
    return {
      ...screenshot,
      modalInfo
    };
  }

  async captureErrorState(description) {
    const errorInfo = await this.browser.page.evaluate(() => {
      const errorElements = document.querySelectorAll('.text-red-600, .error, [role="alert"], .alert-error');
      return Array.from(errorElements).map(el => ({
        text: el.textContent.trim(),
        className: el.className,
        role: el.getAttribute('role'),
        isVisible: el.offsetParent !== null
      }));
    });

    const screenshot = await this.takeScreenshot(`error-${description}`);
    
    return {
      ...screenshot,
      errorInfo
    };
  }

  async captureLoadingState(description) {
    const loadingInfo = await this.browser.page.evaluate(() => {
      const loadingElements = document.querySelectorAll('.animate-spin, .loading, .spinner, [data-testid*="loading"]');
      return Array.from(loadingElements).map(el => ({
        className: el.className,
        testId: el.getAttribute('data-testid'),
        isVisible: el.offsetParent !== null,
        text: el.textContent.trim()
      }));
    });

    const screenshot = await this.takeScreenshot(`loading-${description}`);
    
    return {
      ...screenshot,
      loadingInfo
    };
  }

  async createBaseline(description) {
    const screenshot = await this.takeScreenshot(description);
    const baselineFilename = `baseline-${description}.png`;
    const baselinePath = path.join(this.baselineDir, baselineFilename);
    
    // Copy screenshot to baseline
    await fs.copyFile(screenshot.path, baselinePath);
    
    console.log(`📏 Baseline created: ${baselineFilename}`);
    
    return {
      ...screenshot,
      baselinePath,
      isBaseline: true
    };
  }

  async compareWithBaseline(description, threshold = 0.1) {
    await this.ensureDirectories();
    
    const currentScreenshot = await this.takeScreenshot(description);
    const baselineFilename = `baseline-${description}.png`;
    const baselinePath = path.join(this.baselineDir, baselineFilename);
    
    // Check if baseline exists
    try {
      await fs.access(baselinePath);
    } catch (error) {
      console.warn(`⚠️ No baseline found for ${description}, creating one...`);
      await fs.copyFile(currentScreenshot.path, baselinePath);
      return {
        ...currentScreenshot,
        isBaseline: true,
        comparison: null
      };
    }

    // Load images
    const baselineBuffer = await fs.readFile(baselinePath);
    const currentBuffer = await fs.readFile(currentScreenshot.path);
    
    const baselineImg = PNG.sync.read(baselineBuffer);
    const currentImg = PNG.sync.read(currentBuffer);
    
    // Ensure images are same size
    if (baselineImg.width !== currentImg.width || baselineImg.height !== currentImg.height) {
      console.warn(`⚠️ Image dimensions don't match for ${description}`);
      return {
        ...currentScreenshot,
        comparison: {
          passed: false,
          reason: 'dimension-mismatch',
          baselineDimensions: { width: baselineImg.width, height: baselineImg.height },
          currentDimensions: { width: currentImg.width, height: currentImg.height }
        }
      };
    }

    // Compare images
    const diff = new PNG({ width: baselineImg.width, height: baselineImg.height });
    const pixelDifference = pixelmatch(
      baselineImg.data,
      currentImg.data,
      diff.data,
      baselineImg.width,
      baselineImg.height,
      { threshold: 0.1 }
    );

    const totalPixels = baselineImg.width * baselineImg.height;
    const diffPercentage = (pixelDifference / totalPixels) * 100;
    const passed = diffPercentage <= threshold;

    // Save diff image if there are differences
    let diffPath = null;
    if (pixelDifference > 0) {
      const diffFilename = `diff-${description}-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
      diffPath = path.join(this.diffDir, diffFilename);
      await fs.writeFile(diffPath, PNG.sync.write(diff));
      console.log(`🔍 Diff image saved: ${diffFilename}`);
    }

    const result = {
      ...currentScreenshot,
      comparison: {
        passed,
        pixelDifference,
        diffPercentage: Number(diffPercentage.toFixed(2)),
        threshold,
        diffPath,
        baselinePath
      }
    };

    if (passed) {
      console.log(`✅ Visual comparison passed: ${description} (${diffPercentage.toFixed(2)}% difference)`);
    } else {
      console.log(`❌ Visual comparison failed: ${description} (${diffPercentage.toFixed(2)}% difference, threshold: ${threshold}%)`);
    }

    return result;
  }

  async captureSequence(description, actions) {
    const sequence = [];
    
    // Take initial screenshot
    sequence.push(await this.takeScreenshot(`${description}-start`));
    
    // Execute actions with screenshots
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      
      // Execute the action
      if (typeof action.action === 'function') {
        await action.action();
      } else if (typeof action.action === 'string') {
        await this.browser.page.evaluate(action.action);
      }
      
      // Wait if specified
      if (action.wait) {
        await this.browser.page.waitForTimeout(action.wait);
      }
      
      // Take screenshot
      const stepDescription = action.description || `step-${i + 1}`;
      sequence.push(await this.takeScreenshot(`${description}-${stepDescription}`));
    }
    
    // Take final screenshot
    sequence.push(await this.takeScreenshot(`${description}-end`));
    
    return {
      description,
      sequence,
      totalSteps: sequence.length
    };
  }

  async generateVisualReport(testName) {
    const reportData = {
      testName,
      timestamp: new Date().toISOString(),
      screenshots: []
    };

    // Read all screenshots for this test
    const files = await fs.readdir(this.screenshotDir);
    const testScreenshots = files
      .filter(file => file.startsWith(testName) && file.endsWith('.png'))
      .sort();

    for (const filename of testScreenshots) {
      const filePath = path.join(this.screenshotDir, filename);
      const stats = await fs.stat(filePath);
      
      reportData.screenshots.push({
        filename,
        path: filePath,
        size: stats.size,
        created: stats.birthtime.toISOString()
      });
    }

    // Save report
    const reportPath = path.join(__dirname, '../reports', `visual-report-${testName}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));

    console.log(`📊 Visual report generated: visual-report-${testName}.json`);
    return reportData;
  }

  // Helper method to clean old screenshots
  async cleanOldScreenshots(daysOld = 7) {
    const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    
    const dirs = [this.screenshotDir, this.diffDir];
    
    for (const dir of dirs) {
      try {
        const files = await fs.readdir(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          
          if (stats.birthtime.getTime() < cutoff) {
            await fs.unlink(filePath);
            console.log(`🗑️ Cleaned old screenshot: ${file}`);
          }
        }
      } catch (error) {
        console.warn(`Could not clean directory ${dir}:`, error.message);
      }
    }
  }
}

module.exports = ScreenshotManager;