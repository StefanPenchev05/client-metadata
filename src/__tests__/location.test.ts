/**
 * Tests for the location module
 * 
 * These tests verify the functionality of IP-based geolocation services,
 * including fallback mechanisms, error handling, and data validation.
 */

import { getLocation, getLocationWithTimeout, isLocationServiceAvailable } from '../location.js';

// Mock fetch globally
const mockFetch = jest.fn();
(globalThis as any).fetch = mockFetch;

// Mock console methods to avoid noise in test output
const consoleSpy = {
  warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
  log: jest.spyOn(console, 'log').mockImplementation(() => {}),
};

// Mock AbortController
class MockAbortController {
  signal = { aborted: false };
  abort = jest.fn(() => {
    this.signal.aborted = true;
  });
}

(globalThis as any).AbortController = MockAbortController;

describe('Location Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    consoleSpy.warn.mockClear();
    consoleSpy.log.mockClear();
  });

  afterAll(() => {
    consoleSpy.warn.mockRestore();
    consoleSpy.log.mockRestore();
  });

  describe('getLocation', () => {
    it('should return location data from the first provider when successful', async () => {
      const mockLocationData = {
        country_name: 'United States',
        city: 'New York',
        latitude: 40.7128,
        longitude: -74.0060,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLocationData,
      });

      const result = await getLocation();

      expect(result).toEqual({
        country: 'United States',
        city: 'New York',
        latitude: 40.7128,
        longitude: -74.0060,
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://ipapi.co/json/',
        expect.objectContaining({
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'ClientMetadata/1.0',
          },
        })
      );
    });

    it('should fallback to second provider when first provider fails', async () => {
      const mockLocationData = {
        country: 'Canada',
        city: 'Toronto',
        lat: 43.6532,
        lon: -79.3832,
      };

      // First provider fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Second provider succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLocationData,
      });

      const result = await getLocation();

      expect(result).toEqual({
        country: 'Canada',
        city: 'Toronto',
        latitude: 43.6532,
        longitude: -79.3832,
      });
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        'Failed to fetch location from ipapi.co:', 'Network error'
      );
    });

    it('should return undefined when all providers fail', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await getLocation();

      expect(result).toBeUndefined();
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        'All location providers failed. Location data unavailable.'
      );
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });
      
      // Make second provider fail too so we don't get extra calls
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getLocation();

      expect(result).toBeUndefined();
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        'Failed to fetch location from ipapi.co:', 'HTTP 404: Not Found'
      );
    });

    it('should handle invalid JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });
      
      // Make second provider fail too
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getLocation();

      expect(result).toBeUndefined();
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        'Failed to fetch location from ipapi.co:', 'Invalid response data format'
      );
    });

    it('should handle responses missing required fields', async () => {
      const incompleteData = {
        country_name: 'United States',
        // Missing city
        latitude: 40.7128,
        longitude: -74.0060,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => incompleteData,
      });
      
      // Make second provider fail too
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getLocation();

      expect(result).toBeUndefined();
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        'Failed to fetch location from ipapi.co:', 'Missing required location fields'
      );
    });

    it('should handle abort errors (timeouts)', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(abortError);

      const result = await getLocation();

      expect(result).toBeUndefined();
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('Location request to ipapi.co timed out')
      );
    });

    it('should validate coordinates when provided', async () => {
      const invalidLocationData = {
        country_name: 'Test Country',
        city: 'Test City',
        latitude: 200, // Invalid latitude (> 90)
        longitude: -74.0060,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidLocationData,
      });

      const result = await getLocation();

      expect(result).toBeUndefined();
    });

    it('should accept location data without coordinates', async () => {
      const locationDataWithoutCoords = {
        country_name: 'United Kingdom',
        city: 'London',
        // No coordinates
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => locationDataWithoutCoords,
      });

      const result = await getLocation();

      expect(result).toEqual({
        country: 'United Kingdom',
        city: 'London',
        latitude: undefined,
        longitude: undefined,
      });
    });

    it('should handle different provider data formats', async () => {
      // Test ip-api.com format
      const ipApiData = {
        country: 'France',
        city: 'Paris',
        lat: 48.8566,
        lon: 2.3522,
      };

      // First provider fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Second provider (ip-api.com) succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ipApiData,
      });

      const result = await getLocation();

      expect(result).toEqual({
        country: 'France',
        city: 'Paris',
        latitude: 48.8566,
        longitude: 2.3522,
      });
    });
  });

  describe('getLocationWithTimeout', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return location data when resolved within timeout', async () => {
      const mockLocationData = {
        country_name: 'Germany',
        city: 'Berlin',
        latitude: 52.5200,
        longitude: 13.4050,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLocationData,
      });

      const resultPromise = getLocationWithTimeout(10000);
      
      // Fast-forward timers but not enough to trigger timeout
      jest.advanceTimersByTime(1000);
      
      const result = await resultPromise;

      expect(result).toEqual({
        country: 'Germany',
        city: 'Berlin',
        latitude: 52.5200,
        longitude: 13.4050,
      });
    });

    it('should return undefined when timeout is reached', async () => {
      // Create a hanging promise to simulate a slow request
      const hangingPromise = new Promise<never>(() => {
        // Promise never resolves
      });
      mockFetch.mockReturnValueOnce(hangingPromise);

      const resultPromise = getLocationWithTimeout(5000);
      
      // Fast-forward past the timeout
      jest.advanceTimersByTime(5001);
      
      const result = await resultPromise;

      expect(result).toBeUndefined();
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        'Location request timed out after 5000ms'
      );
    });
  });

  describe('isLocationServiceAvailable', () => {
    beforeEach(() => {
      // Clear console spy before each test
      consoleSpy.warn.mockClear();
    });

    it('should return true in a browser environment with fetch', () => {
      // In jest with jsdom, window and fetch should be available
      const result = isLocationServiceAvailable();
      expect(result).toBe(true);
    });

    // Note: Testing different window.location scenarios is difficult in Jest
    // because window.location is not configurable. The function includes
    // proper runtime checks for non-HTTPS sites and localhost handling.
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle malformed JSON responses gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Unexpected token in JSON');
        },
      });
      
      // Make second provider fail too
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getLocation();

      expect(result).toBeUndefined();
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        'Failed to fetch location from ipapi.co:', 'Unexpected token in JSON'
      );
    });

    it('should handle non-Error exceptions', async () => {
      mockFetch.mockRejectedValueOnce('String error');
      
      // Make second provider fail too
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getLocation();

      expect(result).toBeUndefined();
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        'Unknown error fetching location from ipapi.co:', 'String error'
      );
    });

    it('should handle coordinates at boundary values', async () => {
      const boundaryLocationData = {
        country_name: 'Test Country',
        city: 'Test City',
        latitude: 90, // Maximum valid latitude
        longitude: -180, // Minimum valid longitude
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => boundaryLocationData,
      });

      const result = await getLocation();

      expect(result).toEqual({
        country: 'Test Country',
        city: 'Test City',
        latitude: 90,
        longitude: -180,
      });
    });

    it('should reject coordinates outside valid ranges', async () => {
      const invalidLocationData = {
        country_name: 'Test Country',
        city: 'Test City',
        latitude: -95, // Invalid latitude (< -90)
        longitude: 200, // Invalid longitude (> 180)
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidLocationData,
      });

      const result = await getLocation();

      expect(result).toBeUndefined();
    });

    it('should handle NaN coordinates', async () => {
      const nanLocationData = {
        country_name: 'Test Country',
        city: 'Test City',
        latitude: NaN,
        longitude: NaN,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => nanLocationData,
      });

      const result = await getLocation();

      expect(result).toBeUndefined();
    });
  });
});
