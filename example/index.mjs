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