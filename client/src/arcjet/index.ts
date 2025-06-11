import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
  validateEmail,
} from "@arcjet/next";

export const protectSignUpRules = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    protectSignup({
      email: {
        mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: {
        mode: "LIVE",
        allow: [], // "allow none" will block all detected bots
      },
      rateLimit: {
        mode: "LIVE",
        interval: "1m",
        max: 5,
      },
    }),
  ],
});

export const protectSignInRules = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    validateEmail({
      mode: "LIVE",
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
    fixedWindow({
      mode: "LIVE",
      window: "60s",
      max: 3,
    }),
  ],
});

export const createNewProductRules = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    fixedWindow({
      mode: "LIVE",
      window: "300s", // 60 second fixed window
      max: 10, // allow a maximum of 100 requests
    }),
    shield({
      mode: "LIVE",
    }),
  ],
});

export const createCouponRules = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    fixedWindow({
      mode: "LIVE",
      window: "300s",
      max: 5,
    }),
    shield({
      mode: "LIVE",
    }),
    sensitiveInfo({
      mode: "LIVE",
      deny: ["EMAIL", "CREDIT_CARD_NUMBER", "PHONE_NUMBER"],
    }),
  ],
});

export const prePaymentFlowRules = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    validateEmail({
      mode: "LIVE",
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS", "FREE"],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: "10m",
      max: 5,
    }),
  ],
});
