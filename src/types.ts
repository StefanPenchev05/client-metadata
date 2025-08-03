export interface LocationData {
  /** The IP address used for geolocation */
  ip: string;

  /** Country name */
  country: string;

  /** City name */
  city: string;

  /** Latitude coordinate */
  latitude?: number;

  /** Longitude coordinate */
  longitude?: number;
}

/**
 * Client metadata interface containing browser, device, and location information
 */
export interface ClientMetadata {
  /** The client's IP address (typically filled by backend) */
  ipAddress: string;

  /** Full user agent string from the browser */
  userAgent: string;

  /** Detected browser name (e.g., "Chrome", "Firefox", "Safari") */
  browser: string;

  /** Operating system platform (e.g., "macOS", "Windows", "Linux") */
  platform: string;

  /** Device type classification (e.g., "desktop", "mobile", "tablet") */
  deviceType: string;

  /** Optional unique device fingerprint for identification */
  fingerprint?: string;

  /** Optional location information based on IP geolocation */
  location?: Omit<LocationData, "ip">;
}
