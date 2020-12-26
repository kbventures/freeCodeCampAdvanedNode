// https://repl.it/@kbventures/boilerplate-advancednode#server.js
// https://boilerplate-advancednode.kbventures.repl.co

'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
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


passport.serializeUser((user,done)=>{
  done(null, user._id);
});

passport.deserializeUser((id, done)=>{
  myDataBase.findOne({ _id: new ObjectID(id)}, (err, doc)=>{
    done(null, null);
  });
});





app.route('/').get((req, res) => {
  console.log(req.session)
  req.session.count ++
  res.render('index', {title: 'Hello', message: 'Please login'});
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + process.env.PORT);
});


/*

process.cwd() returns the current working directory,

i.e. the directory from which you invoked the node command.

__dirname returns the directory name of the directory containing 

the JavaScript source code file

https://stackoverflow.com/questions/9874382/whats-the-difference-between-process-cwd-vs-dirname

*/
