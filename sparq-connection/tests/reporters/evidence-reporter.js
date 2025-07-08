const fs = require('fs').promises;
const path = require('path');

class EvidenceReporter {
  constructor(globalConfig, options) {
    this.globalConfig = globalConfig;
    this.options = options;
    this.testResults = [];
    this.startTime = Date.now();
  }

  onRunStart() {
    console.log('📊 Evidence-based testing reporter started');
  }

  onTestResult(test, testResult) {
    const evidenceData = {
      testPath: test.path,
      testName: testResult.testResults.map(t => t.title).join(' → '),
      duration: testResult.perfStats.end - testResult.perfStats.start,
      status: testResult.numFailingTests > 0 ? 'failed' : 'passed',
      numPassingTests: testResult.numPassingTests,
      numFailingTests: testResult.numFailingTests,
      failures: testResult.testResults
        .filter(t => t.status === 'failed')
        .map(t => ({
          title: t.title,
          message: t.failureMessages.join('\n'),
          duration: t.duration
        })),
      screenshots: [],
      logs: [],
      stateCaptures: [],
      timestamp: new Date().toISOString()
    };

    this.testResults.push(evidenceData);
  }

  async onRunComplete() {
    const totalDuration = Date.now() - this.startTime;
    
    const report = {
      summary: {
        totalTests: this.testResults.length,
        passed: this.testResults.filter(t => t.status === 'passed').length,
        failed: this.testResults.filter(t => t.status === 'failed').length,
        duration: totalDuration,
        timestamp: new Date().toISOString()
      },
      testResults: this.testResults,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        ci: process.env.CI === 'true',
        baseUrl: global.TEST_BASE_URL || 'http://localhost:3000'
      },
      evidence: await this.collectEvidence()
    };

    // Save detailed report
    const reportPath = path.join(this.options.outputDir, 'evidence-report.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Generate HTML report
    await this.generateHtmlReport(report);

    console.log('📊 Evidence report generated:');
    console.log(`   Total Tests: ${report.summary.totalTests}`);
    console.log(`   Passed: ${report.summary.passed}`);
    console.log(`   Failed: ${report.summary.failed}`);
    console.log(`   Duration: ${Math.round(totalDuration / 1000)}s`);
    console.log(`   Report: ${reportPath}`);
  }

