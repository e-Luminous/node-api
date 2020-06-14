let express = require('express');

let { signup } = require('./../controllers/authController');

let router = express.Router();

router.post('/signup', signup);

module.exports = router;