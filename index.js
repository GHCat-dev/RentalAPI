const customers = require('./routes/customers.js');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const mongoose = require('mongoose'); // Loading the mongoose module
const express = require('express'); // Loading the express module
const app = express(); // Enabling HTTP server - returning a http.Server
// An Express application is essentially a bunch of middleware functions
// Express App = HTTP server + request processing pipeline 
console.log('HTTP Server is running');

// Configurating the HTTP Server: Setting the Port + Title
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server Port: ${port}`));
app.set('Title','Server Title: Building an API');
console.log(app.get('Title'));
app.use(express.json()); // for parsing application/json Content Type

// Connecting to MongoDB (Asynch ops) - returning a Promise
mongoose.connect('mongodb://localhost/api',{ 
                                            useNewUrlParser: true, 
                                            useUnifiedTopology: true 
                                            })
    .then( () => console.log(`Connected to MongoDB`))
    .catch( err => console.log(`Something went wrong`, err));

// Request processing pipeline - Chain of Middlewares (functions)
app.get('/', (req, res) => res.send('Hello')); // Root Route 
app.use('/api/customers', customers); // API Customers
app.use('/api/genres', genres); // API Genres
app.use('/api/movies', movies); // API Movies






