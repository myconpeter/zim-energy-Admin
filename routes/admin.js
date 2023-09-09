const express = require("express");
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const {ensureAuthenticated} = require('../config/auth'); 

router.get('/admincreate', ensureAuthenticated, (req, res)=>{
    res.render('admincreate');
});

router.post('/admincreate', (req,res)=>{
    const {email, password} = req.body;
    let errors = [];
    if(!email || !password) {
        errors.push({msg : "Please fill in all fields"})
    }
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
    }
    if(errors.length > 0 ) {
    res.render('admincreate', {
        errors : errors,
        email : email,
        password : password,
    })
     } else {
        //validation passed
       Admin.findOne({email : email}).exec((err, admin)=>{
        if(admin) {
            errors.push({msg: 'Admin - email already registered'});
            res.render('admincreate',{
            errors : errors,
            email : email,
            password : password,
            })  
           } else {
            const newAdmin = new Admin({
                email : email,
                password : password,
            });
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newAdmin.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newAdmin.password = hash;
                    //save user
                    newAdmin.save()
                    .then((value)=>{
                        req.flash('success_msg','You have now registered as an Admin, Please login');
                        res.redirect('/adminlogin');
                    })
                    .catch(value=> console.log(value));
                }));
             }
       })
    }
    });

module.exports = router; 