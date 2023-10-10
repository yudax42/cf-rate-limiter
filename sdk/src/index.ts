interface RateLimiterOptions {
  url: string;
  identifier: string;
  actions: number;
  interval: number;
}

class CFRateLimiter {
  private url: string;
  private identifier: string;
  private actions: number;
  private interval: number;

  constructor(options: RateLimiterOptions) {
    this.url = options.url;
    this.identifier = options.identifier;
    this.actions = options.actions;
    this.interval = options.interval;
  }

  async checkAllowed(): Promise<boolean> {
    const response = await fetch(
      `${this.url}?identifier=${this.identifier}&actions=${this.actions}&interval=${this.interval}`,
      {
        method: "POST",
      }
    );

    return response.status === 200;
  }
}

export { CFRateLimiter }