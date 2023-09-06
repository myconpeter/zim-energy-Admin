const express = require("express");
const router = express.Router();
const User = require('../models/user');
const {ensureAuthenticated} = require('../config/auth');
const Withdrawal = require("../models/Withdrawal");
const Deposit = require("../models/Deposit");


router.delete("/deleteRequest/:id", ensureAuthenticated, (req, res)=>{
        User.findByIdAndRemove(req.params.id, (err)=>{
        if (err){
            res.redirect("/users");
        } else {
            req.flash('success_msg' , 'Successful deleted');
            res.redirect("/users");
        }
    });
});


router.delete("/deleteWithdraw/:id", ensureAuthenticated, (req, res)=>{
    Withdrawal.findByIdAndRemove(req.params.id, (err)=>{
    if (err){
        res.redirect("/users");
    } else {
        req.flash('success_msg' , 'Successful deleted a withdrawal request');
        res.redirect("/withdrawreq");
    }
});
});



router.delete("/deleteDeposit/:id", ensureAuthenticated, (req, res)=>{
    Deposit.findByIdAndRemove(req.params.id, (err)=>{
    if (err){
        res.redirect("/users");
    } else {
        req.flash('success_msg' , 'Successful');
        res.redirect("/deposit");
    }
});
});

module.exports = router; 
