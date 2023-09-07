const express = require("express");
const router = express.Router();
const User = require('../models/user');
const {ensureAuthenticated} = require('../config/auth');
const Admin = require('../models/Admin');



router.get("/addAccount", ensureAuthenticated, (req, res)=>{
    // find the campground with tihe id
    res.render('addAccount')
});


router.post("/addAccount", ensureAuthenticated, (req, res)=>{
    res.render('adminpage')
})

router.get("/creditUser", ensureAuthenticated, (req, res)=>{
    // find the campground with tihe id
    res.render('creditUser')
});



router.post('/creditUser', ensureAuthenticated, async (req, res) => {
    try {
      const adminId = req.user.id;
      const adminEmail = req.user.email;
      const adminBalance = req.user.transferAmount;
      const { email, amount } = req.body;
      const errors = [];
  
      if (!email || !amount) {
        errors.push({ msg: 'Please fill out all fields to credit the user' });
      }
  
      if (isNaN(amount)) {
        errors.push({ msg: 'Please enter a valid number (e.g., 10000 for Ten thousand Naira)' });
      }
  
      if (errors.length > 0) {
        res.render('creditUser', {
          errors,
          email,
          amount,
        });
      } else {
        const correctUser = await User.findOne({ email }).exec();
  
        if (!correctUser) {
          errors.push({ msg: 'This email address does not match any user, please review' });
          res.render('creditUser', {
            errors,
            email,
            amount,
          });
        } else {
          const foundAdmin = await Admin.findOne({ email: adminEmail }).exec();
          const adminTransferAmount = foundAdmin.transferAmount;
  
          if (adminTransferAmount < 0 || adminTransferAmount < amount) {
            req.flash('error_msg', 'Insufficient balance, please contact Xpress developers');
            res.redirect('adminpage');
          } else {
            // Deduct from admin balance
            foundAdmin.transferAmount -= amount;
            await foundAdmin.save();
             
            const amountAsNumber = parseInt(amount);
           


            // Update user balance
            correctUser.balance += amountAsNumber;
            correctUser.withdrawable += amountAsNumber;
            correctUser.totalIncome += amountAsNumber;
            await correctUser.save();
  
            req.flash('success_msg', `Successfully credited ₦${amount} to ${email}`);
            res.redirect('/');
          }
        }
      }
    } catch (err) {
      console.error(err);
      // Handle error appropriately, e.g., render an error page or return a JSON response.
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  





module.exports = router; 