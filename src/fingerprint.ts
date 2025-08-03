/**
 * Browser Fingerprinting Module
 * 
 * This module provides functionality to generate unique browser fingerprints
 * for device identification and tracking purposes. The fingerprint is based
 * on various browser and system characteristics that remain relatively stable.
 */

import { ClientJS } from "clientjs";

/**
 * Generates a unique browser fingerprint based on device and browser characteristics
 * 
 * The fingerprint is created by combining various browser properties including:
 * - Screen resolution and color depth
 * - Browser plugins and their versions
 * - Timezone and language settings
 * - Canvas and WebGL rendering capabilities
 * - Audio context fingerprinting
 * - System fonts available
 * - User agent and platform details
 * 
 * @returns A unique string fingerprint for the current browser/device combination
 * 
 * @throws Will throw an error if fingerprinting fails due to browser restrictions
 * 
 * @example
 * ```typescript
 * try {
 *   const fingerprint = getFingerprint();
 *   console.log(fingerprint); // "1234567890abcdef"
 * } catch (error) {
 *   console.warn("Fingerprinting failed:", error);
 * }
 * ```
 * 
 * @remarks
 * - Fingerprints should be considered semi-permanent (may change with browser updates)
 * - Some privacy-focused browsers may block or randomize fingerprinting attempts
 * - Consider user privacy implications when using fingerprinting technology
 */
export function getFingerprint(): string {
  try {
    // Initialize the ClientJS library for browser fingerprinting
    const client = new ClientJS();
    
    // Generate the fingerprint using ClientJS's comprehensive algorithm
    // This combines multiple browser characteristics into a unique hash
    const fingerprint = client.getFingerprint();
    
    // Ensure we return a string representation
    const fingerprintString = fingerprint.toString();
    
    // Validate that we got a meaningful fingerprint
    if (!fingerprintString || fingerprintString.length === 0) {
      throw new Error("Generated fingerprint is empty");
    }
    
    return fingerprintString;
    
  } catch (error) {
    // Log the error for debugging purposes
    console.warn("Browser fingerprinting failed:", error);
    
    // Return a fallback fingerprint based on basic browser info
    // This ensures the function always returns a value, even if advanced fingerprinting fails
    return generateFallbackFingerprint();
  }
}

/**
 * Generates a basic fallback fingerprint when advanced fingerprinting fails
 * 
 * This uses only basic browser properties that are always available
 * and don't require special permissions or advanced APIs.
 * 
 * @returns A basic fingerprint string
 */
function generateFallbackFingerprint(): string {
  try {
    // Combine basic browser properties for a simple fingerprint
    const components = [
      navigator.userAgent || "unknown",
      navigator.language || "unknown",
      screen.width || 0,
      screen.height || 0,
      screen.colorDepth || 0,
      new Date().getTimezoneOffset(),
      // Use modern userAgentData if available, otherwise skip platform info
      (navigator as any).userAgentData?.platform || "unknown-platform",
    ];
    
    // Create a simple hash from the components
    const combined = components.join("|");
    let hash = 0;
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Return the hash as a positive hexadecimal string
    return Math.abs(hash).toString(16);
    
  } catch (error) {
    // Last resort: return a timestamp-based identifier
    console.warn("Fallback fingerprinting also failed:", error);
    return `fallback_${Date.now().toString(16)}`;
  }
}
