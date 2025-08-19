/**
 * Global Setup for Jest Tests
 * Runs once before all tests
 */
export default async function globalSetup() {
  console.log('🧪 Setting up ViewLogic test environment...');
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.VUE_APP_ENV = 'testing';
  
  // Mock Date for consistent testing
  const mockDate = new Date('2025-01-01T00:00:00.000Z');
  global.Date = class extends Date {
    constructor(date) {
      if (date) {
        return super(date);
      }
      return mockDate;
    }
    
    static now() {
      return mockDate.getTime();
    }
  };
  
  console.log('✅ Global test setup complete');
}