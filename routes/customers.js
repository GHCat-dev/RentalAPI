const {Customer, inputSchema} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// DATA VALIDATION 
// Validate ID if it's matching the mongoose objectID
function validateId(id) {
    if( !mongoose.Types.ObjectId.isValid(id) ) throw "ID not exist"
    return id;
}

// Validate Body Inputs
async function validateBodyData(customer) {
    try {
        const options = { abortEarly: false }; // to return all invalid inputs, not only the first one
        const validateBody = await inputSchema.validateAsync(customer, options);
        return validateBody;
    }   
    catch(ex){
        throw {
            message: 'Fields are required',
            fields: ex.details.map(e => e.message)
        };
    }
}

// Validate against mongoose Schema and Saving to MongoDB
async function validateAndSaveCustomer(customer){
    try {
        const savedCustomer = await customer.save();
    }
    catch(ex) {
        let messageFields = [];
        for (field in ex.errors) {
            messageFields.push(ex.errors[field].message);
        };
        throw {
            message: 'Fields are required',
            fields: messageFields
        };
    }
}
// Get all Customers
async function getCustomers(){
    // Tu mi brakuje jak ktos wpisze zly url - validacja --> 400 a nie 404
    const customers = await Customer.find();
    return customers;
 }
router.get('/', (req, res) => {
    const getAllCustomers = getCustomers();
    getAllCustomers.then(customers => res.send(customers)) 
                    .catch(err => console.log(err.message));

});

// Can I mix synchronous and async in a try/catch block?
// Can I mix await and synch function within an async function?

// Create a Customer 
async function createCustomer(customer) {
    try {
        // Parse and validate client input
        const validCustomerInputs = await validateBodyData(customer);

        // Create the object in memory annd validate it with the Customer Schema
        const newCustomer = new Customer(validCustomerInputs); // creating an object in the app memory
        const result = validateAndSaveCustomer(newCustomer);
        return result;
    }
    catch (ex) {
        throw ex;
        
    }
}

router.post('/', (req, res) => {
    const newCustomer = {
        name: req.body.name,
        phone: req.body.phone
    };
    const result = createCustomer(newCustomer);
    result.then(customer => {
                console.log(`Successfuly created the following customer:
                ${customer}`);
                res.send(customer);
                })
            .catch(err => {
                console.log(`Failed to create a customer`, err);
                if (err.message === "Fields are required") return res.status(400).send(err);
                res.status(500).send(err);
                });
});

// Remove a Customer
async function deleteCustomer(id) {
    try {
        // Validate the ID
        const validId = await validateId(id);
        // Find the customer  
        const customerFound = await Customer.findById(validId);
        if (customerFound === null) throw "Customer Not Found";
        const customer = await Customer.deleteOne(customerFound);
        return customer;
    }
    catch(ex) {
        throw ex;
   }
}

router.delete('/:id', (req, res) => {
    const customerId = req.params.id;
    const result = deleteCustomer(customerId);
    result.then(customer => {
                console.log('Succesfully deleted')
                res.send(customer);
            })
            .catch(err => {
                console.log('Failed to delete the customer', err);
                if (err === 'ID not exist') return res.status(400).send(err);
                if (err === 'Customer Not Found') return res.status(404).send(err);
                res.status(500).send(err);
            });
    
});

async function updateCustomer(id, customer) {
    try {
        // Parse and validate client input
        const validId = await validateId(id);
        const validCustomer = await validateBodyData(customer)

        // Find and update the customer 
        const customerFound = await Customer.findByIdAndUpdate(validId, validCustomer, { useFindAndModify:false, new: true});
        if (customerFound === null) throw 'Customer Not Found'; 
        return customerFound;
    }
   catch(ex)
   {
       throw ex;
   }
}
router.put('/:id', (req, res) => {
    const customerId = req.params.id;
    const newCustomer = {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    };
    const result = updateCustomer(customerId, newCustomer);
    result.then(customer => {
                console.log('Sucessfully updated', customer)
                res.send(customer);
            })
            .catch(err => {
                console.log('Failed to updated', err);
                // To moglo by byc pewnie lepsze by zarzadzac errorami
                if (err === 'ID not exist' || err.message === "Fields are required") return res.status(400).send(err);
                if (err === 'Customer Not Found') return res.status(404).send(err);
                res.status(500).send(err);
            });

});

module.exports = router;
