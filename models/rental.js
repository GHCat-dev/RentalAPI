const Joi = require('joi');
const mongoose = require('mongoose');
const { Customer, customerSchema, customerInputSchema } = require('./customer');
const { Movie, movieSchema, movieInputSchema } = require('./movie');

// Schemas for DATA VALIDATION
// Input Schema
const rentalInputSchema = Joi.object({
    customer: customerInputSchema,
    movie: movieInputSchema // nie trzeba calosci..
});

// Mongoose Schema
const rentalSchema = mongoose.Schema({
    customer: customerSchema,
    movie: movieSchema
})

// Create Model against the mongoose schema
const Rental = mongoose.model('Rental', rentalSchema);

// rental {
//     id: 1,
//     customer_id: 
//     movie_id: 
// }

exports.rentalSchema = rentalSchema;
exports.rentalInputSchema = rentalInputSchema;
exports.Rental = Rental;