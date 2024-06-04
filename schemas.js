const BaseJoi =         require('joi');
const sanitizeHtml =    require('sanitize-html');

const extention = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value });
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extention);

module.exports.campgroundSchema = Joi.object({
    title:          Joi.string().required().min(2).max(250).escapeHTML(),
    price:          Joi.number().required().min(0).min(1).max(1_000_000),
    geojson:        Joi.object({ // TODO consider using a dedicated schema
        type:           Joi.string().valid('Feature'),
        bbox:           Joi.array().items(Joi.number()).length(4),
        geometry:       Joi.object({
            coordinates:    Joi.array().length(2).required().items(Joi.number()),
            type:           Joi.string().valid('Point'),
        }),
        properties: Joi.object(),
    }).required(),
    images:         Joi.array(), // TODO images validation // TODO consider using fallback, read https://joi.dev/api/?v=17.13.0#anydefaultvalue
    description:    Joi.string().required().min(2).max(500).escapeHTML(),
    city:           Joi.string().required().min(2).max(50).escapeHTML(),
    state:          Joi.string().required().min(2).max(50).escapeHTML(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating:         Joi.number().required().min(1).max(5).integer(),
        body:           Joi.string().required().min(3).max(500).escapeHTML(),
    }).required()
})

module.exports.userSchema = Joi.object({
    user: Joi.object({
        // rating:         Joi.number().required().min(1).max(5).integer(),
        // body:           Joi.string().required().min(3).max(500),
    }).required()
})