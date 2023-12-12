import z from "zod"

const BaseCheckRequest = z.object({
    actions: z.number().min(1).max(1000),
    interval: z.number().min(10).max(1440),
})

export interface Env {
    limiter: DurableObjectNamespace
}

interface Bucket {
    tokens: number
    size: number
    last_refill_at: number
}

const SECONDS = 1000

export class TokenBucket {
    state: DurableObjectState;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
    }

    private async init(bucketSize: number, refillRate: number) : Promise<Bucket>{
        const bucket = await this.state.storage.get('bucket') as Bucket | null

        const initBucket = {
            tokens: bucketSize,
            size: bucketSize,
            last_refill_at: Date.now()
        }

        if(!bucket)
            await this.state.storage.put('bucket', initBucket)
        
        const refiller = await this.state.storage.getAlarm()

        if(!refiller)
            await this.state.storage.setAlarm(Date.now() + refillRate * SECONDS)

        
        return bucket ? bucket : initBucket
    }

    private async check(request: Request){
        const body = await request.json()

        const data = BaseCheckRequest.parse(body)

        const bucket = await this.init(data.actions, data.interval)

        if(bucket.tokens == 0)
            return new Response(null, { status: 429 })

        const newBucket: Bucket = {
            tokens: bucket.tokens--,
            size: bucket.size,
            last_refill_at: Date.now()
        }
        
        await this.state.storage.put('bucket', newBucket)

        return new Response(null, { status: 200 });

    }

    async fetch(request: Request) {
        if(request.method == 'POST'){
            const url = new URL(request.url);

            switch(url.pathname){
                case '/check': 
                    return this.check(request);
            }

        }

    }

    async alarm() {
        const bucket = await this.state.storage.get('bucket') as Bucket

        if(bucket)
            await this.state.storage.put('bucket', {
                ...bucket,
                tokens: bucket.size
            })
    }

}