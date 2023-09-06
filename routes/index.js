const express = require("express");
const router = express.Router();
const passport = require ("passport");
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/user');


router.get('/', ensureAuthenticated, (req, res)=>{
    res.render('adminpage')
});

router.get('/adminlogin', (req, res)=>{
    res.render('adminlogin')
});




//
//
router.post('/adminlogin', (req, res, next)=>{
    passport.authenticate('userAdmin',{
        successRedirect : '/',
        failureRedirect: '/adminlogin',
        failureFlash : true
    })(req,res,next)
    });

    router.get('/adminlogout',(req,res)=>{
        req.logout();
        req.flash('success_msg','You have successful logout');
        res.redirect('/'); 
        })
    
module.exports = router; 