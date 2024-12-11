// redirectLogin middleware function to check if the user is logged in or not
// Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login'); // redirect to the login page
    } else {
        next(); // move to the next middleware function
    }
};

const express = require("express");
const router = express.Router();

// Route to render the search page
router.get('/search', function (req, res, next) {
    res.render("search.ejs", { shopData: { shopName: "Shaq's Game Store" } });
});

// Route to render the search results page
router.get('/search_result', function (req, res, next) {
    // Search the database
    let sqlquery = "SELECT * FROM games WHERE name LIKE '%" + req.query.search_text + "%'"; // query database to get all the games
    // Execute SQL query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("list.ejs", {
                availableGames: result,
                sortBy: 'default', // Ensure sortBy is always defined
                shopData: { shopName: "Shaq's Game Store" }
            });
        }
    });
});

// Route to render the games list with sorting functionality
router.get('/list', redirectLogin, function (req, res, next) {
    // Determine the sorting method based on query parameter
    let sortBy = req.query.sortBy || 'default'; // Default to 'default' if no sorting is specified
    let sqlquery = "SELECT * FROM games"; // Base query

    // Append ORDER BY clause based on the sortBy parameter
    switch (sortBy) {
        case 'newest':
            sqlquery += " ORDER BY id DESC";
            break;
        case 'a_to_z':
            sqlquery += " ORDER BY name ASC";
            break;
        case 'z_to_a':
            sqlquery += " ORDER BY name DESC";
            break;
        case 'price_asc':
            sqlquery += " ORDER BY price ASC";
            break;
        case 'price_desc':
            sqlquery += " ORDER BY price DESC";
            break;
    }

    // Execute SQL query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("list.ejs", {
                availableGames: result,
                sortBy: sortBy, // Pass current sort option to the template
                shopData: { shopName: "Shaq's Game Store" }
            });
        }
    });
});

// Route to render the add game form
router.get('/addgame', function (req, res, next) {
    res.render('addgame.ejs', { shopData: { shopName: "Shaq's Game Store" } });
});

// Route to handle adding a new game to the database
router.post('/gamesadded', function (req, res, next) {
    // Saving data in database
    let sqlquery = "INSERT INTO games (name, price) VALUES (?,?)";
    // Execute SQL query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send('This game is added to database, name: ' + req.body.name + ' price ' + req.body.price);
        }
    });
});

// Route to render bargain games (price < 20)
router.get('/bargaingames', function (req, res, next) {
    let sqlquery = "SELECT * FROM games WHERE price < 20";
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("bargains.ejs", {
            availableGames: result,
            shopData: { shopName: "Shaq's Game Store" }
        });
    });
});

// Export the router object so index.js can access it
module.exports = router;