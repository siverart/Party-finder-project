const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers')


router.post('/register', authController.register);
// router.post('/login', authController.login);
router.post('/resend-activation', authController.resendActivationEmail)

router.get('/activate/:token', authController.activation)

module.exports = router;