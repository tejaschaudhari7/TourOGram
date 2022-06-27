const appError = require('../utilities/expressErrors');
const {destinationSchema,reviewSchema} = require('../validator');
const Destination = require('../models/destination')
const Review = require('../models/review')

module.exports.isLoggedIn = (req,res,next) => {
    //console.log(req.user)
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo)
        req.flash('error','Please login first');
        return res.redirect('/login');
    }
    next();
}
 
module.exports.validator = (req,res,next) => {
    const {error} = destinationSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new appError(msg,400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req,res,next) => {
    const {id} = req.params;
    const destination = await Destination.findById(id);
    //const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    if(!destination.author.equals(req.user._id)) {
        req.flash('error','Invalid Access')
        return res.redirect(`/destinations/${id}`)
    }
    next();
}

module.exports.isAuthor_review = async (req,res,next) => {
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error','Invalid Access')
        return res.redirect(`/destinations/${id}`)
    }
    next();
}

module.exports.validator_review = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new appError(msg, 400)
    } else {
        next();
    }
}