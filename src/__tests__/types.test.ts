/**
 * Tests for TypeScript Type Definitions
 * 
 * This file contains tests to ensure that the TypeScript interfaces
 * are properly defined and maintain type safety.
 */

import type { ClientMetadata } from '../types.js';

describe('TypeScript Type Definitions', () => {
  describe('ClientMetadata Interface', () => {
    test('should accept valid ClientMetadata object with all required properties', () => {
      const validMetadata: ClientMetadata = {
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        browser: 'Chrome',
        platform: 'macOS',
        deviceType: 'desktop',
      };

      expect(validMetadata).toBeDefined();
      expect(typeof validMetadata.ipAddress).toBe('string');
      expect(typeof validMetadata.userAgent).toBe('string');
      expect(typeof validMetadata.browser).toBe('string');
      expect(typeof validMetadata.platform).toBe('string');
      expect(typeof validMetadata.deviceType).toBe('string');
    });

    test('should accept ClientMetadata with optional fingerprint', () => {
      const metadataWithFingerprint: ClientMetadata = {
        ipAddress: '10.0.0.1',
        userAgent: 'Test User Agent',
        browser: 'Firefox',
        platform: 'Windows',
        deviceType: 'desktop',
        fingerprint: 'abc123def456',
      };

      expect(metadataWithFingerprint.fingerprint).toBe('abc123def456');
      expect(typeof metadataWithFingerprint.fingerprint).toBe('string');
    });

    test('should accept ClientMetadata with optional location', () => {
      const metadataWithLocation: ClientMetadata = {
        ipAddress: '203.0.113.1',
        userAgent: 'Test User Agent',
        browser: 'Safari',
        platform: 'iOS',
        deviceType: 'mobile',
        location: {
          country: 'United States',
          city: 'New York',
          latitude: 40.7128,
          longitude: -74.0060,
        },
      };

      expect(metadataWithLocation.location).toBeDefined();
      expect(metadataWithLocation.location?.country).toBe('United States');
      expect(metadataWithLocation.location?.city).toBe('New York');
      expect(metadataWithLocation.location?.latitude).toBe(40.7128);
      expect(metadataWithLocation.location?.longitude).toBe(-74.0060);
    });

    test('should accept location without coordinates', () => {
      const metadataWithPartialLocation: ClientMetadata = {
        ipAddress: '198.51.100.1',
        userAgent: 'Test User Agent',
        browser: 'Edge',
        platform: 'Windows',
        deviceType: 'desktop',
        location: {
          country: 'Canada',
          city: 'Toronto',
          // latitude and longitude are optional
        },
      };

      expect(metadataWithPartialLocation.location?.country).toBe('Canada');
      expect(metadataWithPartialLocation.location?.city).toBe('Toronto');
      expect(metadataWithPartialLocation.location?.latitude).toBeUndefined();
      expect(metadataWithPartialLocation.location?.longitude).toBeUndefined();
    });

    test('should accept all properties including optional ones', () => {
      const completeMetadata: ClientMetadata = {
        ipAddress: '172.16.0.1',
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
        browser: 'Chrome',
        platform: 'Android',
        deviceType: 'mobile',
        fingerprint: 'mobile123fingerprint',
        location: {
          country: 'Germany',
          city: 'Berlin',
          latitude: 52.5200,
          longitude: 13.4050,
        },
      };

      expect(completeMetadata.ipAddress).toBe('172.16.0.1');
      expect(completeMetadata.userAgent).toContain('Android');
      expect(completeMetadata.browser).toBe('Chrome');
      expect(completeMetadata.platform).toBe('Android');
      expect(completeMetadata.deviceType).toBe('mobile');
      expect(completeMetadata.fingerprint).toBe('mobile123fingerprint');
      expect(completeMetadata.location?.country).toBe('Germany');
      expect(completeMetadata.location?.city).toBe('Berlin');
      expect(completeMetadata.location?.latitude).toBe(52.5200);
      expect(completeMetadata.location?.longitude).toBe(13.4050);

      // Verify all properties are correctly typed
      expect(typeof completeMetadata.ipAddress).toBe('string');
      expect(typeof completeMetadata.userAgent).toBe('string');
      expect(typeof completeMetadata.browser).toBe('string');
      expect(typeof completeMetadata.platform).toBe('string');
      expect(typeof completeMetadata.deviceType).toBe('string');
      expect(typeof completeMetadata.fingerprint).toBe('string');
      expect(typeof completeMetadata.location?.country).toBe('string');
      expect(typeof completeMetadata.location?.city).toBe('string');
      expect(typeof completeMetadata.location?.latitude).toBe('number');
      expect(typeof completeMetadata.location?.longitude).toBe('number');
    });
  });

  describe('Type Safety and Constraints', () => {
    test('should ensure required properties cannot be undefined', () => {
      // This test ensures TypeScript compilation fails for missing required properties
      // The test itself validates the structure expectations
      
      const metadata: ClientMetadata = {
        ipAddress: '',
        userAgent: '',
        browser: '',
        platform: '',
        deviceType: '',
      };

      // All required properties should be defined (even if empty strings)
      expect(metadata.ipAddress).toBeDefined();
      expect(metadata.userAgent).toBeDefined();
      expect(metadata.browser).toBeDefined();
      expect(metadata.platform).toBeDefined();
      expect(metadata.deviceType).toBeDefined();
    });

    test('should handle edge cases with empty values', () => {
      const emptyMetadata: ClientMetadata = {
        ipAddress: '',
        userAgent: '',
        browser: 'Unknown',
        platform: 'Unknown',
        deviceType: 'desktop',
      };

      expect(emptyMetadata.ipAddress).toBe('');
      expect(emptyMetadata.userAgent).toBe('');
      expect(emptyMetadata.browser).toBe('Unknown');
      expect(emptyMetadata.platform).toBe('Unknown');
      expect(emptyMetadata.deviceType).toBe('desktop');
    });

    test('should support common device types', () => {
      const deviceTypes = ['desktop', 'mobile', 'tablet'];
      
      deviceTypes.forEach(deviceType => {
        const metadata: ClientMetadata = {
          ipAddress: '127.0.0.1',
          userAgent: 'Test',
          browser: 'Test',
          platform: 'Test',
          deviceType,
        };

        expect(metadata.deviceType).toBe(deviceType);
      });
    });

    test('should support common platforms', () => {
      const platforms = ['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'Chrome OS'];
      
      platforms.forEach(platform => {
        const metadata: ClientMetadata = {
          ipAddress: '127.0.0.1',
          userAgent: 'Test',
          browser: 'Test',
          platform,
          deviceType: 'desktop',
        };

        expect(metadata.platform).toBe(platform);
      });
    });

    test('should support common browsers', () => {
      const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave'];
      
      browsers.forEach(browser => {
        const metadata: ClientMetadata = {
          ipAddress: '127.0.0.1',
          userAgent: 'Test',
          browser,
          platform: 'Test',
          deviceType: 'desktop',
        };

        expect(metadata.browser).toBe(browser);
      });
    });
  });

  describe('Location Interface', () => {
    test('should handle location with all properties', () => {
      const metadata: ClientMetadata = {
        ipAddress: '8.8.8.8',
        userAgent: 'Test',
        browser: 'Test',
        platform: 'Test',
        deviceType: 'desktop',
        location: {
          country: 'Japan',
          city: 'Tokyo',
          latitude: 35.6762,
          longitude: 139.6503,
        },
      };

      const location = metadata.location!;
      expect(location.country).toBe('Japan');
      expect(location.city).toBe('Tokyo');
      expect(location.latitude).toBe(35.6762);
      expect(location.longitude).toBe(139.6503);
    });

    test('should handle negative coordinates', () => {
      const metadata: ClientMetadata = {
        ipAddress: '1.1.1.1',
        userAgent: 'Test',
        browser: 'Test',
        platform: 'Test',
        deviceType: 'desktop',
        location: {
          country: 'Argentina',
          city: 'Buenos Aires',
          latitude: -34.6118,
          longitude: -58.3960,
        },
      };

      const location = metadata.location!;
      expect(location.latitude).toBe(-34.6118);
      expect(location.longitude).toBe(-58.3960);
    });

    test('should handle zero coordinates', () => {
      const metadata: ClientMetadata = {
        ipAddress: '192.0.2.1',
        userAgent: 'Test',
        browser: 'Test',
        platform: 'Test',
        deviceType: 'desktop',
        location: {
          country: 'Ghana',
          city: 'Tema',
          latitude: 0,
          longitude: 0,
        },
      };

      const location = metadata.location!;
      expect(location.latitude).toBe(0);
      expect(location.longitude).toBe(0);
    });
  });

  describe('LocationData Interface', () => {
    test('should include IP address in standalone LocationData', () => {
      // Import LocationData type for direct testing
      const location: import('../types.js').LocationData = {
        ip: '203.0.113.1',
        country: 'Japan',
        city: 'Tokyo',
        latitude: 35.6762,
        longitude: 139.6503,
      };

      expect(location.ip).toBe('203.0.113.1');
      expect(location.country).toBe('Japan');
      expect(location.city).toBe('Tokyo');
      expect(location.latitude).toBe(35.6762);
      expect(location.longitude).toBe(139.6503);
    });

    test('should work without coordinates', () => {
      const location: import('../types.js').LocationData = {
        ip: '198.51.100.1',
        country: 'Australia',
        city: 'Sydney',
      };

      expect(location.ip).toBe('198.51.100.1');
      expect(location.country).toBe('Australia');
      expect(location.city).toBe('Sydney');
      expect(location.latitude).toBeUndefined();
      expect(location.longitude).toBeUndefined();
    });
  });
});
