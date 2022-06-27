const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const imageSchema = new Schema({
    url : String,
    filename : String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload','/upload/w_200,h_200');
})

const opts = {toJSON : {virtuals : true}};

const DestinationSchema = new Schema({
    title : String,
    image: [imageSchema],
    description : String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    location : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },

    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
},opts)

DestinationSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a style="text-decoration: none;" href="/destinations/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,20)}...</p>`
})

DestinationSchema.post('findOneAndDelete',async function (doc) {
    //console.log('deleted');
    //console.log(doc);
    if(doc) {
        await Review.deleteMany({
            _id : {
                $in : doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('destination',DestinationSchema);