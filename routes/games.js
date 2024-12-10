// redirectLogin middleware function to check if the user is logged in or not 
// Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
})

router.get('/search_result', function (req, res, next) {
    // Search the database
    let sqlquery = "SELECT * FROM games WHERE name LIKE '%" + req.query.search_text + "%'" // query database to get all the games
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableGames:result})
     }) 
})

router.get('/list', redirectLogin, function (req, res) {
    let sqlquery = "SELECT * FROM games" // query database to get all the games
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableGames:result})
     })
})

router.get('/addgame', function (req, res, next) {
    res.render('addgame.ejs')
})

router.post('/gamesadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO games (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This game is added to database, name: '+ req.body.name + ' price '+ req.body.price)
    })
}) 

router.get('/bargaingames', function(req, res, next) {
    let sqlquery = "SELECT * FROM games WHERE price < 20"
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargains.ejs", {availableGames:result})
    })
}) 


// Export the router object so index.js can access it
module.exports = router