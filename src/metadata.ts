/**
 * Client Metadata Collection Module
 * 
 * This module provides the main function for collecting comprehensive client-side
 * metadata including browser information, device type, platform details, and more.
 */

import { parseUserAgent } from "./uaParser.js";
import type { ClientMetadata } from "./types.js";

/**
 * Collects comprehensive client-side metadata from the browser environment
 * 
 * This function gathers various pieces of information about the client including:
 * - User agent string and parsed browser information
 * - Operating system platform details
 * - Device type classification (mobile, tablet, desktop)
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
 * ```
 */
export async function collectMetadata(): Promise<ClientMetadata> {
  // Parse user agent to extract browser, platform, and device information
  const uaInfo = parseUserAgent();

  // Construct the complete metadata object
  const metadata: ClientMetadata = {
    ...uaInfo, // Spreads: userAgent, browser, platform, deviceType
    ipAddress: "",
  };

  return metadata;
}
