const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
    title:          Joi.string().required().min(2).max(255),
    price:          Joi.number().required().min(0).max(1000000000),
    geojson:        Joi.object({ // TODO consider using a dedicated schema
        type:           Joi.string().valid('Feature'),
        bbox:           Joi.array().items(Joi.number()).length(4),
        geometry:       Joi.object({
            coordinates:    Joi.array().length(2).required().items(Joi.number()),
            type:           Joi.string().valid('Point'),
        }),
        properties: Joi.object(),
    }).required(), // TODO geo feature validation
    images:         Joi.array(), // TODO images validation // TODO consider using fallback, read https://joi.dev/api/?v=17.13.0#anydefaultvalue
    description:    Joi.string().required().min(2).max(2048),
    city:           Joi.string().required().min(2).max(2048),
    state:          Joi.string().required().min(2).max(2048),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating:         Joi.number().required().min(1).max(5).integer(),
        body:           Joi.string().required().min(3).max(1024),
    }).required()
})