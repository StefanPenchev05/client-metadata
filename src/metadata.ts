/**
 * Client Metadata Collection Module
 *
 * This module provides the main function for collecting comprehensive client-side
 * metadata including browser information, device type, platform details, and more.
 */

import { parseUserAgent } from "./uaParser.js";
import { getFingerprint } from "./fingerprint.js";
import type { ClientMetadata } from "./types.js";
import { getLocation } from "./location.js";

/**
 * Collects comprehensive client-side metadata from the browser environment
 *
 * This function gathers various pieces of information about the client including:
 * - User agent string and parsed browser information
 * - Operating system platform details
 * - Device type classification (mobile, tablet, desktop)
 * - Unique browser fingerprint for device identification
 * - Additional metadata that can be collected client-side
 *
 * @param options - Configuration options for metadata collection
 * @param options.includeLocation - Whether to fetch location data (default: false for performance)
 * @param options.includeFingerprint - Whether to generate fingerprint (default: true)
 * @param options.locationTimeout - Timeout for location requests in ms (default: 2000)
 * @returns Promise that resolves to a ClientMetadata object containing all collected information
 *
 * @example
 * ```typescript
 * // Fast collection (no location)
 * const metadata = await collectMetadata();
 * 
 * // With location (slower)
 * const metadata = await collectMetadata({ includeLocation: true });
 * ```
 */
export async function collectMetadata(options: {
  includeLocation?: boolean;
  includeFingerprint?: boolean;
  locationTimeout?: number;
} = {}): Promise<ClientMetadata> {
  const {
    includeLocation = false, // Default to false for performance
    includeFingerprint = true,
    locationTimeout = 2000, // Reduced from 5000ms
  } = options;

  // Parse user agent to extract browser, platform, and device information (fast)
  const uaInfo = parseUserAgent();

  // Run location and fingerprint collection in parallel if needed
  const [locationData, fingerprint] = await Promise.allSettled([
    includeLocation ? getLocation(locationTimeout) : Promise.resolve(null),
    includeFingerprint ? Promise.resolve().then(() => {
      try {
        return getFingerprint(false); // Use fast fingerprint (false = not comprehensive)
      } catch (error) {
        console.warn("Failed to generate fingerprint:", error);
        return undefined;
      }
    }) : Promise.resolve(undefined),
  ]);

  // Extract results from Promise.allSettled
  const location = locationData.status === 'fulfilled' ? locationData.value : null;
  const fp = fingerprint.status === 'fulfilled' ? fingerprint.value : undefined;

  // Construct the complete metadata object
  const metadata: ClientMetadata = {
    ...uaInfo, // Spreads: userAgent, browser, platform, deviceType
    ipAddress: location ? location.ip : "", // Will be populated by backend service
    ...(fp && { fingerprint: fp }),
    ...(location && {
      location: {
        country: location.country,
        city: location.city,
        ...(location.latitude !== undefined && {
          latitude: location.latitude,
        }),
        ...(location.longitude !== undefined && {
          longitude: location.longitude,
        }),
      },
    }),
  };

  return metadata;
}
