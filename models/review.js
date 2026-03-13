// Import
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const reviewSchema = new Schema(
    {
        body: String,
        rating: Number,
        author: {type: Schema.Types.ObjectId, ref: 'User'}
    });

// Export Model
module.exports = mongoose.model('Review', reviewSchema);