/**
 * Tests for User Agent Parser Module
 * 
 * This file contains comprehensive tests for browser, platform, and device detection
 * using various real-world user agent strings.
 */

import { parseUserAgent } from '../uaParser.js';

declare const global: any;

describe('User Agent Parser', () => {
  // Store original navigator
  const originalNavigator = global.navigator;

  afterEach(() => {
    // Restore original navigator after each test
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
  });

  describe('Platform Detection', () => {
    test('should detect Windows 10/11', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const result = parseUserAgent();
      expect(result.platform).toBe('Windows 10/11');
    });

    test('should detect Windows 8.1', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const result = parseUserAgent();
      expect(result.platform).toBe('Windows 8.1');
    });

    test('should detect macOS', () => {
      mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const result = parseUserAgent();
      expect(result.platform).toBe('macOS');
    });

    test('should detect iOS', () => {
      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
      
      const result = parseUserAgent();
      expect(result.platform).toBe('iOS');
    });

    test('should detect iPadOS', () => {
      mockNavigator('Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
      
      const result = parseUserAgent();
      expect(result.platform).toBe('iPadOS');
    });

    test('should detect Android', () => {
      mockNavigator('Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36');
      
      const result = parseUserAgent();
      expect(result.platform).toBe('Android');
    });

    test('should detect Ubuntu Linux', () => {
      mockNavigator('Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0');
      
      const result = parseUserAgent();
      expect(result.platform).toBe('Ubuntu');
    });

    test('should detect Chrome OS', () => {
      mockNavigator('Mozilla/5.0 (X11; CrOS x86_64 13904.77.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const result = parseUserAgent();
      expect(result.platform).toBe('Chrome OS');
    });

    test('should return Unknown for unrecognized platform', () => {
      mockNavigator('Mozilla/5.0 (Unknown Platform) WebKit/537.36');
      
      const result = parseUserAgent();
      expect(result.platform).toBe('Unknown');
    });
  });

  describe('Browser Detection', () => {
    test('should detect Chrome', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const result = parseUserAgent();
      expect(result.browser).toBe('Chrome');
    });

    test('should detect Firefox', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');
      
      const result = parseUserAgent();
      expect(result.browser).toBe('Firefox');
    });

    test('should detect Safari', () => {
      mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15');
      
      const result = parseUserAgent();
      expect(result.browser).toBe('Safari');
    });

    test('should detect Edge (Chromium)', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59');
      
      const result = parseUserAgent();
      expect(result.browser).toBe('Edge');
    });

    test('should detect Opera', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/77.0.4054.277');
      
      const result = parseUserAgent();
      expect(result.browser).toBe('Opera');
    });

    test('should detect Brave', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Brave/91.1.26.74');
      
      const result = parseUserAgent();
      expect(result.browser).toBe('Brave');
    });

    test('should detect Samsung Internet', () => {
      mockNavigator('Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36');
      
      const result = parseUserAgent();
      expect(result.browser).toBe('Samsung Internet');
    });

    test('should return Unknown for unrecognized browser', () => {
      mockNavigator('UnknownBrowser/1.0');
      
      const result = parseUserAgent();
      expect(result.browser).toBe('Unknown');
    });
  });

  describe('Device Type Detection', () => {
    test('should detect desktop device', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const result = parseUserAgent();
      expect(result.deviceType).toBe('desktop');
    });

    test('should detect mobile device (iPhone)', () => {
      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
      
      const result = parseUserAgent();
      expect(result.deviceType).toBe('mobile');
    });

    test('should detect mobile device (Android)', () => {
      mockNavigator('Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36');
      
      const result = parseUserAgent();
      expect(result.deviceType).toBe('mobile');
    });

    test('should detect tablet device (iPad)', () => {
      mockNavigator('Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
      
      const result = parseUserAgent();
      expect(result.deviceType).toBe('tablet');
    });

    test('should detect tablet device (Android tablet)', () => {
      mockNavigator('Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const result = parseUserAgent();
      expect(result.deviceType).toBe('tablet');
    });
  });

  describe('Return Value Structure', () => {
    test('should return object with all expected properties', () => {
      mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const result = parseUserAgent();
      
      expect(result).toHaveProperty('userAgent');
      expect(result).toHaveProperty('platform');
      expect(result).toHaveProperty('browser');
      expect(result).toHaveProperty('deviceType');
      
      expect(typeof result.userAgent).toBe('string');
      expect(typeof result.platform).toBe('string');
      expect(typeof result.browser).toBe('string');
      expect(typeof result.deviceType).toBe('string');
    });

    test('should include original user agent string', () => {
      const testUA = 'Mozilla/5.0 (Test) TestBrowser/1.0';
      mockNavigator(testUA);
      
      const result = parseUserAgent();
      expect(result.userAgent).toBe(testUA);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty user agent', () => {
      mockNavigator('');
      
      const result = parseUserAgent();
      expect(result.userAgent).toBe('');
      expect(result.platform).toBe('Unknown');
      expect(result.browser).toBe('Unknown');
      expect(result.deviceType).toBe('desktop');
    });

    test('should handle malformed user agent', () => {
      mockNavigator('Malformed UA String Without Standard Format');
      
      const result = parseUserAgent();
      expect(result.userAgent).toBe('Malformed UA String Without Standard Format');
      expect(result.platform).toBe('Unknown');
      expect(result.browser).toBe('Unknown');
      expect(result.deviceType).toBe('desktop');
    });
  });
});

/**
 * Helper function to mock navigator.userAgent
 */
function mockNavigator(userAgent: string) {
  Object.defineProperty(global, 'navigator', {
    value: {
      userAgent,
    },
    writable: true,
  });
}
