const mongoose = require('mongoose');
const Joi = require('joi');

// DATA VALIDATION
// Defining the Joi Schema for the client input
const customerInputSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().min(3).max(5).required(),
    isGold: Joi.boolean().default(false)
});

// Defining the Mongoose Schema for the Customer Resources (shape of the document)
// matching the Input Schema
const customerSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minlength: 5
    }, // "" and null will not work
    phone: {
        type: String, 
        require: true,
        minlength: 5,
        maxlength: 5
    },
    isGold: {
        type: Boolean, 
        default:false
    }
});

// Creating a Model from the Mongoose Customer Schema 
const Customer = mongoose.model('Customer', customerSchema); // returning a document

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.customerInputSchema = customerInputSchema;