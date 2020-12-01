const {Genre, genreInputSchema} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const { route } = require('./movies');
const router = express.Router();

function validateId(id) {
    if( !mongoose.Types.ObjectId.isValid(id) ) throw "ID not exist"
    return id;
}

async function validateBodyData(genre) {
    try {
        const options = { abortEarly: false }; // to return all invalid inputs, not only the first one
        const validateBody = await genreInputSchema.validateAsync(genre, options);
        return validateBody;
    }
    catch(ex){
        throw {
            message: 'Fields are required',
            fields: ex.details.map(e => e.message)
        }
    }
}

async function validateAndSaveGenre(genre){
    try {
        const validGenre = await genre.save()
        return validGenre;
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
// Get Genre by name: /api/genres?name=... -- Cz
async function getGenreByName(genre) {
    try {
        const genreFound = await Genre.findOne({name: genre.name})
        return genreFound;
    }
    catch(ex) {
        throw ex;
    }
}

// Get all Genres
async function getGenres(){
    try {
        // czy potrzebny jest tutaj try/catch skoro tylko jedna operacja jest?
        // brakuje validacji na url ==> 400 zamiast 404
        const genres = await Genre.find();
        console.log(genres);
        return genres;
    }
    catch(ex){
        console.log(ex);
        throw ex;
    }
}

router.get('/', (req, res) => {
    console.log('lol');
    const getAllGenres = getGenres();
    getAllGenres.then(genres => res.send(genres))
                .catch(err => res.send(err));
});


// Create a new Genre
async function createGenre(genre){
    try {
        const validGenreInputs = await validateBodyData(genre); 
        const newGenre = new Genre(validGenreInputs);
        const savedGenre = validateAndSaveGenre(newGenre);
    return savedGenre;

    }
    catch(ex){
        throw ex;
    }
}

router.post('/', (req, res) => {
    const newGenre = {
        name: req.body.name
    };
    const result = createGenre(newGenre);
    result.then(genre => res.send(genre))
                .catch(err => {
                    if (err.message === 'Fields are required') res.status(400).send(err.fields);
                    res.status(404).send(err);
                });
})

// Remove a Genre
async function deleteGenre(id) {
    try {
        // validate id
        const validId = validateId(id);
        // find by id 
        const genreFound = await Genre.findById(id);
        if (genreFound === null) throw 'Genre Not Found';
        // remove 
        const deletedGenre = await Genre.deleteOne(genreFound);
        return deletedGenre;
    }
    catch(ex){
        throw ex;
    }
}
router.delete('/:id', (req, res) => {
    const inputId = req.params.id;

    const result = deleteGenre(inputId);
    result.then(genre => res.send(genre))
            .catch(err => {
                console.log('err', err);
                if (err === 'Genre Not Found') return res.status(404).send(err);
                if (err === "ID not exist") return res.status(400).send(err);
                res.status(500).send(err);
            });
})

// Update a Genre
async function updateGenre(id, genre) {
    try {
        //validate id
        const validId = await validateId(id);
        //validate data
        const validGenre = await validateBodyData(genre);
        console.log('validGenre', validGenre);
        //find and save to db
        const savedGenre = await Genre.findByIdAndUpdate(validId, validGenre, { useFindAndModify:false, new: true});
        if (savedGenre === null) throw 'Genre Not Found';
        return savedGenre;
    }
    catch(ex){
        throw ex;
    }
}

router.put('/:id', (req, res) => {
    const inputId = req.params.id;
    const newGenre = {
        name: req.body.name
    };

    const result = updateGenre(inputId, newGenre);
    result.then(genre => {
                console.log(genre);
                res.send(genre);
                })
            .catch(err => {
                console.log('err', err);
                if (err === 'Genre Not Found') return res.status(404).send(err);
                if (err === "ID not exist") return res.status(400).send(err);
                res.status(500).send(err);
            });

})
module.exports.getGenreByName = getGenreByName;
module.exports = router;


