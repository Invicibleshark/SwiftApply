const { signup, login } = require('../Controllers/authcontrollers');
const { SignupValidation, LoginValidation } = require('../Middleware/Validation');

const router = require('express').Router();

router.post("/login",LoginValidation,login);
router.post("/signup",SignupValidation,signup);
module.exports = router;