// redirectLogin middleware function to check if the user is logged in or not
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        let loginPath;
        
        // Check if we are running on localhost or production
        if (req.get('host').includes('localhost')) {
            loginPath = '/users/login'; // For localhost
        } else {
            loginPath = '/usr/159/users/login'; // For production
        }

        res.redirect(loginPath); // Redirect to the appropriate login page
    } else {
        next(); // Move to the next middleware function
    }
};

const express = require("express");
const router = express.Router();

// Route to render the search page, requires login
router.get('/search', redirectLogin, function (req, res, next) {
    res.render("search.ejs", { shopData: { shopName: "Shaq's Game Store" } });
});

// Route to render the search results page
router.get('/search_result', function (req, res, next) {
    // Search the database
    let sqlquery = "SELECT * FROM games WHERE name LIKE '%" + req.query.search_text + "%'"; // Query database to get all the games
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

// Route to render the add game form, requires login
router.get('/addgame', redirectLogin, function (req, res, next) {
    res.render('addgame.ejs', { shopData: { shopName: "Shaq's Game Store" } });
});

// Route to handle adding a new game to the database
router.post('/gameadded', redirectLogin, function (req, res, next) {
    // Saving data in the database
    let sqlquery = "INSERT INTO games (name, price) VALUES (?,?)";
    // Execute SQL query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send('This game is added to the database, name: ' + req.body.name + ' price ' + req.body.price);
        }
    });
});

// Route to render bargain games (price < 20), requires login
router.get('/bargaingames', redirectLogin, function (req, res, next) {
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