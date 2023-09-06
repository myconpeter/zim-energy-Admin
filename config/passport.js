const Admin = require('../models/Admin');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');

passport.use('userAdmin', new LocalStrategy
            ({usernameField: 'email'},(email,password,done)=>{
            //match user
            Admin.findOne({email:email})
            .then((user)=>{
                if(!user){
                    return done(null,false,{message:' This admin - email not registered'});
                }
                //math passwords
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null,user);
                    } else{
                        return done(null,false,{message: 'Incorrect Password!!!'});
                    }
                })
            })
            .catch((err)=>{console.log(err)})
        })
    )
    passport.serializeUser(function(user,done) {
        done(null,user.id);
    })
    passport.deserializeUser(function(id,done){
        Admin.findById(id,function(err,user){
            done(err,user);
        })
    });

