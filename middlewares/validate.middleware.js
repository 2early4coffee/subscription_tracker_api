export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        const messages = error.errors.map((e) => e.message);
        const err = new Error(messages.join(', '));
        err.statusCode = 400;
        next(err);
    }
};