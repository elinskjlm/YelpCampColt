const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
})
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200,h_300,c_limit');
})

ImageSchema.virtual('micro').get(function() {
    return this.url.replace('/upload', '/upload/w_30,h_20,c_limit');
})

ImageSchema.virtual('show').get(function() {
    return this.url.replace('/upload', '/upload/d_YelpCamp:fallbacks:fallBackImageGemini01_etskbd.jpg/b_black,c_pad,h_300,w_300/');
})

const FeatureSchema = new Schema({
    bbox: { // TODO Should be virtual(??)
        type: [Number],
    },
    geometry: {
        coordinates: {
            type: [Number],
            required: true,
        },
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
    },
    properties: {
        address: Object,
        display_name: String,
        name: String,
    },
})

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    geojson: FeatureSchema,
    city: String,
    state: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
