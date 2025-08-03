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
 * Custom React hook for collecting client-side metadata
 * 
 * This hook automatically collects client metadata when the component mounts
 * and provides both the metadata and loading state for React components.
 * 
 * @returns Object containing metadata and loading state
 * @returns {ClientMetadata | null} metadata - The collected client metadata or null if not yet loaded
 * @returns {boolean} loading - Whether the metadata collection is still in progress
 * 
 * @example
 * ```typescript
 * import { useClientMetadata } from '@stefan-tools/client-metadata/react';
 * 
 * function MyComponent() {
 *   const { metadata, loading } = useClientMetadata();
 * 
 *   if (loading) {
 *     return <div>Loading metadata...</div>;
 *   }
 * 
 *   return (
 *     <div>
 *       <p>Browser: {metadata?.browser}</p>
 *       <p>Platform: {metadata?.platform}</p>
 *       <p>Device: {metadata?.deviceType}</p>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Metadata collection runs only once when the component mounts
 * - The hook handles errors gracefully and will keep loading state as false
 * - Consider the privacy implications when using client metadata collection
 * - Some browsers may block or randomize certain metadata collection attempts
 */
export function useClientMetadata() {
  /** State to store the collected client metadata */
  const [metadata, setMetadata] = useState<ClientMetadata | null>(null);
  
  /** State to track whether metadata collection is in progress */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Collect client metadata asynchronously when component mounts
     * This runs only once due to the empty dependency array
     */
    collectMetadata()
      .then((data) => {
        // Successfully collected metadata
        setMetadata(data);
        setLoading(false);
      })
      .catch((error) => {
        // Handle collection errors gracefully
        console.warn("Failed to collect client metadata:", error);
        setMetadata(null);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  return { 
    /** The collected client metadata (null until loaded) */
    metadata, 
    /** Whether metadata collection is still in progress */
    loading 
  };
}
