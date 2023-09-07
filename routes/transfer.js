const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Admin = require('../models/Admin');
const {ensureAuthenticated} = require('../config/auth') 

router.post('/transfer', ensureAuthenticated, (req, res)=>{
    const idd = req.user.id
    const emaill = req.user.email;
    const realamt= req.user.transferAmount;
            const {userEmail, amount} =req.body;
            let errors = [];
            if (!userEmail || !amount){
                errors.push({msg : 'Please fill this form to transfer'});
            }
            if (isNaN(amount)) {
                errors.push({msg : 'Please fill a number in these format: 10000 for Ten thousand Naira'});
            }
            if(errors.length > 0 ) {
                res.render('adminpage', {
                    errors : errors,
                    userEmail : userEmail,
                    amount : amount,
                })
            } else {
                User.findOne({email : userEmail}).exec((err, correctuser)=>{
                    if(!correctuser) {
                        errors.push({msg: 'This Email address does not match, Please review'});
                        res.render('adminpage', {
                            errors : errors,
                            userEmail : userEmail,
                            amount : amount,   
                        })  
                       } else {
                         Admin.findOne({email : emaill}, (err, foundAdmin)=>{
                            const adminAmount =  foundAdmin.transferAmount;
                             if (adminAmount < 0){
                                req.flash('error_msg' , 'Amount is too low please contact Xpress developers');
                                res.redirect('/');
                            } else if (adminAmount < amount ){
                                req.flash('error_msg' , 'Amount is too low please contact Xpress developers');
                                res.redirect('/');


                            } else{
                                    Admin.findByIdAndUpdate(idd, {transferAmount: (realamt - amount)}, function(err, data) {
                            if (err) {

                            }else {
                                const idd = correctuser.id                              
                                User.findByIdAndUpdate(idd, {recievedAmount: amount}, (err, user)=>{
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        req.flash('success_msg', 'Successfully transfered ' + '₦' + amount + ' to ' + userEmail);
                                      res.redirect('/');
                                    }
                                })
                            }
                        });

                            }
                         })
                        }
                   })
            }
        });

module.exports = router; 