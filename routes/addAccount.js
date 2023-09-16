const express = require("express");
const router = express.Router();
const User = require('../models/user');
const {ensureAuthenticated} = require('../config/auth');
const Admin = require('../models/Admin');
const Account = require('../models/acctdetails');




router.get("/addAccount", ensureAuthenticated, (req, res)=>{
    // find the campground with tihe id
    res.render('addAccount')
});


router.post("/addAccount", ensureAuthenticated, async(req, res)=>{

  
   
  const { accountName, accountNumber, bankName} = req.body;
  const userId = req.user._id;
  let errors = [];

  if (!accountName || !accountNumber || !bankName) {
    errors.push({ msg: "Please fill in all fields" });
  }

 

  if (errors.length > 0) {
    res.render('addAccount', {
      errors: errors,
      accountName: accountName,
      accountNumber: accountNumber,
      bankName: bankName,
    
    });
  } else {
    try {
      const user = await Admin.findById(userId);

      if (!user) {
        errors.push({ msg: 'User not found' });
        res.render('addAccount', {
          errors,
          accountName,
          accountNumber,
          bankName,
         
        });
      
      }

   
    // Find all accounts
Account.find({}, (err, allAccounts) => {
  if (err) {
      console.error('Error fetching accounts:', err);
      return;
  }

  // Iterate through each account and update its properties
  allAccounts.forEach(account => {
      account.accountName = accountName; // Update account name
      account.accountNumber = accountNumber; // Update account number
      account.bankName = bankName; // Update bank name

      // Save the updated account
      account.save((saveErr) => {
          if (saveErr) {
              console.error('Error saving account:', saveErr);
          } else {
              console.log('Account updated and saved successfully.');
          }
      });
  });
});





    
       
        req.flash('success_msg', 'You have Successfully updated the account details');
        res.redirect('/');
      
    } catch (err) {
      console.error(err);
      errors.push({ msg: 'An error occurred' });
      res.render('addAccount', {
        errors,
        accountName,
        accountNumber,
        bankName,
       
      });
    }
  }
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