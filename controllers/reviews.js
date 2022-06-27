const Review = require('../models/review');
const Destination = require('../models/destination')

module.exports.new = async (req,res) => {
    const {id} = req.params;
    const destination = await Destination.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    destination.reviews.push(review);
    await review.save();
    await destination.save();
    req.flash('success','Sucessfully created new review!');
    res.redirect(`/destinations/${id}`);
}

module.exports.delete = async (req,res) => {
    const {id,reviewId} = req.params;
    await Destination.findByIdAndUpdate(id,{ $pull : {reviews : reviewId} })
    await Review.findByIdAndDelete(reviewId);
    //res.send('You got it');s
    req.flash('success','Successfully deleted review!')
    res.redirect(`/destinations/${id}`);
}