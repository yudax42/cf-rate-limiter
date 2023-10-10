import {
  ACTION_PER_INTERVAL,
  INTERVAL_DURATION_SEC,
  RATE_LIMITED_MESSAGE,
} from "./constants";
import { Reply } from "./helpers";

export interface Env {
  limiter: DurableObjectNamespace;
}

interface Box {
  tokens: number;
  lastRefillTime: number;
}

interface CheckLimitParams {
  actions: number;
  interval: number;
}

export class RateLimiter {
  state: DurableObjectState;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
  }

  async fetch(request: Request) {
    if (request.method == "POST") {
      const body = await request.json();
      const { actions, interval } = body as CheckLimitParams;

      let box = await this.state.storage.get("box") as Box;
      
      if (!box) {
        box = {
          tokens: actions,
          lastRefillTime: Date.now(),
        };

        await this.state.storage.put("box", box);
      }

      let { tokens, lastRefillTime } = box;

      let now = Date.now();
      let timePassed = now - lastRefillTime;

      if (timePassed >= interval * 1000) {
        tokens = actions;
        lastRefillTime = now;

        await this.state.storage.put("box", {
          tokens,
          lastRefillTime,
        });
      }

      if (tokens > 0) {
        tokens -= 1;
        await this.state.storage.put("box", {
          tokens,
          lastRefillTime,
        });

        return new Response(null, { status: 200 });
      } else {
        return new Response(null, { status: 429 });
      }

    }
  }
}

class RateLimitHandler {
  limiter: DurableObjectStub;
  in_cooldown: boolean;

  constructor(limiterStub: DurableObjectStub) {
    this.limiter = limiterStub;
    this.in_cooldown = false;
  }

  private async call_limiter(params: CheckLimitParams) {
    try {
      let response = await this.limiter.fetch("https://ratelimiter", {
        method: "POST",
        body: JSON.stringify(params),
      });

      if (response.status == 429) {
        this.in_cooldown = true;
      } else {
        this.in_cooldown = false;
      }
  
    } catch (err: unknown) {}
  }

  public async check_limit(params: CheckLimitParams) {
    await this.call_limiter(params);

    return !this.in_cooldown;
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {

    if(request.method == "POST") {
      // get the identifier query param
      const url = new URL(request.url);
      const identifier = url.searchParams.get("identifier");
      const actions = url.searchParams.get("actions") || ACTION_PER_INTERVAL
      const interval = url.searchParams.get("interval") || INTERVAL_DURATION_SEC

      if (!identifier) {
        return Reply.json({
          message: "Identifier not provided",
        }, 400);
      }
      
      const limiter_id = env.limiter.idFromName(identifier);
      const limiter_stub = env.limiter.get(limiter_id);
      const limiter = new RateLimitHandler(limiter_stub);

      const check_limit = await limiter.check_limit({
        actions: Number(actions),
        interval: Number(interval),
      });

      if (!check_limit) {
        return Reply.json({
          message: RATE_LIMITED_MESSAGE,
        }, 429, {
          'X-RateLimit-Limit': `${actions} actions per ${interval} seconds`,
        });
      }

      return Reply.json({
        message: 'Action allowed'
      })
    }

    return Reply.json({
      message: "Method not allowed",
    }, 405);
  },
};
