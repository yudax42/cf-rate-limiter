# Cloudflare Rate Limiter 
## WIP 🚧

A simple rate limiter implemented using Cloudflare Workers and Durable Objects to protect your web application by limiting the number of requests a client can make within a specified timeframe.

## Installation

```bash
npm install cf-rate-limiter
```

## Usage
```javascript
import { CFRateLimiter } from 'cf-rate-limiter';

const client = new CFRateLimiter({
  url: 'https://domain.com', // Worker URL
  identifier: 'id', // IP, User ID, etc.
  actions: 1, // Number of actions allowed within the interval
  interval: 10, // Interval in seconds
});

async function checkRateLimit() {
  const isAllowed = await client.checkAllowed();
  console.log(isAllowed);  // true or false
}

checkRateLimit();
```