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
 * @returns Promise that resolves to a ClientMetadata object containing all collected information
 *
 * @example
 * ```typescript
 * const metadata = await collectMetadata();
 * console.log(metadata.browser); // "Chrome"
 * console.log(metadata.platform); // "macOS"
 * console.log(metadata.deviceType); // "desktop"
 * console.log(metadata.fingerprint); // "a1b2c3d4e5f6..."
 * ```
 */
export async function collectMetadata(): Promise<ClientMetadata> {
  // Parse user agent to extract browser, platform, and device information
  const uaInfo = parseUserAgent();

  // Try to get location data
  const locationData = await getLocation();

  // Generate browser fingerprint for device identification
  // This is wrapped in try-catch to handle potential fingerprinting restrictions
  let fingerprint: string | undefined;
  try {
    fingerprint = getFingerprint();
  } catch (error) {
    // Log warning but don't fail the entire metadata collection
    console.warn("Failed to generate fingerprint:", error);
    fingerprint = undefined;
  }

  // Construct the complete metadata object
  const metadata: ClientMetadata = {
    ...uaInfo, // Spreads: userAgent, browser, platform, deviceType
    ipAddress: locationData ? locationData.ip : "", // Will be populated by backend service
    ...(fingerprint && { fingerprint }),
    ...(locationData && {
      location: {
        country: locationData.country,
        city: locationData.city,
        ...(locationData.latitude !== undefined && {
          latitude: locationData.latitude,
        }),
        ...(locationData.longitude !== undefined && {
          longitude: locationData.longitude,
        }),
      },
    }),
  };

  return metadata;
}
