const {genreSchema, genreInputSchema} = require('./genre');
const Joi = require('joi');
const mongoose = require('mongoose');

// SCHEMAS
// Input Schema:
const movieInputSchema = Joi.object({
    title: Joi.string().required(),
    genre: genreInputSchema.required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required()
});

// Mongoose Schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true
    }
})

// Create a Model for movie
const Movie = mongoose.model('Movie', movieSchema);

exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.movieInputSchema = movieInputSchema;