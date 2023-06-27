/**
 * ACTION_PER_SECONDS: number
 * defines how many actions are allowed per X seconds.
 * @example
 * ACTION_PER_SECONDS = 2 -> we allow 1 action per 2 seconds
 */
export const ACTION_PER_SECONDS =  6;

/**
 * GRACE_PERIOD: number
 * defines how many seconds the client can make requests before being limited. 
 * THE FORMULA IS: GRACE_PERIOD / ACTION_PER_SECONDS = MAX REQUESTS BEFORE BEING LIMITED
 * @example
 * GRACE_PERIOD = 20
 * ACTION_PER_SECONDS = 5
 * MAX REQUESTS BEFORE BEING LIMITED = 20 / 5 = 4 so the client can make 4 requests in burst before being limited
 * 
*/
export const GRACE_PERIOD =  60;

export const RATE_LIMITED_MESSAGE = `You are being rate limited. Please try again later. <br> reason: ${GRACE_PERIOD / ACTION_PER_SECONDS} requests per ${GRACE_PERIOD} second.`;