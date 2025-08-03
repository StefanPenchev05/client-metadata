/**
 * Jest Test Setup
 * 
 * This file contains global test setup configuration and mocks
 * that are applied to all test files.
 */

/// <reference types="jest" />

// Mock console methods to avoid cluttering test output
const consoleMock = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
Object.assign(console, consoleMock);

// Mock navigator object for browser environment simulation
Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    platform: 'MacIntel',
    language: 'en-US',
    languages: ['en-US', 'en'],
    cookieEnabled: true,
    onLine: true,
    hardwareConcurrency: 8,
    maxTouchPoints: 0,
    plugins: [],
    mimeTypes: [],
    userAgentData: {
      platform: 'macOS',
      mobile: false,
    },
  },
});

// Mock screen object
Object.defineProperty(window, 'screen', {
  writable: true,
  value: {
    width: 1920,
    height: 1080,
    colorDepth: 24,
    pixelDepth: 24,
  },
});

// Mock Date for consistent timezone testing
jest.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-120); // UTC+2

// Clean up after tests
afterEach(() => {
  jest.clearAllMocks();
});

// Restore original implementations after all tests
afterAll(() => {
  jest.restoreAllMocks();
});
