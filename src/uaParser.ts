/**
 * User Agent Parser Module
 *
 * This module provides utilities for parsing user agent strings to extract
 * browser information, operating system platform, and device type.
 */

/**
 * Detects the operating system platform from user agent string
 * @param userAgent - The user agent string to parse
 * @returns The detected platform name
 */
function detectPlatform(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  // Platform detection patterns - ordered by specificity (most specific first)
  const platforms = [
    { pattern: /windows nt 10/, name: "Windows 10/11" },
    { pattern: /windows nt 6\.3/, name: "Windows 8.1" },
    { pattern: /windows nt 6\.2/, name: "Windows 8" },
    { pattern: /windows nt 6\.1/, name: "Windows 7" },
    { pattern: /windows/, name: "Windows" },
    { pattern: /iphone|ipod/, name: "iOS" },
    { pattern: /ipad/, name: "iPadOS" },
    { pattern: /macintosh|mac os x/, name: "macOS" },
    { pattern: /android/, name: "Android" },
    { pattern: /ubuntu/, name: "Ubuntu" },
    { pattern: /debian/, name: "Debian" },
    { pattern: /fedora/, name: "Fedora" },
    { pattern: /centos/, name: "CentOS" },
    { pattern: /linux/, name: "Linux" },
    { pattern: /chromeos/, name: "Chrome OS" },
    { pattern: /freebsd/, name: "FreeBSD" },
    { pattern: /openbsd/, name: "OpenBSD" },
    { pattern: /netbsd/, name: "NetBSD" },
    { pattern: /sunos/, name: "Solaris" },
  ];

  // Find the first matching platform
  for (const platform of platforms) {
    if (platform.pattern.test(ua)) {
      return platform.name;
    }
  }

  return "Unknown";
}

/**
 * Detects the browser from user agent string
 * @param userAgent - The user agent string to parse
 * @returns The detected browser name
 */
function detectBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  // Browser detection patterns - ordered by specificity
  // Note: Order matters! Chrome must come after Edge/Edg since Chrome appears in Edge UA
  const browsers = [
    { pattern: /edg\//i, name: "Edge" }, // Modern Edge (Chromium-based)
    { pattern: /edge\//i, name: "Edge Legacy" }, // Legacy Edge
    { pattern: /opr\//i, name: "Opera" }, // Opera
    { pattern: /brave\//i, name: "Brave" }, // Brave browser
    { pattern: /vivaldi\//i, name: "Vivaldi" }, // Vivaldi
    { pattern: /chrome\//i, name: "Chrome" }, // Chrome (must come after other Chromium browsers)
    { pattern: /firefox\//i, name: "Firefox" }, // Firefox
    { pattern: /safari\//i, name: "Safari" }, // Safari (but not Chrome/Chromium)
    { pattern: /msie|trident/i, name: "Internet Explorer" }, // IE
    { pattern: /samsung/i, name: "Samsung Internet" }, // Samsung Internet
    { pattern: /ucbrowser/i, name: "UC Browser" }, // UC Browser
  ];

  // Special case for Safari: exclude if Chrome is also present
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    return "Safari";
  }

  // Find the first matching browser
  for (const browser of browsers) {
    if (browser.pattern.test(ua)) {
      return browser.name;
    }
  }

  return "Unknown";
}

/**
 * Detects the device type from user agent string
 * @param userAgent - The user agent string to parse
 * @returns The detected device type (mobile, tablet, or desktop)
 */
function detectDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  // Check for tablet first (more specific)
  if (/ipad|tablet|kindle|playbook|silk/i.test(ua)) {
    return "tablet";
  }

  // Check for mobile devices
  if (
    /mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(
      ua
    )
  ) {
    return "mobile";
  }

  // Default to desktop
  return "desktop";
}

/**
 * Parses the user agent string to extract browser, platform, and device information
 * @returns Object containing parsed user agent information
 */
export function parseUserAgent() {
  const ua = navigator.userAgent;

  // Extract all information using dedicated detection functions
  const platform = detectPlatform(ua);
  const browser = detectBrowser(ua);
  const deviceType = detectDeviceType(ua);

  return {
    /** The original user agent string */
    userAgent: ua,
    /** Detected operating system platform */
    platform,
    /** Detected browser name */
    browser,
    /** Detected device type (mobile, tablet, desktop) */
    deviceType,
  };
}
