const BrowserManager = require('./browser-setup');

class AuthHelpers {
  constructor(browserManager) {
    this.browser = browserManager;
    this.testUsers = require('../fixtures/test-users.json');
  }

  async navigateToAuth() {
    await this.browser.page.goto('http://localhost:3000/auth');
    await this.browser.waitForReactRender();
    await this.browser.captureFullEvidence('auth-page-loaded');
  }

  async signUp(userData = null) {
    const user = userData || this.generateTestUser();
    
    // Navigate to auth page
    await this.navigateToAuth();
    
    // Switch to sign up form
    await this.browser.page.click('button:has-text("Don\'t have an account? Sign up")');
    await this.browser.captureFullEvidence('signup-form-displayed');

    // Fill out form
    await this.browser.page.fill('input[name="displayName"]', user.displayName);
    await this.browser.page.fill('input[name="email"]', user.email);
    await this.browser.page.fill('input[name="password"]', user.password);
    await this.browser.page.fill('input[name="confirmPassword"]', user.password);

    await this.browser.captureFullEvidence('signup-form-filled');

    // Submit form
    await this.browser.page.click('button[type="submit"]');
    
    // Wait for success state
    await this.browser.page.waitForSelector('h2:has-text("Check your email")', { timeout: 10000 });
    await this.browser.captureFullEvidence('signup-success');

    return user;
  }

  async signIn(email, password) {
    await this.navigateToAuth();
    
    // Fill sign in form (default form is sign in)
    await this.browser.page.fill('input[name="email"]', email);
    await this.browser.page.fill('input[name="password"]', password);
    
    await this.browser.captureFullEvidence('signin-form-filled');

    // Submit form
    await this.browser.page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await this.browser.page.waitForURL('**/dashboard', { timeout: 15000 });
    await this.browser.waitForReactRender();
    await this.browser.captureFullEvidence('signin-success-dashboard');

    return true;
  }

  async signInWithTestUser(userIndex = 0) {
    const user = this.testUsers.users[userIndex];
    return await this.signIn(user.email, user.password);
  }

  async signOut() {
    // Look for sign out button in dashboard
    await this.browser.page.click('button:has-text("Sign Out")');
    
    // Wait for redirect to home page
    await this.browser.page.waitForURL('http://localhost:3000/', { timeout: 10000 });
    await this.browser.captureFullEvidence('signout-success');
  }

  async testPasswordReset(email) {
    await this.navigateToAuth();
    
    // Click forgot password
    await this.browser.page.click('button:has-text("Forgot your password?")');
    await this.browser.captureFullEvidence('password-reset-form');

    // Fill email
    await this.browser.page.fill('input[name="email"]', email);
    
    // Submit
    await this.browser.page.click('button[type="submit"]');
    
    // Wait for success message
    await this.browser.page.waitForSelector('text="Password reset email sent"', { timeout: 10000 });
    await this.browser.captureFullEvidence('password-reset-sent');
  }

  async testAuthValidation() {
    await this.navigateToAuth();
    
    // Test empty form submission
    await this.browser.page.click('button[type="submit"]');
    await this.browser.captureFullEvidence('signin-validation-errors');

    // Test invalid email
    await this.browser.page.fill('input[name="email"]', 'invalid-email');
    await this.browser.page.click('button[type="submit"]');
    await this.browser.captureFullEvidence('invalid-email-error');

    // Switch to sign up and test validation
    await this.browser.page.click('button:has-text("Don\'t have an account? Sign up")');
    
    // Test password mismatch
    await this.browser.page.fill('input[name="displayName"]', 'Test User');
    await this.browser.page.fill('input[name="email"]', 'test@example.com');
    await this.browser.page.fill('input[name="password"]', 'password123');
    await this.browser.page.fill('input[name="confirmPassword"]', 'different');
    await this.browser.page.click('button[type="submit"]');
    await this.browser.captureFullEvidence('password-mismatch-error');
  }

  async testAuthStates() {
    // Test loading states
    await this.navigateToAuth();
    
    // Fill valid data but slow submission
    await this.browser.page.fill('input[name="email"]', 'test@example.com');
    await this.browser.page.fill('input[name="password"]', 'validpassword');
    
    // Click submit and immediately capture loading state
    const submitPromise = this.browser.page.click('button[type="submit"]');
    await this.browser.page.waitForSelector('button[disabled]', { timeout: 2000 });
    await this.browser.captureFullEvidence('auth-loading-state');
    
    await submitPromise;
  }

  async testSessionPersistence() {
    // Sign in
    await this.signInWithTestUser(0);
    
    // Refresh page
    await this.browser.page.reload();
    await this.browser.waitForReactRender();
    
    // Should still be on dashboard
    const url = this.browser.page.url();
    const isOnDashboard = url.includes('/dashboard');
    await this.browser.captureFullEvidence('session-persistence-test');
    
    return isOnDashboard;
  }

  async testAuthRedirects() {
    // Test unauthenticated access to protected route
    await this.browser.page.goto('http://localhost:3000/dashboard');
    await this.browser.page.waitForURL('**/auth', { timeout: 10000 });
    await this.browser.captureFullEvidence('protected-route-redirect');

    // Sign in
    await this.signInWithTestUser(0);
    
    // Try to access auth page while authenticated
    await this.browser.page.goto('http://localhost:3000/auth');
    await this.browser.page.waitForURL('**/dashboard', { timeout: 10000 });
    await this.browser.captureFullEvidence('auth-redirect-when-logged-in');
  }

  generateTestUser() {
    const timestamp = Date.now();
    return {
      displayName: `Test User ${timestamp}`,
      email: `test-${timestamp}@sparqtest.com`,
      password: 'TestPassword123!'
    };
  }

  async waitForAuthState(expectedState = 'authenticated') {
    await this.browser.page.waitForFunction((state) => {
      // Check React context for auth state
      const authContext = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.reactDevtoolsAgent?.store?.getElementByID?.(1);
      if (!authContext) return false;
      
      // This is a simplified check - in real implementation, 
      // we'd need to access the actual auth context
      if (state === 'authenticated') {
        return window.location.pathname === '/dashboard';
      } else {
        return window.location.pathname === '/' || window.location.pathname === '/auth';
      }
    }, {}, expectedState);
  }

  async getAuthState() {
    return await this.browser.page.evaluate(() => {
      // Try to access auth state from React context
      // This would need to be adapted based on the actual implementation
      return {
        isAuthenticated: window.location.pathname.includes('/dashboard'),
        currentPath: window.location.pathname,
        hasUser: !!document.querySelector('[data-testid="user-info"]')
      };
    });
  }

  async testAuthErrors() {
    await this.navigateToAuth();
    
    // Test wrong credentials
    await this.browser.page.fill('input[name="email"]', 'wrong@example.com');
    await this.browser.page.fill('input[name="password"]', 'wrongpassword');
    await this.browser.page.click('button[type="submit"]');
    
    // Wait for error message
    await this.browser.page.waitForSelector('.text-red-600', { timeout: 5000 });
    await this.browser.captureFullEvidence('auth-error-invalid-credentials');
  }
}

module.exports = AuthHelpers;