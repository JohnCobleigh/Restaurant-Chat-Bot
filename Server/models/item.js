const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const itemSchema = new mongoose.Schema({
    _id: ObjectId,
    name: String,
    calories: Number,
    description: String,
    ingredients: [String],
    price: Number
});

const MainPlate = mongoose.models.MainPlate || mongoose.model('MainPlate', itemSchema, 'main_plates');
const Margarita = mongoose.models.Margarita || mongoose.model('Margarita', itemSchema, 'margaritas');
const Martini = mongoose.models.Martini || mongoose.model('Martini', itemSchema, 'martinis');
const Mocktail = mongoose.models.Mocktail || mongoose.model('Mocktail', itemSchema, 'mocktails');
const Pasta = mongoose.models.Pasta || mongoose.model('Pasta', itemSchema, 'pastas');
const Pizza = mongoose.models.Pizza || mongoose.model('Pizza', itemSchema, 'pizzas');
const Salad = mongoose.models.Salad || mongoose.model('Salad', itemSchema, 'salads');
const Sangria = mongoose.models.Sangria || mongoose.model('Sangria', itemSchema, 'sangrias');
const Cocktail = mongoose.models.Cocktail || mongoose.model('Cocktail', itemSchema, 'signature_cocktails');
const Starter = mongoose.models.Starter || mongoose.model('Starter', itemSchema, 'starters');
const Dessert = mongoose.models.Dessert || mongoose.model('Dessert', itemSchema, 'sweet_treats');

// Need to update sweet_treats collection in MongoDB with ingredients array

module.exports = { MainPlate, Margarita, Martini, Mocktail, Pasta, Pizza, Salad, Sangria, Cocktail, Starter, Dessert };