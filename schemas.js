const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title:          Joi.string().required().min(2).max(255),
        price:          Joi.number().required().min(0).max(1000000000),
        image:          Joi.string().required().min(8).max(2048),
        description:    Joi.string().required().min(8).max(2048),
        city:           Joi.string().required().min(8).max(2048),
        state:          Joi.string().required().min(8).max(2048),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating:         Joi.number().required().min(1).max(5).integer(),
        body:           Joi.string().required().min(8).max(2048),
    }).required()
})