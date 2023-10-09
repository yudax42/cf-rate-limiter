
export const ACTION_PER_INTERVAL = 10;
export const INTERVAL_DURATION_SEC =  60;

export const RATE_LIMITED_MESSAGE = `You are being rate limited. Please try again later. <br> reason: ${ACTION_PER_INTERVAL} actions per ${INTERVAL_DURATION_SEC} seconds.`;