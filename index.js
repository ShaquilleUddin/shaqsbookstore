// Import express and ejs
var express = require('express');
var ejs = require('ejs');

// Import mysql module
var mysql = require('mysql2');

// Import express-session module
var session = require('express-session');

// Import express-validator module
var validator = require('express-validator');

// Create the express application object
const app = express();
const port = 8000;

// Import express-sanitizer module
const expressSanitizer = require('express-sanitizer');

// Create an input sanitizer
app.use(expressSanitizer());

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

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
app.locals.shopData = { shopName: "Shaq's Game Shop" };

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

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`));