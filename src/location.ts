/**
 * Geolocation Module
 * 
 * This module provides functionality for obtaining location information
 * based on IP address using external geolocation services. It includes
 * fallback mechanisms and error handling for reliable location detection.
 */

import type { LocationData } from "./types.js";

/**
 * Configuration for geolocation service providers
 */
interface LocationProvider {
  name: string;
  url: string;
  parser: (data: any) => LocationData;
}

const LOCATION_PROVIDERS: LocationProvider[] = [
  {
    name: 'ipapi.co',
    url: 'https://ipapi.co/json/',
    parser: (data: any): LocationData => ({
      country: data.country_name || data.country,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
    }),
  },
  {
    name: 'ip-api.com',
    url: 'http://ip-api.com/json/',
    parser: (data: any): LocationData => ({
      country: data.country,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
    }),
  },
];

/**
 * Request timeout configuration (in milliseconds)
 */
const REQUEST_TIMEOUT = 5000; // 5 seconds

/**
 * Fetches location data from a specific provider with timeout
 * 
 * @param provider - The location provider configuration
 * @returns Promise that resolves to location data or undefined if failed
 */
async function fetchFromProvider(provider: LocationProvider): Promise<LocationData | undefined> {
  try {
    // Create an AbortController for request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(provider.url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ClientMetadata/1.0',
      },
    });

    // Clear the timeout since the request completed
    clearTimeout(timeoutId);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate that we received the expected data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response data format');
    }

    // Parse the data using the provider's parser
    const locationData = provider.parser(data);

    // Validate that required fields are present
    if (!locationData.country || !locationData.city) {
      throw new Error('Missing required location fields');
    }

    return locationData;

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn(`Location request to ${provider.name} timed out after ${REQUEST_TIMEOUT}ms`);
      } else {
        console.warn(`Failed to fetch location from ${provider.name}:`, error.message);
      }
    } else {
      console.warn(`Unknown error fetching location from ${provider.name}:`, error);
    }
    return undefined;
  }
}

/**
 * Validates location data to ensure it contains valid coordinates
 * 
 * @param location - The location data to validate
 * @returns True if the location data is valid, false otherwise
 */
function validateLocationData(location: LocationData): boolean {
  // Check for required string fields
  if (!location.country || !location.city) {
    return false;
  }

  // Check for valid coordinates (if provided)
  if (location.latitude !== undefined || location.longitude !== undefined) {
    if (
      typeof location.latitude !== 'number' ||
      typeof location.longitude !== 'number' ||
      isNaN(location.latitude) ||
      isNaN(location.longitude) ||
      location.latitude < -90 ||
      location.latitude > 90 ||
      location.longitude < -180 ||
      location.longitude > 180
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Retrieves the user's approximate location based on their IP address
 * 
 * This function attempts to determine the user's location using multiple
 * geolocation service providers with fallback mechanisms for reliability.
 * 
 * @returns Promise that resolves to location data or undefined if unavailable
 * 
 * @example
 * ```typescript
 * const location = await getLocation();
 * if (location) {
 *   console.log(`User is in ${location.city}, ${location.country}`);
 *   if (location.latitude && location.longitude) {
 *     console.log(`Coordinates: ${location.latitude}, ${location.longitude}`);
 *   }
 * }
 * ```
 * 
 * @remarks
 * - Uses IP-based geolocation which provides approximate location only
 * - Tries multiple providers for better reliability
 * - Respects user privacy by not accessing browser geolocation APIs
 * - May not work in environments without internet access
 * - Some corporate networks or VPNs may affect accuracy
 */
export async function getLocation(): Promise<LocationData | undefined> {
  // Try each provider in sequence until one succeeds
  for (const provider of LOCATION_PROVIDERS) {
    const locationData = await fetchFromProvider(provider);
    
    if (locationData && validateLocationData(locationData)) {
      console.log(`Successfully retrieved location from ${provider.name}`);
      return locationData;
    }
    
    // If locationData is undefined, fetchFromProvider already logged the error
    // Continue to the next provider
  }

  // If all providers fail, log a final warning
  console.warn('All location providers failed. Location data unavailable.');
  return undefined;
}

/**
 * Retrieves location with a custom timeout
 * 
 * @param timeoutMs - Custom timeout in milliseconds
 * @returns Promise that resolves to location data or undefined
 */
export async function getLocationWithTimeout(timeoutMs: number): Promise<LocationData | undefined> {
  return Promise.race([
    getLocation(),
    new Promise<undefined>((resolve) => {
      setTimeout(() => {
        console.warn(`Location request timed out after ${timeoutMs}ms`);
        resolve(undefined);
      }, timeoutMs);
    }),
  ]);
}

/**
 * Checks if location services are likely to work in the current environment
 * 
 * @returns True if location services should work, false otherwise
 */
export function isLocationServiceAvailable(): boolean {
  // Check if we're in a browser environment with fetch support
  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    return false;
  }

  // Check if we're on a secure context (required for some APIs)
  if (window.location && !window.location.protocol.startsWith('https:') && window.location.hostname !== 'localhost') {
    console.warn('Location services may not work reliably on non-HTTPS sites');
  }

  return true;
}
