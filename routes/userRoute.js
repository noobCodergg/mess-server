const express = require("express");
const { registration, verifyOTP, login, verifyUser, logout, getAllUsers, deleteAll } = require("../controllers/auth");


const router = express.Router();

router.post('/registration',registration)
router.post('/verify-otp',verifyOTP)
router.post('/login',login)
router.get('/verify-user',verifyUser)
router.get('/log-out',logout)
router.get('/get-all-users',getAllUsers)
router.delete('/delete',deleteAll)


module.exports = router;