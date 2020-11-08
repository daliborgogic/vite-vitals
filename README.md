# vite-vitals

> Extend Vite with ability to send Core Web Vitals to Google Analytics.

## Install

```bash
$ npm i -D vite-vitals
```

## Setup

```javascript
// vite.config.js
import vitals from 'vite-vitals'

export default {
  plugins:[vitals({
    // Tracking ID (required) { string }
    trackingID: 'UA-XXXXXXXX-X',
    // // Event Category (optional) { string }
    eventCategory: 'Vite Vitals',
    // Debug (optional) { boolean }
    debug: false
  })]
}
```