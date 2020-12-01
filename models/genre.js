const Joi = require('joi');
const mongoose = require('mongoose');

// Schemas for DATA VALIDATION
// Input Schema
const genreInputSchema = Joi.object({
    name: Joi.string().required()
});

// Mongoose Schema (db)
const genreSchema = new mongoose.Schema({
    name: {
        type: String, // ?
        required: true,
    }
});

// Model 
const Genre = mongoose.model('Genre', genreSchema);

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.genreInputSchema = genreInputSchema;