const { Signup, Login, getMe,Logout } = require('../controllers/authcontrollers');
const verifyToken = require('../middleware/verifyToken');

const router = require('express').Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/me", verifyToken, getMe);
router.post("/logout",Logout);

module.exports = router;