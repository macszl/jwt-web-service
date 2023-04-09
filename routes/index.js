var express = require('express');
var router = express.Router();

const { login, register } = require('../controllers/authController');
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/auth/signin', login);

router.post('/auth/signup', register);

router.get('/resource/public', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/resource/user', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/resource/admin', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
module.exports = router;
