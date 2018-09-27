var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var csrfProtection = csrf();
var Products = require('../models/product');

var Order = require('../models/order');
var Cart = require('../models/cart');


router.use(csrfProtection);

/* GET users listing. */

router.get('/profile',isLoggedIn,function(req,res,next){
  Order.find({user: req.user}, function(err, orders) {
    if (err) {
        return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
    });
    res.render('user/profile', { orders: orders });
});
});

router.get('/logout', isLoggedIn ,async (req, res) => {
  req.logout();
  res.redirect('/')
});

router.use('/',isNotLoggedIn,function(req,res,next){
  next();
});

router.get('/signup',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages, hasErrors:messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
  } else {
      res.redirect('/user/profile');
  }
});


router.get('/signin',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/login',{csrfToken:req.csrfToken(),messages:messages, hasErrors:messages.length > 0});
})

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
  } else {
      res.redirect('/user/profile');
  }
});


function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
};


function isNotLoggedIn(req,res,next) {
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
};

module.exports = router;
