# Cloudflare Rate Limiter

A simple rate limiter implemented using Cloudflare Workers and Durable Objects to protect your web application by limiting the number of requests a client can make within a specified timeframe.

## Installation

```bash
npm install cf-rate-limiter
```

## Usage
```javascript
import { RateLimiterClient } from 'your-package-name';

const client = new RateLimiterClient({
  url: 'https://your-rate-limiter-url.com',
  identifier: 'your-identifier', // IP, User ID, etc.
  actions: 10, // Number of actions allowed within the interval
  interval: 60, // Interval in seconds
});

async function checkRateLimit() {
  const isAllowed = await client.checkLimit();
  console.log(isAllowed);  // true or false
}

checkRateLimit();

```