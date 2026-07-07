import pino from "pino";

// Configure pino for structured JSON logging.
// In development, you might want to pipe this to pino-pretty,
// but in production (Vercel/Datadog/etc.), pure JSON is preferred.
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: {
    env: process.env.NODE_ENV,
    service: "couponhub-engine"
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
