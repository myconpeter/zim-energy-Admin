const express = require("express");
const router = express.Router();
const User = require('../models/user');
const {ensureAuthenticated} = require('../config/auth');

router.get("/users", ensureAuthenticated, (req, res)=>{
    // find the campground with tihe id
    User.find({}).exec((err, allusers) =>{
        if (err){
                console.log(err);
                    } else {
                    res.render("user", {user: allusers});
                    }
    });
});

module.exports = router; 