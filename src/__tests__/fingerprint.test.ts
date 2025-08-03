/**
 * Tests for Browser Fingerprinting Module
 * 
 * This file contains tests for fingerprint generation functionality
 * including error handling and fallback mechanisms.
 */

import { getFingerprint } from '../fingerprint.js';

// Mock the ClientJS library
jest.mock('clientjs', () => {
  return {
    ClientJS: jest.fn().mockImplementation(() => ({
      getFingerprint: jest.fn(),
    })),
  };
});

import { ClientJS } from 'clientjs';

describe('Browser Fingerprinting', () => {
  let mockClientInstance: any;
  let mockConsoleWarn: jest.SpyInstance;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock instance
    mockClientInstance = {
      getFingerprint: jest.fn(),
    };
    
    // Mock ClientJS constructor
    (ClientJS as any).mockImplementation(() => mockClientInstance);
    
    // Mock console.warn to test error handling
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    mockConsoleWarn.mockRestore();
  });

  describe('Successful Fingerprint Generation', () => {
    test('should return fingerprint string when ClientJS succeeds', () => {
      const expectedFingerprint = 'abc123def456';
      mockClientInstance.getFingerprint.mockReturnValue(expectedFingerprint);

      const result = getFingerprint();

      expect(result).toBe(expectedFingerprint);
      expect(ClientJS).toHaveBeenCalledTimes(1);
      expect(mockClientInstance.getFingerprint).toHaveBeenCalledTimes(1);
      expect(mockConsoleWarn).not.toHaveBeenCalled();
    });

    test('should convert numeric fingerprint to string', () => {
      const numericFingerprint = 123456789;
      mockClientInstance.getFingerprint.mockReturnValue(numericFingerprint);

      const result = getFingerprint();

      expect(result).toBe('123456789');
      expect(typeof result).toBe('string');
    });

    test('should handle fingerprint with special characters', () => {
      const specialFingerprint = 'abc-123_def.456';
      mockClientInstance.getFingerprint.mockReturnValue(specialFingerprint);

      const result = getFingerprint();

      expect(result).toBe(specialFingerprint);
    });
  });

  describe('Error Handling and Fallbacks', () => {
    test('should use fallback when ClientJS throws error', () => {
      mockClientInstance.getFingerprint.mockImplementation(() => {
        throw new Error('ClientJS failed');
      });

      const result = getFingerprint();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'Browser fingerprinting failed:',
        expect.any(Error)
      );
    });

    test('should use fallback when ClientJS returns empty string', () => {
      mockClientInstance.getFingerprint.mockReturnValue('');

      const result = getFingerprint();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).not.toBe('');
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'Browser fingerprinting failed:',
        expect.any(Error)
      );
    });

    test('should use fallback when ClientJS returns null', () => {
      mockClientInstance.getFingerprint.mockReturnValue(null);

      const result = getFingerprint();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'Browser fingerprinting failed:',
        expect.any(Error)
      );
    });

    test('should use fallback when ClientJS returns undefined', () => {
      mockClientInstance.getFingerprint.mockReturnValue(undefined);

      const result = getFingerprint();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'Browser fingerprinting failed:',
        expect.any(Error)
      );
    });
  });

  describe('Fallback Fingerprint Generation', () => {
    beforeEach(() => {
      // Force fallback by making ClientJS always fail
      mockClientInstance.getFingerprint.mockImplementation(() => {
        throw new Error('ClientJS unavailable');
      });
    });

    test('should generate consistent fallback fingerprint', () => {
      const result1 = getFingerprint();
      const result2 = getFingerprint();

      expect(result1).toBe(result2);
      expect(typeof result1).toBe('string');
      expect(result1.length).toBeGreaterThan(0);
    });

    test('should generate different fingerprints for different environments', () => {
      // Get fingerprint with current environment
      const result1 = getFingerprint();

      // Change screen dimensions
      Object.defineProperty(window, 'screen', {
        value: { width: 800, height: 600, colorDepth: 16 },
        writable: true,
      });

      const result2 = getFingerprint();

      expect(result1).not.toBe(result2);
    });

    test('should handle missing navigator properties gracefully', () => {
      // Mock navigator with missing properties
      Object.defineProperty(window, 'navigator', {
        value: {},
        writable: true,
      });

      const result = getFingerprint();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should handle missing screen properties gracefully', () => {
      // Mock screen with missing properties
      Object.defineProperty(window, 'screen', {
        value: {},
        writable: true,
      });

      const result = getFingerprint();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Ultimate Fallback', () => {
    test('should provide timestamp-based fallback when everything fails', () => {
      // Mock everything to fail
      mockClientInstance.getFingerprint.mockImplementation(() => {
        throw new Error('ClientJS failed');
      });

      // Store original navigator
      const originalNavigator = window.navigator;
      
      // Mock navigator properties to cause fallback fingerprint to fail
      Object.defineProperty(window, 'navigator', {
        value: {
          get userAgent() {
            throw new Error('Navigator unavailable');
          },
          get language() {
            throw new Error('Navigator unavailable');
          },
        },
        writable: true,
      });

      const result = getFingerprint();

      expect(typeof result).toBe('string');
      expect(result).toMatch(/^fallback_[0-9a-f]+$/);
      expect(mockConsoleWarn).toHaveBeenCalledTimes(2); // One for ClientJS, one for fallback
      
      // Restore original navigator
      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });
  });

  describe('Return Value Properties', () => {
    test('should always return a non-empty string', () => {
      mockClientInstance.getFingerprint.mockReturnValue('test123');

      const result = getFingerprint();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should return valid hexadecimal characters in fallback', () => {
      mockClientInstance.getFingerprint.mockImplementation(() => {
        throw new Error('Force fallback');
      });

      const result = getFingerprint();

      expect(result).toMatch(/^[0-9a-f]+$/);
    });
  });
});
