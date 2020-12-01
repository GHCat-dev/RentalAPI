const genre = require('./genres');
const {Genre} = require('../models/genre');
const {Movie, movieInputSchema} = require('../models/movie');
const Joi = require('joi');// hmm?
const mongoose = require('mongoose');
const express = require('express');
const { route } = require('./genres');
const router = express.Router();

function validateId(id) {
    if( !mongoose.Types.ObjectId.isValid(id) ) throw "ID not exist"
    return id;
}

// Nie dziala
async function validateBodyData(movie){
    try {
        const options = { abortEarly: false }; // to return all invalid inputs, not only the first one
        const validateBody = await movieInputSchema.validateAsync(movie, options);
        return validateBody;
    }
    catch(ex){
        console.log(ex);
        throw {
            message: 'Fields are required',
            fields: ex.details.map(e => e.message)
        }
    }
}
// Movie is saved to DB but Genre has not been save to DB
// Might use a Transaction/Two Phase Commit to save the Genre and then Movie
// However here, we have a specific list of Genre in DB (ie: 5 genres)
// We want to find the Genre document in DB and attached to the movie
// if so we need to pass the Genre ID, or Genre name? (Zatem genre niech bedzie enumem)
// Podejscie 1: enum - zakladamy liste of genres - hardcoded
// Podejscie 2: string - zakladamy ze mozna dodawac Genre, 
// bez sensu Tworzyc Film z Genrem ktory sie nie dodaje do Kolekcji Genrow
// przy tworzeniu/dodawaniu Filmu z Genrem, Genre albo powinien byc wyszukany, albo stworzony.

async function validateAndSaveMovie(movie){
    try {
        const validMovie = await movie.save()
        return validMovie;
    }
    catch(ex){
        let messageFields = [];
        for (field in ex.errors) {
            messageFields.push(ex.errors[field].message);
        }
        throw {
            message: 'Fields are required',
            fields: messageFields
        }
    }
}

async function getAllMovies() {
    try {
        const movies = await Movie.find();
        return movies;
    }
    catch(ex) {
        throw ex;
    }
}
// Get all Movies
router.get('/', (req, res) => {
    const movies = getAllMovies();
    movies.then(movies => {
                console.log(movies);
                res.send(movies);
            })
            .catch(err => {
                console.log('Failed', err);
                res.status(400).send(err);
            })
})


// Create a Movie
async function createMovie(movie) {
    try {
        // NIE DZIALA WALIDACJA INPUTU
        // const validMovie = await validateBodyData(movie);
        // return validMovie;
        const genreFound = await genre.getGenreByName(movie.genre);
        if (genreFound === null) throw "Genre Not Found";
        movie.genre = genreFound; // update Movie object with found genre
        const savedMovie = await validateAndSaveMovie(movie);
        return savedMovie;
    }
    catch(ex) {
        throw ex;
    }
}

router.post('/', (req, res) => {
    // Co w momencie jak to leco w query params? to jest do API genre: /api/genre?name=..
    // Find Genre by name:
    const newGenre = {
        name: req.body.genre.name
    };
    
    // Create a new Movie in Memory and populate with req values, assigning an ObjectID for Movie and Genre
    const newMovie = new Movie({
        title: req.body.title,
        genre: newGenre,
        // genre: new Genre({ // tego chyba nie musialem, w momencie kiedy save-uje to sprawdza mi scheme
        //     name: req.body.genre.name
        // }),
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
   
    // Create Movie with Genre Found
    const result = createMovie(newMovie);
    result.then(movie => {
                console.log(movie);
                res.send(movie);
            })
          .catch(err => {
                console.log('Failed', err);
                if (err === "Genre Not Found") return res.status(404).send(err);
                res.status(400).send(err);
          })
})
// Remove a Movie
async function deleteMovie(id) {
    try {
        const validId = validateId(id);
        const movieFound = await Movie.findById(validId);
        if (movieFound === null) throw 'Movie Not Found';
        const deletedMovie = await Movie.deleteOne(movieFound);
        return deletedMovie;
    }
    catch(ex) {
        throw ex;
    }
}

router.delete('/:id', (req, res) => {
    const inputId = req.params.id;
    const result = deleteMovie(inputId);
    result.then(movie => res.send(movie))
            .catch(err => {
                console.log('err', err);
                if (err === 'Movie Not Found') return res.status(404).send(err);
                if (err === "ID not exist") return res.status(400).send(err);
                res.status(500).send(err);
            });
})


module.exports = router;


