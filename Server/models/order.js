const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    names: [String],
    calories: [Number],
    modifiers: [String],
    prices: [Number]
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema, 'orders');

module.exports = { Order };