# 🧠 client-metadata

A lightweight TypeScript library for collecting client-side metadata in the browser — including browser info, device type, platform, geolocation, and more. Ideal for frontend logging, analytics, fraud detection, and user personalization.

[![npm version](https://img.shields.io/npm/v/client-metadata?color=blue)](https://www.npmjs.com/package/client-metadata)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## ✨ Features

- 📱 **Device Detection**: Automatically detects device type (mobile, tablet, desktop)
- 🌍 **IP Geolocation**: Fetches approximate location data including IP, country, city, and coordinates
- 🔍 **Browser Fingerprinting**: Generates unique browser fingerprints for device identification
- 🧠 **Browser Intelligence**: Extracts detailed browser and platform info from user agent
- ⚡ **Fast & Lightweight**: Optimized for performance with minimal bundle size
- �️ **Privacy-Focused**: Uses IP-based geolocation, no GPS access required
- 📦 **Easy Integration**: Simple API with TypeScript support
- ✅ **Fully Typed**: Complete TypeScript definitions and tree-shakeable

---

## 📦 Installation

```bash
npm install client-metadata
```

## 🚀 Usage

### Basic Usage

```typescript
import { getClientMetadata } from "client-metadata";

async function collectUserData() {
  const metadata = await getClientMetadata();
  console.log(metadata);
}
```

### React Hook

```typescript
import { useClientMetadata } from "client-metadata";

function MyComponent() {
  const { metadata, loading, error } = useClientMetadata();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <p>Browser: {metadata?.browser}</p>
      <p>Platform: {metadata?.platform}</p>
      <p>Device: {metadata?.deviceType}</p>
      {metadata?.location && (
        <p>Location: {metadata.location.city}, {metadata.location.country}</p>
      )}
    </div>
  );
}
```

## 📋 Example Output

```json
{
  "ipAddress": "", // Populated by backend
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...",
  "browser": "Chrome",
  "platform": "macOS", 
  "deviceType": "desktop",
  "fingerprint": "a1b2c3d4e5f6...", // Optional browser fingerprint
  "location": { // Optional location data
    "country": "Luxembourg",
    "city": "Belval",
    "latitude": 49.5042,
    "longitude": 5.9481
  }
}
```

## 🔧 API Reference

### `getClientMetadata()`

Collects comprehensive client-side metadata including browser info, device type, platform, fingerprint, and optional location data.

**Returns:** `Promise<ClientMetadata>`

### `useClientMetadata()` (React Hook)

React hook for collecting client metadata with loading and error states.

**Returns:** 
```typescript
{
  metadata: ClientMetadata | null;
  loading: boolean;
  error: Error | null;
}
```

### Individual Functions

You can also import individual functions for specific data:

```typescript
import { 
  parseUserAgent,
  getFingerprint,
  getLocation,
  isLocationServiceAvailable
} from "client-metadata";

// Get just user agent info
const uaInfo = parseUserAgent();

// Get browser fingerprint
const fingerprint = getFingerprint();

// Get location data (with IP)
const location = await getLocation();

// Check if location services are available
const available = isLocationServiceAvailable();
```

## 📊 Type Definitions

### `ClientMetadata`

```typescript
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
  location?: {
    country: string;
    city: string;
    latitude?: number;
    longitude?: number;
  };
}
```

### `LocationData`

```typescript
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
```

## ⚙️ Configuration

### Location Services

The library automatically detects location using IP-based geolocation services with fallback providers:

- **Primary**: ipapi.co (HTTPS)
- **Fallback**: ip-api.com 

Location detection includes:
- ⏱️ 5-second timeout per provider
- 🔄 Automatic fallback between providers
- ✅ Data validation and error handling
- 🌐 Works on HTTP and HTTPS sites

### Privacy & Security

- 🔒 **No GPS access**: Uses only IP-based geolocation
- 🛡️ **Privacy-first**: No personal data collection
- ⚡ **Non-blocking**: All operations are asynchronous
- 🎯 **Accurate**: Multiple provider fallbacks ensure reliability

## 🚀 Browser Support

- ✅ **Modern Browsers**: Chrome, Firefox, Safari, Edge
- ✅ **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- ✅ **Node.js**: Server-side rendering compatible (with limitations)

## 📈 Use Cases

- 🔍 **Analytics & Tracking**: Enhanced user analytics with device insights
- 🛡️ **Fraud Detection**: Device fingerprinting for security
- 🎯 **Personalization**: Customized user experiences based on device/location
- 📊 **A/B Testing**: Segment users by device type, browser, or location
- 🖥️ **Responsive Design**: Dynamic UI adjustments based on device capabilities

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/StefanPenchev05/client-metadata.git

# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build

# Watch mode for development
npm run dev
```

## 🧪 Testing

The library includes comprehensive tests covering:

- ✅ All device types and platforms
- ✅ Browser detection across major browsers
- ✅ Location service fallbacks and error handling
- ✅ Fingerprinting with various configurations
- ✅ TypeScript type safety

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

© 2025 Stefan Penchev


