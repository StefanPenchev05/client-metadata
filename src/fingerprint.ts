/**
 * Browser Fingerprinting Module
 * 
 * This module provides functionality to generate unique browser fingerprints
 * for device identification and tracking purposes. The fingerprint is based
 * on various browser and system characteristics that remain relatively stable.
 */

/**
 * Generates a unique browser fingerprint based on device and browser characteristics
 * 
 * @param comprehensive - If true, uses more comprehensive fingerprinting (slower)
 * @returns A unique string fingerprint for the current browser/device combination
 */
export function getFingerprint(comprehensive: boolean = false): string {
  try {
    if (comprehensive) {
      return getComprehensiveFingerprint();
    }
    
    return getFastFingerprint();
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fingerprint generation failed: ${error.message}`);
    } else {
      throw new Error('Fingerprint generation failed: Unknown error');
    }
  }
}

/**
 * Generates a fast fingerprint using basic browser characteristics
 */
function getFastFingerprint(): string {
  const characteristics = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.maxTouchPoints || 0,
  ];
  
  return hashCharacteristics(characteristics);
}

/**
 * Generates a comprehensive fingerprint using advanced browser APIs
 */
function getComprehensiveFingerprint(): string {
  const characteristics: (string | number)[] = [
    // Basic characteristics
    ...getBasicCharacteristics(),
    
    // Advanced characteristics
    getCanvasFingerprint(),
    getWebGLFingerprint(),
    getFontFingerprint(),
  ];
  
  return hashCharacteristics(characteristics);
}

/**
 * Gets basic browser characteristics
 */
function getBasicCharacteristics(): (string | number)[] {
  return [
    navigator.userAgent,
    navigator.language,
    navigator.languages?.join(',') || '',
    navigator.platform,
    navigator.cookieEnabled ? 'true' : 'false',
    navigator.doNotTrack || '',
    screen.width,
    screen.height,
    screen.colorDepth,
    screen.pixelDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.maxTouchPoints || 0,
    navigator.vendorSub || '',
    navigator.productSub || '',
  ];
}

/**
 * Generates a canvas fingerprint
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    
    canvas.width = 200;
    canvas.height = 50;
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Canvas fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Canvas fingerprint', 4, 17);
    
    return canvas.toDataURL();
  } catch {
    return 'canvas-error';
  }
}

/**
 * Generates a WebGL fingerprint
 */
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return 'no-webgl';
    
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    if (!info) return 'no-webgl-info';
    
    const vendor = gl.getParameter(info.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(info.UNMASKED_RENDERER_WEBGL);
    
    return `${vendor}~${renderer}`;
  } catch {
    return 'webgl-error';
  }
}

/**
 * Generates a font fingerprint
 */
function getFontFingerprint(): string {
  try {
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const fontList = [
      'Arial', 'Arial Black', 'Arial Narrow', 'Comic Sans MS', 'Courier',
      'Courier New', 'Georgia', 'Helvetica', 'Impact', 'Lucida Console',
      'Times', 'Times New Roman', 'Trebuchet MS', 'Verdana'
    ];
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return 'no-canvas';
    
    context.font = testSize + ' monospace';
    const baseWidth = context.measureText(testString).width;
    
    const availableFonts: string[] = [];
    
    for (const font of fontList) {
      context.font = testSize + ' ' + font + ', monospace';
      const width = context.measureText(testString).width;
      if (width !== baseWidth) {
        availableFonts.push(font);
      }
    }
    
    return availableFonts.join(',');
  } catch {
    return 'font-error';
  }
}

/**
 * Hashes characteristics into a fingerprint string
 */
function hashCharacteristics(characteristics: (string | number)[]): string {
  const fingerprintData = characteristics.join('|');
  
  let hash = 0;
  for (let i = 0; i < fingerprintData.length; i++) {
    const char = fingerprintData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
}
