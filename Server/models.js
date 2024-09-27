const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
    name: String,
    calories: Number,
    description: String,
    ingredients: [String],
    price: Number
});

const Pizza = mongoose.model('Pizzas', pizzaSchema);

module.exports = { Pizza };
