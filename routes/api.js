const express = require('express');
const router = express.Router();
const mysql = require('mysql');

router.get('/games', function (req, res, next) {

    // Query database to get all the books
    let sqlquery = "SELECT * FROM games"; // Query database to get all the games

    // Execute the sql query
    db.query(sqlquery, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

module.exports = router;