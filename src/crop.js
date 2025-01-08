const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: String,
    image: String,
    rate: Number,
    quantity: Number
});

module.exports = mongoose.model('Crop', cropSchema);
