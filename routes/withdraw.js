const express = require("express");
const router = express.Router();
const Withdrawal = require('../models/Withdrawal');
const {ensureAuthenticated} = require('../config/auth');

router.get("/withdrawreq", ensureAuthenticated, (req, res)=>{
    // find the campground with tihe id
    Withdrawal.find({}).populate("user").exec((err, allWithdraws) =>{
        if (err){
                console.log(err);
                    } else {
                    res.render("withdrawls", {withdraw: allWithdraws});
                    }
    });
});

module.exports = router; 