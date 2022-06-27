const Joi = require('joi');
module.exports.destinationSchema = Joi.object({
    destination:Joi.object({
        title: Joi.string().required(),
        //image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
    locationGeometry : Joi.object(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})