  async collectEvidence() {
    const evidence = {
      screenshots: [],
      logs: [],
      stateCaptures: [],
      visualDiffs: []
    };

    try {
      // Collect screenshots
      const screenshotDir = path.join(__dirname, '../screenshots');
      const screenshotFiles = await fs.readdir(screenshotDir).catch(() => []);
      for (const file of screenshotFiles) {
        if (file.endsWith('.png')) {
          const filePath = path.join(screenshotDir, file);
          const stats = await fs.stat(filePath);
          evidence.screenshots.push({
            filename: file,
            path: filePath,
            size: stats.size,
            created: stats.birthtime.toISOString()
          });
        }
      }

      // Collect logs
      const logDir = path.join(__dirname, '../logs');
      const logFiles = await fs.readdir(logDir).catch(() => []);
      for (const file of logFiles) {
        if (file.endsWith('.json')) {
          const filePath = path.join(logDir, file);
          const stats = await fs.stat(filePath);
          evidence.logs.push({
            filename: file,
            path: filePath,
            size: stats.size,
            created: stats.birthtime.toISOString()
          });
        }
      }

      // Collect state captures
      const stateDir = path.join(__dirname, '../state-dumps');
      const stateFiles = await fs.readdir(stateDir).catch(() => []);
      for (const file of stateFiles) {
        if (file.endsWith('.json')) {
          const filePath = path.join(stateDir, file);
          const stats = await fs.stat(filePath);
          evidence.stateCaptures.push({
            filename: file,
            path: filePath,
            size: stats.size,
            created: stats.birthtime.toISOString()
          });
        }
      }

      // Collect visual diffs
      const diffDir = path.join(__dirname, '../diffs');
      const diffFiles = await fs.readdir(diffDir).catch(() => []);
      for (const file of diffFiles) {
        if (file.endsWith('.png')) {
          const filePath = path.join(diffDir, file);
          const stats = await fs.stat(filePath);
          evidence.visualDiffs.push({
            filename: file,
            path: filePath,
            size: stats.size,
            created: stats.birthtime.toISOString()
          });
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not collect some evidence:', error.message);
    }

    return evidence;
  }

  async generateHtmlReport(report) {
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sparq Connection - Evidence-Based Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 2px solid #e1e1e1; padding-bottom: 20px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { padding: 15px; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px; }
        .metric.passed { border-left-color: #28a745; }
        .metric.failed { border-left-color: #dc3545; }
        .test-result { margin-bottom: 20px; padding: 15px; border: 1px solid #dee2e6; border-radius: 8px; }
        .test-result.passed { border-left: 4px solid #28a745; }
        .test-result.failed { border-left: 4px solid #dc3545; }
        .evidence-section { margin-top: 30px; }
        .evidence-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
        .evidence-item { padding: 10px; background: #f8f9fa; border-radius: 4px; font-size: 0.9em; }
        .screenshot-thumbnail { max-width: 100%; height: auto; border-radius: 4px; margin-top: 10px; cursor: pointer; }
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.9); }
        .modal-content { margin: auto; display: block; max-width: 90%; max-height: 90%; margin-top: 2%; }
        .close { position: absolute; top: 15px; right: 35px; color: #f1f1f1; font-size: 40px; font-weight: bold; cursor: pointer; }
        .error-message { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; margin-top: 10px; font-family: monospace; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Sparq Connection - Evidence-Based Test Report</h1>
            <p>Generated on ${new Date(report.summary.timestamp).toLocaleString()}</p>
        </div>

        <div class="summary">
            <div class="metric">
                <h3>Total Tests</h3>
                <div style="font-size: 2em; font-weight: bold;">${report.summary.totalTests}</div>
            </div>
            <div class="metric passed">
                <h3>Passed</h3>
                <div style="font-size: 2em; font-weight: bold; color: #28a745;">${report.summary.passed}</div>
            </div>
            <div class="metric failed">
                <h3>Failed</h3>
                <div style="font-size: 2em; font-weight: bold; color: #dc3545;">${report.summary.failed}</div>
            </div>
            <div class="metric">
                <h3>Duration</h3>
                <div style="font-size: 2em; font-weight: bold;">${Math.round(report.summary.duration / 1000)}s</div>
            </div>
        </div>

        <h2>📋 Test Results</h2>
        ${report.testResults.map(test => `
            <div class="test-result ${test.status}">
                <h3>${test.testName}</h3>
                <p><strong>Status:</strong> ${test.status.toUpperCase()}</p>
                <p><strong>Duration:</strong> ${Math.round(test.duration)}ms</p>
                ${test.failures.length > 0 ? `
                    <div class="error-message">
                        ${test.failures.map(f => `<div><strong>${f.title}:</strong><br>${f.message}</div>`).join('<br>')}
                    </div>
                ` : ''}
            </div>
        `).join('')}

        <div class="evidence-section">
            <h2>📸 Evidence Collected</h2>
            
            <h3>Screenshots (${report.evidence.screenshots.length})</h3>
            <div class="evidence-grid">
                ${report.evidence.screenshots.slice(0, 12).map(screenshot => `
                    <div class="evidence-item">
                        <strong>${screenshot.filename}</strong>
                        <br>Size: ${Math.round(screenshot.size / 1024)}KB
                        <br>Created: ${new Date(screenshot.created).toLocaleString()}
                        <img src="file://${screenshot.path}" alt="${screenshot.filename}" class="screenshot-thumbnail" onclick="openModal('${screenshot.path}')">
                    </div>
                `).join('')}
            </div>

            <h3>Log Files (${report.evidence.logs.length})</h3>
            <div class="evidence-grid">
                ${report.evidence.logs.slice(0, 8).map(log => `
                    <div class="evidence-item">
                        <strong>${log.filename}</strong>
                        <br>Size: ${Math.round(log.size / 1024)}KB
                        <br>Created: ${new Date(log.created).toLocaleString()}
                    </div>
                `).join('')}
            </div>

            <h3>State Captures (${report.evidence.stateCaptures.length})</h3>
            <div class="evidence-grid">
                ${report.evidence.stateCaptures.slice(0, 8).map(state => `
                    <div class="evidence-item">
                        <strong>${state.filename}</strong>
                        <br>Size: ${Math.round(state.size / 1024)}KB
                        <br>Created: ${new Date(state.created).toLocaleString()}
                    </div>
                `).join('')}
            </div>

            ${report.evidence.visualDiffs.length > 0 ? `
                <h3>Visual Differences (${report.evidence.visualDiffs.length})</h3>
                <div class="evidence-grid">
                    ${report.evidence.visualDiffs.map(diff => `
                        <div class="evidence-item">
                            <strong>${diff.filename}</strong>
                            <br>Size: ${Math.round(diff.size / 1024)}KB
                            <br>Created: ${new Date(diff.created).toLocaleString()}
                            <img src="file://${diff.path}" alt="${diff.filename}" class="screenshot-thumbnail" onclick="openModal('${diff.path}')">
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>

        <div class="evidence-section">
            <h2>🌍 Environment</h2>
            <div class="evidence-item">
                <strong>Node.js:</strong> ${report.environment.nodeVersion}<br>
                <strong>Platform:</strong> ${report.environment.platform}<br>
                <strong>CI Mode:</strong> ${report.environment.ci ? 'Yes' : 'No'}<br>
                <strong>Base URL:</strong> ${report.environment.baseUrl}
            </div>
        </div>
    </div>

    <!-- Modal for viewing screenshots -->
    <div id="imageModal" class="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <img class="modal-content" id="modalImage">
    </div>

    <script>
        function openModal(imagePath) {
            document.getElementById('imageModal').style.display = 'block';
            document.getElementById('modalImage').src = imagePath;
        }

        function closeModal() {
            document.getElementById('imageModal').style.display = 'none';
        }

        // Close modal when clicking outside the image
        window.onclick = function(event) {
            const modal = document.getElementById('imageModal');
            if (event.target === modal) {
                closeModal();
            }
        }
    </script>
</body>
</html>`;

    const htmlPath = path.join(this.options.outputDir, 'evidence-report.html');
    await fs.writeFile(htmlPath, htmlTemplate);
    console.log(`📄 HTML report generated: ${htmlPath}`);
  }
}

module.exports = EvidenceReporter;