// Import required modules
var express = require('express');
var ejs = require('ejs');
var mysql = require('mysql2');
var session = require('express-session');
var validator = require('express-validator');
const expressSanitizer = require('express-sanitizer');
const path = require('path');  // For handling paths

// Create the express application object
const app = express();
const port = 8000;

// Set up the input sanitizer
app.use(expressSanitizer());

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set the path to the views directory (ensure it's correct)
app.set('views', path.join(__dirname, 'views'));  // Explicitly set the views directory path

// Set up the body parser
app.use(express.urlencoded({ extended: true }));

// Set up public folder (for css and static js)
app.use(express.static(__dirname + '/public'));

// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// Define the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'shaqsgamestore',
    password: 'qwertyuiop',
    database: 'shaqsgamestore'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// Define our application-specific data
app.locals.shopData = { shopName: "Shaq's Game Store" };

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

// Load the route handlers for /users
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// Load the route handlers for /games
const booksRoutes = require('./routes/games');
app.use('/games', booksRoutes);

// Load the route handlers for /currency (Currency converter route)
const currencyRoutes = require('./routes/currency');
app.use('/currency', currencyRoutes);

// Load the route handlers for /api (API routes)
const apiRoutes = require('./routes/api'); // Adjust path if necessary
app.use('/api', apiRoutes);

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`));