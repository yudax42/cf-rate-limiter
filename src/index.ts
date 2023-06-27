import {
  ACTION_PER_SECONDS,
  GRACE_PERIOD,
  RATE_LIMITED_MESSAGE,
} from "./constants";

export interface Env {
  limiter: DurableObjectNamespace;
}

export class RateLimiter {
  next_allowed_time: number;

  constructor(state: DurableObjectState, env: Env) {
    this.next_allowed_time = 0;
  }

  private get_cooldown(now: number) {
    return Math.max(0, this.next_allowed_time - now - GRACE_PERIOD);
  }

  async fetch(request: Request) {
    let now = Date.now() / 1000;

    this.next_allowed_time = Math.max(now, this.next_allowed_time);

    if (request.method == "POST") {
      this.next_allowed_time += ACTION_PER_SECONDS;
    }

    const cooldown = this.get_cooldown(now);

    return new Response(cooldown.toString());
  }
}

class RateLimitHandler {
  limiter: DurableObjectStub;
  in_cooldown: boolean;
  constructor(limiterStub: DurableObjectStub) {
    this.limiter = limiterStub;
    this.in_cooldown = false;
  }

  private async call_limiter() {
    try {
      let response = await this.limiter.fetch("https://ratelimiter", {
        method: "POST",
      });
      let cooldown = +(await response.text());

      this.in_cooldown = cooldown > 0;
    } catch (err: unknown) {}
  }

  public async check_limit() {
    await this.call_limiter();

    return !this.in_cooldown;
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const ip = request.headers.get("CF-Connecting-IP");

    const limiter_id = env.limiter.idFromName(ip!);
    const limiter_stub = env.limiter.get(limiter_id);
    const limiter = new RateLimitHandler(limiter_stub);

    const check_limit = await limiter.check_limit();

    if (!check_limit) {
      return new Response(RATE_LIMITED_MESSAGE, { status: 429 });
    }

    // Do the actual work.
    return new Response(
      JSON.stringify({
        "SUCCESS": true,
      })
    );
  },
};
