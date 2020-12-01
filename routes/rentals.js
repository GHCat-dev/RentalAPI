const { Rental, rentalInputSchema, rentalSchema } = require('../models/rental');
const mongoose = require('mongoose');
const router = express.Router();
const express = require('express');


// Get all Rentals
async function getRentals(){
    try{
        const rentals = await Rental.find();
        return rentals;
    }
    catch(ex){
        throw ex;
    }
}

router.get('/', (req, res) => {
const getAllRentals = getRentals();
getAllRentals.then(rentals => {
                console.log('Rentals');
                res.send(rentals);
            })
            .catch(err => {
                console.log('Failed to load rentals');
                res.status(404).send(err);
            })
})

// Create new Rental should trigger:
// Update movie {
//     numberInStock: -1 
// } 
// Update customer {
//     rentals [ids]
// }

async function findCustomerAndMovie(rental){
    
}
async function createRental(rental) {
    // validated input (input Schema) - maybe we should add here 24 char
    await validateBodyInput(rental);
    // validate id - ObjectID of customer and movie
    await validateIds(rental);
    // find those customer and movie documents - // should be a transaction
    await findCustomerAndMovie(rental)
    // transaction: create the new rental object with appropriate ids 
    // + update movie + update customer
    
}

router.post('/', (req, res) => {
    const newRental = new Rental({
        customer: req.body.customer_id, // customer_ID
        movie: req.body.movie_id // movie_ID
    })
    const rental = createRental(newRental);
    rental.then(rental => {
        console.log('New Rental');
        res.send(rental);
    })
    .catch(err => {
        console.log('Failed to load rentals');
        res.status(404).send(err);
    })
})

// Remove a Rental should trigger:
// movie {
//     numberInStock: +1 
// }
// customer {
//     rentals [ids]
// }
router.delete('/', (req, res) => {
    
})

// Update a Rental?
// change the movie or customer id?