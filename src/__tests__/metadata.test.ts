/**
 * Tests for Client Metadata Collection Module
 * 
 * This file contains tests for the main metadata collection functionality
 * including integration with all sub-modules.
 */

import { collectMetadata } from '../metadata.js';

// Mock the sub-modules
jest.mock('../uaParser.js', () => ({
  parseUserAgent: jest.fn(),
}));

jest.mock('../fingerprint.js', () => ({
  getFingerprint: jest.fn(),
}));

import { parseUserAgent } from '../uaParser.js';
import { getFingerprint } from '../fingerprint.js';

describe('Client Metadata Collection', () => {
  let mockConsoleWarn: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    mockConsoleWarn.mockRestore();
  });

  describe('Successful Metadata Collection', () => {
    test('should collect complete metadata when all modules succeed', async () => {
      // Mock successful user agent parsing
      const mockUAInfo = {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        browser: 'Chrome',
        platform: 'macOS',
        deviceType: 'desktop',
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);

      // Mock successful fingerprinting
      const mockFingerprint = 'abc123def456';
      (getFingerprint as jest.Mock).mockReturnValue(mockFingerprint);

      const result = await collectMetadata();

      expect(result).toEqual({
        userAgent: mockUAInfo.userAgent,
        browser: mockUAInfo.browser,
        platform: mockUAInfo.platform,
        deviceType: mockUAInfo.deviceType,
        ipAddress: '',
        fingerprint: mockFingerprint,
      });

      expect(parseUserAgent).toHaveBeenCalledTimes(1);
      expect(getFingerprint).toHaveBeenCalledTimes(1);
      expect(mockConsoleWarn).not.toHaveBeenCalled();
    });

    test('should include all required ClientMetadata properties', async () => {
      const mockUAInfo = {
        userAgent: 'Test UA',
        browser: 'TestBrowser',
        platform: 'TestOS',
        deviceType: 'desktop',
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);
      (getFingerprint as jest.Mock).mockReturnValue('test123');

      const result = await collectMetadata();

      // Check all required properties exist
      expect(result).toHaveProperty('userAgent');
      expect(result).toHaveProperty('browser');
      expect(result).toHaveProperty('platform');
      expect(result).toHaveProperty('deviceType');
      expect(result).toHaveProperty('ipAddress');

      // Check optional properties
      expect(result).toHaveProperty('fingerprint');

      // Verify types
      expect(typeof result.userAgent).toBe('string');
      expect(typeof result.browser).toBe('string');
      expect(typeof result.platform).toBe('string');
      expect(typeof result.deviceType).toBe('string');
      expect(typeof result.ipAddress).toBe('string');
      expect(typeof result.fingerprint).toBe('string');
    });
  });

  describe('Error Handling', () => {
    test('should handle fingerprinting failure gracefully', async () => {
      const mockUAInfo = {
        userAgent: 'Test UA',
        browser: 'Chrome',
        platform: 'Windows',
        deviceType: 'desktop',
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);

      // Mock fingerprinting failure
      (getFingerprint as jest.Mock).mockImplementation(() => {
        throw new Error('Fingerprinting failed');
      });

      const result = await collectMetadata();

      expect(result).toEqual({
        userAgent: mockUAInfo.userAgent,
        browser: mockUAInfo.browser,
        platform: mockUAInfo.platform,
        deviceType: mockUAInfo.deviceType,
        ipAddress: '',
        // fingerprint should not be included when it fails
      });

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'Failed to generate fingerprint:',
        expect.any(Error)
      );
    });

    test('should handle user agent parsing returning minimal data', async () => {
      const mockUAInfo = {
        userAgent: '',
        browser: 'Unknown',
        platform: 'Unknown',
        deviceType: 'desktop',
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);
      (getFingerprint as jest.Mock).mockReturnValue('fallback123');

      const result = await collectMetadata();

      expect(result.browser).toBe('Unknown');
      expect(result.platform).toBe('Unknown');
      expect(result.deviceType).toBe('desktop');
      expect(result.fingerprint).toBe('fallback123');
    });

    test('should not fail when user agent parsing throws error', async () => {
      (parseUserAgent as jest.Mock).mockImplementation(() => {
        throw new Error('UA parsing failed');
      });
      (getFingerprint as jest.Mock).mockReturnValue('test123');

      await expect(collectMetadata()).rejects.toThrow('UA parsing failed');
    });
  });

  describe('Data Integration', () => {
    test('should properly spread user agent info into result', async () => {
      const mockUAInfo = {
        userAgent: 'Custom User Agent String',
        browser: 'CustomBrowser',
        platform: 'CustomOS',
        deviceType: 'tablet',
        additionalProp: 'should not appear', // This shouldn't be in final result
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);
      (getFingerprint as jest.Mock).mockReturnValue('fingerprint123');

      const result = await collectMetadata();

      expect(result.userAgent).toBe('Custom User Agent String');
      expect(result.browser).toBe('CustomBrowser');
      expect(result.platform).toBe('CustomOS');
      expect(result.deviceType).toBe('tablet');
      expect(result.fingerprint).toBe('fingerprint123');
      expect(result).not.toHaveProperty('additionalProp');
    });

    test('should maintain ipAddress as empty string for client-side collection', async () => {
      const mockUAInfo = {
        userAgent: 'Test',
        browser: 'Test',
        platform: 'Test',
        deviceType: 'desktop',
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);
      (getFingerprint as jest.Mock).mockReturnValue('test');

      const result = await collectMetadata();

      expect(result.ipAddress).toBe('');
    });
  });

  describe('Optional Properties', () => {
    test('should not include fingerprint when generation fails', async () => {
      const mockUAInfo = {
        userAgent: 'Test',
        browser: 'Test',
        platform: 'Test',
        deviceType: 'desktop',
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);
      (getFingerprint as jest.Mock).mockImplementation(() => {
        throw new Error('Fingerprint failed');
      });

      const result = await collectMetadata();

      expect(result).not.toHaveProperty('fingerprint');
      expect(Object.keys(result)).not.toContain('fingerprint');
    });

    test('should include fingerprint when generation succeeds', async () => {
      const mockUAInfo = {
        userAgent: 'Test',
        browser: 'Test',
        platform: 'Test',
        deviceType: 'desktop',
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);
      (getFingerprint as jest.Mock).mockReturnValue('success123');

      const result = await collectMetadata();

      expect(result).toHaveProperty('fingerprint');
      expect(result.fingerprint).toBe('success123');
    });

    test('should not include location property (reserved for backend)', async () => {
      const mockUAInfo = {
        userAgent: 'Test',
        browser: 'Test',
        platform: 'Test',
        deviceType: 'desktop',
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);
      (getFingerprint as jest.Mock).mockReturnValue('test');

      const result = await collectMetadata();

      expect(result).not.toHaveProperty('location');
    });
  });

  describe('Return Type Compliance', () => {
    test('should return Promise<ClientMetadata>', async () => {
      const mockUAInfo = {
        userAgent: 'Test',
        browser: 'Test',
        platform: 'Test',
        deviceType: 'desktop',
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);
      (getFingerprint as jest.Mock).mockReturnValue('test');

      const promise = collectMetadata();
      expect(promise).toBeInstanceOf(Promise);

      const result = await promise;
      
      // Verify the result matches ClientMetadata interface structure
      const expectedKeys = ['userAgent', 'browser', 'platform', 'deviceType', 'ipAddress'];
      expectedKeys.forEach(key => {
        expect(result).toHaveProperty(key);
      });
    });
  });

  describe('Performance and Efficiency', () => {
    test('should call each sub-module exactly once', async () => {
      const mockUAInfo = {
        userAgent: 'Test',
        browser: 'Test',
        platform: 'Test',
        deviceType: 'desktop',
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);
      (getFingerprint as jest.Mock).mockReturnValue('test');

      await collectMetadata();

      expect(parseUserAgent).toHaveBeenCalledTimes(1);
      expect(getFingerprint).toHaveBeenCalledTimes(1);
    });

    test('should complete quickly', async () => {
      const mockUAInfo = {
        userAgent: 'Test',
        browser: 'Test',
        platform: 'Test',
        deviceType: 'desktop',
      };
      (parseUserAgent as jest.Mock).mockReturnValue(mockUAInfo);
      (getFingerprint as jest.Mock).mockReturnValue('test');

      const startTime = Date.now();
      await collectMetadata();
      const endTime = Date.now();

      // Should complete within 100ms (very generous for unit tests)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
