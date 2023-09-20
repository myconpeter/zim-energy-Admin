const express = require("express");
const router = express.Router();
const User = require('../models/user');
const {ensureAuthenticated} = require('../config/auth');
const Withdrawal = require("../models/Withdrawal");
const Deposit = require("../models/Deposit");
const mongoose= require('mongoose');


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



router.post("/approve/:id", ensureAuthenticated, async (req, res) => {
  try {
    const id = req.params.id;
    

    const withdraw = await Withdrawal.findByIdAndUpdate(id, { isConfirmed: true  });

    if (!withdraw) {
      req.flash('error_msg', 'Withdrawal not found');
      return res.redirect("/withdrawreq");
    }

    req.flash('success_msg', 'Withdrawal successfully approved');
    res.redirect("/withdrawreq");
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while approving the Withdrawal');
    res.redirect("/withdrawreq");
  }
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
