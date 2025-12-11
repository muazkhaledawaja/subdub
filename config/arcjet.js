import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY, NODE_ENV } from "./env.js";

const rules = [
  shield({ mode: "LIVE" }),
  tokenBucket({
    mode: "LIVE",
    refillRate: 5,
    interval: 10,
    capacity: 10,
  }),
];

// Only add bot detection in production
if (NODE_ENV === "production") {
  rules.push(
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
      ],
    })
  );
}

const aj = arcjet({
  key: ARCJET_KEY,
  rules,
});

export default aj;