// redirectLogin middleware function to check if the user is logged in or not 
// Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

// Create a new router
const express = require("express")
const router = express.Router()

// Importing the bcrypt 
const bcrypt = require('bcrypt')
const saltRounds = 10

// Import express-validator module
const { check, validationResult } = require('express-validator');

// Route to render the registration page
router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

// Route to handle user registration
router.post('/registered', [check('email').isEmail()], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('./register'); }
    else { 
    // Hashing the password
    const plainPassword = req.body.password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err); // Handle error during hashing
        }

        // Using SQLQuery to insert the user data into the database
        let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?, ?, ?, ?, ?)"
        
        // Collecting the user's data from the form and then storing it
        let newUser = [
            req.sanitize(req.body.username),
            req.sanitize(req.body.first),
            req.sanitize(req.body.last),
            req.sanitize(req.body.email),
            hashedPassword // Storing the hashed password
        ]

        // SQL Query will save the user data in the database
        db.query(sqlquery, newUser, (err, result) => {
            if (err) {
                return next(err) // Handle the error during database insertion
            }

            // saving data in database
            let message = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +' you are now registered!  We will send an email to you at ' + req.sanitize(req.body.email)
            message += '. Your password is: '+ req.sanitize(req.body.password) +' and your hashed password is: '+ hashedPassword
            res.send(message)
        });
    });
}});

// List all the users without showing any passwords
router.get('/list', redirectLogin, function (req, res) {
    // Get user data without the hashed password 
    let sqlquery = "SELECT username, first_name, last_name, email FROM users" // Exclude the hashedPassword
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err)
        }

        // Render the list of users using list.ejs
        res.render('listusers.ejs', {availableUsers: result})
    });
});   

// Log-in page for users
router.get('/login', function (req, res, next) {
    res.render('login.ejs'); // Render the login page using login.ejs 
});

// Log-in page for users
router.post('/loggedin', function (req, res, next) {
    // Find users in the database
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";
    
    // Finding the users in the database
    db.query(sqlquery, [req.body.username], (err, results) => {
        if (err) {
            return next(err); // Handle error during database query
        }

        // Checking if the user is found
        if (results.length === 0) {
            return res.send(`
                <h2>Login failed: Username not found.</h2>
                <form action="${req.headers.referer || './login'}" method="get">
                    <button type="submit">Go Back</button>
                </form>
            `); // Add a button to return to the previous page
        }

        // Get the hashed password from the database
        const hashedPassword = results[0].hashedPassword;

        // Compare the hashed password with the password entered by the user
        bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
            if (err) {
                return next(err); // Handles any errors during the comparison between entered password and database password
            }
            else if (result === true) {
                // Save user session here, when login is successful 
                req.session.userId = req.body.username;
                
                // Respond with a success message and include a button to redirect back to the homepage
                return res.send(`
                    <h2>Login was successful! Welcome back, ${req.body.username}!</h2>
                    <form action="/" method="get">
                        <button type="submit">Go to Home</button>
                    </form>
                `);
            }
            else {
                // Login was failed
                return res.send(`
                    <h2>Login failed: Incorrect password.</h2>
                    <form action="${req.headers.referer || './login'}" method="get">
                        <button type="submit">Go Back</button>
                    </form>
                `); // Add a button to return to the previous page
            }
        });
    });
});

// Logout route
router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'../'+'>Home</a>');
    })
});

// Home route (to render the index.ejs page)
router.get('/', (req, res) => {
    res.render('index.ejs');
});

// Export the router object so index.js can access it
module.exports = router; 
