const path = require('path');
const fs = require('fs').promises;

// Global test setup
beforeAll(async () => {
  // Ensure test directories exist
  const testDirs = [
    'screenshots',
    'logs', 
    'reports',
    'evidence',
    'state-dumps',
    'baselines',
    'diffs'
  ];
  
  for (const dir of testDirs) {
    await fs.mkdir(path.join(__dirname, '..', dir), { recursive: true });
  }
  
  console.log('🧪 Test environment initialized');
  console.log(`📁 Test directories created in: ${path.join(__dirname, '..')}`);
  
  // Set longer timeout for setup
  jest.setTimeout(60000);
});

// Global test cleanup
afterAll(async () => {
  console.log('🧹 Test cleanup completed');
});

// Enhanced expect matchers for e2e testing
expect.extend({
  toBeWithinPerformanceTarget(received, target, metric = 'milliseconds') {
    const pass = received <= target;
    
    if (pass) {
      return {
        message: () => `Expected ${received}${metric} to exceed ${target}${metric}`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received}${metric} to be within target of ${target}${metric}`,
        pass: false,
      };
    }
  },
  
  toContainStateProperty(received, property) {
    const hasProperty = received && received.state && received.state[property] !== undefined;
    
    if (hasProperty) {
      return {
        message: () => `Expected state to not contain property ${property}`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected state to contain property ${property}`,
        pass: false,
      };
    }
  },
  
  toHaveValidScreenshot(received) {
    const hasValidScreenshot = received && 
      received.path && 
      received.filename && 
      received.timestamp;
    
    if (hasValidScreenshot) {
      return {
        message: () => `Expected screenshot object to be invalid`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected valid screenshot object with path, filename, and timestamp`,
        pass: false,
      };
    }
  },
  
  toHaveVisualChangesWithin(received, threshold) {
    if (!received.comparison) {
      return {
        message: () => `Expected screenshot comparison data`,
        pass: false,
      };
    }
    
    const pass = received.comparison.diffPercentage <= threshold;
    
    if (pass) {
      return {
        message: () => `Expected visual changes to exceed ${threshold}% (got ${received.comparison.diffPercentage}%)`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected visual changes to be within ${threshold}% but got ${received.comparison.diffPercentage}%`,
        pass: false,
      };
    }
  }
});

// Global error handler for uncaught exceptions in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Test environment information
console.log('🌍 Test Environment Info:');
console.log(`   Node.js: ${process.version}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   CI Mode: ${process.env.CI === 'true' ? 'Yes' : 'No'}`);
console.log(`   Base URL: ${global.TEST_BASE_URL || 'http://localhost:3000'}`);
console.log(`   Headless: ${global.HEADLESS ? 'Yes' : 'No'}`);

// Helper to clean up old test artifacts
async function cleanupOldTestArtifacts(daysOld = 7) {
  const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
  const cleanupDirs = ['screenshots', 'logs', 'reports', 'evidence'];
  
  for (const dir of cleanupDirs) {
    const dirPath = path.join(__dirname, '..', dir);
    try {
      const files = await fs.readdir(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        if (stats.birthtime.getTime() < cutoff) {
          await fs.unlink(filePath);
        }
      }
    } catch (error) {
      // Directory might not exist yet, that's okay
    }
  }
}

// Clean up old artifacts on startup
cleanupOldTestArtifacts().catch(console.warn);