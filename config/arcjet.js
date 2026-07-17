import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY, NODE_ENV, ALLOWED_IPS } from './env.js';

const allowedIps = ALLOWED_IPS ? ALLOWED_IPS.split(',') : [];

const aj = arcjet({
    key: ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: NODE_ENV === 'production' ? 'LIVE' : 'DRY_RUN',
            allow: [
                "CATEGORY:SEARCH_ENGINE",
            ],
        }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10,
        }),
    ],
});

export const isAllowedIp = (ip) => allowedIps.includes(ip);

export default aj;