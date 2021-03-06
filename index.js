const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require('./routes/authroutes');
const passportSetup = require('./config/passport-setup');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const profileRoutes = require('./routes/profileroutes');
const authCheck = require('./middleware/authcheck');
const AppKeys = require("./keys/appKeys");

mongoose.connect(AppKeys.MONGO_DB_CONN_URI, () => {
  console.log("MLAB Connection Info");
})

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));

app.use(cookieSession({
  maxAge: 2*24*60*60*1000,
  keys: [   AppKeys.SESSION_COOKIE_KEY  ]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/home', (req, res) => {
  res.render('home', {user: req.user});
});

app.use('/auth', authRoutes);
app.use('/profile', authCheck, profileRoutes);

app.get('*', (req, res) => {
  res.redirect('/home');
});

app.listen(port, ()=>{
  console.log(`Listening on ${port}`);
});
