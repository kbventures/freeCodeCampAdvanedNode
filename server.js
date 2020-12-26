// https://repl.it/@kbventures/boilerplate-advancednode#server.js
// https://boilerplate-advancednode.kbventures.repl.co

'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
// Using Capital here because it is a constructor
const ObjectID = require('mongodb').ObjectID;


const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', './views/pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:true,
  saveUninitialized: true,
  cookie: {secure: false}
}), passport.initialize(), passport.session());


myDB(async client => {
    const myDataBase = await client.db('fccAdvancedNode').collection('users');

    app.listen(process.env.PORT || 3000, () => {
      console.log('Listening on port ' + process.env.PORT);
    });

    app.route('/').get((req, res) => {
      res.render('index', {title: 'Connected to Database', message: 'Please login'});
    });

    /* Save User Id to a cookie */
    passport.serializeUser((user,done)=>{
      done(null, user._id);
    });

    /* Retrieve User details from cookie  */
    passport.deserializeUser((id, done)=>{
      myDataBase.findOne({ _id: new ObjectID(id)}, (err, doc)=>{
        done(null, doc);
      });
    })
})

