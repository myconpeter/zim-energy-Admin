const express = require("express");
const router = express.Router();
const User = require('../models/user');
const {ensureAuthenticated} = require('../config/auth');

router.get('/editUser/:id', (req, res)=>{
    User.findById(req.params.id, (err, user)=>{
        if (err){
            console.log(err)
        }else{
            res.render("editUser", {duser: user});

        }
    })
});
//

router.post('/editUser',ensureAuthenticated, (req, res)=>{
    const {username, balance, totalIncome, teamIncome, withdrawable, machineRunning, dailyPay, assets} = req.body
    User.findOne({username: username}, (err, realUser)=>{
        if(!realUser){
            req.flash('error_msg' , 'WRONG INFORMATION');
                res.redirect('/users');
        } else {
            const idd = realUser.id;
            User.findByIdAndUpdate(idd, {balance:balance, teamIncome: teamIncome, totalIncome: totalIncome, withdrawable: withdrawable, machineRunning: machineRunning, dailyPay:dailyPay, assets: assets}, (err, data)=>{
                if(err){
                    console.log(err)
                } else {
                    req.flash('success_msg','You have successfully update ' + username);
                    res.redirect('/users');

                }
            })
        }
    })

})    


module.exports = router; 