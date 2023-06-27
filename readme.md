# Cloudflare Rate Limiter

A simple rate limiter implemented using Cloudflare Workers and Durable Objects to protect your web application by limiting the number of requests a client can make within a specified timeframe.

## How to use

1. Install the dependencies:

```
npm install
```

2. Edit the constants in `./constants` to set your desired rate limits, grace period, and rate limited messages:

```javascript
export const ACTION_PER_SECONDS = 1;
export const GRACE_PERIOD = 5;
export const RATE_LIMITED_MESSAGE = "You have exceeded the rate limit. Please wait and try again.";
```

3. Start a local development server:

```
npm run start
```

4. Deploy to Cloudflare Workers:

```
npm run deploy
```