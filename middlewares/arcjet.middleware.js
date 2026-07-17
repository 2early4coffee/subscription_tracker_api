import aj, { isAllowedIp } from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'];

        if (isAllowedIp(ip)) return next();

        const decision = await aj.protect(req, { requested: 1 });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit())
                return res.status(429).json({
                    message: 'Rate limit exceeded'
                });
            if (decision.reason.isBot())
                return res.status(403).json({
                    error: 'Bot detected'
                });

            return res.status(403).json({ error: 'Access denied' });
        }

        next();
    } catch (error) {
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
};

export default arcjetMiddleware;