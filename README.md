# 🧠 client-metadata

A lightweight TypeScript library for collecting client-side metadata in the browser — including browser info, device type, platform, geolocation, and more. Ideal for frontend logging, analytics, fraud detection, and user personalization.

[![npm version](https://img.shields.io/npm/v/@stefan-tools/client-metadata?color=blue)](https://www.npmjs.com/package/@stefan-tools/client-metadata)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## ✨ Features

- 📱 Detects device type (mobile, tablet, desktop)
- 🌍 Fetches approximate location (country, city, lat/lon)
- 🧠 Extracts browser and platform info from `navigator`
- 📦 Easy to use in any JavaScript or TypeScript frontend
- ✅ Fully typed and tree-shakeable

---

## 📦 Installation

```bash
npm install @stefan-tools/client-metadata
```

## 🚀 Usage

```ts
import { getClientMetadata } from "@stefan-tools/client-metadata";

getClientMetadata().then((metadata) => {
  console.log(metadata);
});
```

## Exmaple Output
```json
{
  ipAddress: "", // can be filled by backend
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X...)",
  browser: "Chrome",
  platform: "macOS",
  deviceType: "desktop",
  location: {
    country: "Luxembourg",
    city: "Belval",
    latitude: 49.5042,
    longitude: 5.9481
  }
}
```

## 🧠 Interface
```ts
export interface ClientMetadata {
  ipAddress: string;
  userAgent: string;
  browser: string;
  platform: string;
  deviceType: string;
  fingerprint?: string;
  location?: {
    country: string;
    city: string;
    latitude?: number;
    longitude?: number;
  };
}
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

© 2025 Stefan Penchev


