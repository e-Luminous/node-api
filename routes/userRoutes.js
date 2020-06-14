let express = require('express');

let { signup, login } = require('./../controllers/authController');

let router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;