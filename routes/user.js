const express = require("express");
const router = express.Router();
const User = require('../models/user');
const {ensureAuthenticated} = require('../config/auth');



router.get("/users", ensureAuthenticated, (req, res) => {
    // Count the total number of users
    User.countDocuments({}, (err, userCount) => {
        if (err) {
            console.log(err);
        } else {
            // Count the number of users who have invested
            User.countDocuments({ hasInvested: true }, (err, investedUserCount) => {
                if (err) {
                    console.log(err);
                } else {
                    // Find all users
                    User.find({}, (err, allusers) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render("user", {
                                userCount: userCount,
                                investedUserCount: investedUserCount,
                                user: allusers
                            });
                        }
                    });
                }
            });
        }
    });
});


module.exports = router; 