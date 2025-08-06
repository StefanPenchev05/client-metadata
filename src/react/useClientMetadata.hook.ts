/**
 * React Hook for Client Metadata Collection
 * 
 * This module provides a React hook for collecting client-side metadata
 * in React applications. It handles the asynchronous collection process
 * and provides loading states for better user experience.
 */

import { useEffect, useState } from "react";
import { collectMetadata } from "../metadata.js";
import type { ClientMetadata } from "../types.js";

/**
 * Configuration options for the useClientMetadata hook
 */
interface UseClientMetadataOptions {
  /** Whether to include location data (slower but more complete) */
  includeLocation?: boolean;
  /** Whether to include browser fingerprint */
  includeFingerprint?: boolean;
  /** Timeout for location requests in milliseconds */
  locationTimeout?: number;
  /** Whether to collect metadata immediately on mount */
  immediate?: boolean;
}

/**
 * Return type for the useClientMetadata hook
 */
interface UseClientMetadataReturn {
  /** The collected client metadata (null until loaded) */
  metadata: ClientMetadata | null;
  /** Whether metadata collection is still in progress */
  loading: boolean;
  /** Error that occurred during collection, if any */
  error: string | null;
  /** Function to manually trigger metadata collection */
  refetch: () => Promise<void>;
}

/**
 * Custom React hook for collecting client-side metadata
 * 
 * This hook automatically collects client metadata when the component mounts
 * and provides both the metadata and loading state for React components.
 * 
 * @param options - Configuration options for metadata collection
 * @returns Object containing metadata, loading state, error, and refetch function
 * 
 * @example
 * ```typescript
 * // Fast collection (no location, immediate)
 * const { metadata, loading } = useClientMetadata();
 * 
 * // Complete collection with location (slower)
 * const { metadata, loading, error } = useClientMetadata({
 *   includeLocation: true,
 *   locationTimeout: 3000
 * });
 * 
 * // Manual collection
 * const { metadata, loading, refetch } = useClientMetadata({
 *   immediate: false
 * });
 * ```
 * 
 * @remarks
 * - By default, location collection is disabled for better performance
 * - Metadata collection runs only once when the component mounts (unless refetch is called)
 * - The hook handles errors gracefully and provides error state
 * - Consider the privacy implications when using client metadata collection
 * - Some browsers may block or randomize certain metadata collection attempts
 */
export function useClientMetadata(options: UseClientMetadataOptions = {}): UseClientMetadataReturn {
  const {
    includeLocation = false, // Default to false for performance
    includeFingerprint = true,
    locationTimeout = 2000, // Faster default timeout
    immediate = true, // Default to immediate collection
  } = options;

  /** State to store the collected client metadata */
  const [metadata, setMetadata] = useState<ClientMetadata | null>(null);
  
  /** State to track whether metadata collection is in progress */
  const [loading, setLoading] = useState(immediate);
  
  /** State to track any errors during collection */
  const [error, setError] = useState<string | null>(null);

  /** Function to collect metadata */
  const collectData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await collectMetadata({
        includeLocation,
        includeFingerprint,
        locationTimeout,
      });
      
      setMetadata(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.warn("Failed to collect client metadata:", err);
      setError(errorMessage);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      collectData();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return { 
    /** The collected client metadata (null until loaded) */
    metadata, 
    /** Whether metadata collection is still in progress */
    loading,
    /** Error that occurred during collection, if any */
    error,
    /** Function to manually trigger metadata collection */
    refetch: collectData,
  };
}
