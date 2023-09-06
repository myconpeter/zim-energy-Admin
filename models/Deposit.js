const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const DepositSchema  = new mongoose.Schema({
    email :{
        type  : String,
        required : true
    } ,


    amount :{
        type  : String,
        required : true
    } ,

  
  payment_method :{
    type  : String,
    required : true
} ,
   
date :{
        type : Date,
        default : new Date()
    },

user: [ 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
]
});




const Deposit= mongoose.model('Deposit', DepositSchema);

module.exports = Deposit;