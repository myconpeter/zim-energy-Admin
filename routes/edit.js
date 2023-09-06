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

router.post('/editUser', (req, res)=>{
    const {username, availableBalance, affliateBonus, profit, principle, investPlans} = req.body
    User.findOne({username: username}, (err, realUser)=>{
        if(!realUser){
            req.flash('error_msg' , 'WRONG INFORMATION');
                res.redirect('/users');
        } else {
            const idd = realUser.id;
            User.findByIdAndUpdate(idd, {availableBalance:availableBalance, affliateBonus: affliateBonus, profit: profit, principle: principle, investPlans: investPlans}, (err, data)=>{
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