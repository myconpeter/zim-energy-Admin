const express = require("express");
const router = express.Router();
const Deposit = require('../models/Deposit');
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/user');

router.get("/deposit", ensureAuthenticated, (req, res)=>{
    const user = req.params.id;

    Deposit.find({}).populate("user").exec((err, allDeposit) =>{
        console.log()
        if (err){
                console.log(err);
                    } else {
                    res.render("deposit", {deposit: allDeposit});
                    }
    });
});

module.exports = router; 