const express=require('express')
const router=express.Router()
const rateLimit=require('express-rate-limit')
const{loginUser,refreshAccessToken,logoutUser}=require('../controller/authController')
const {sendOtp,signUp}=require('../controller/signupController')
const fetchUser=require('../middlewear/fetchUser')
const verifyRole=require('../middlewear/verifyRole')
const {sendOtpReset,verifyOtp,resetPassword}=require('../controller/forgotController')


const loginLimit=rateLimit({
    windowMs:15*60*1000,
    max:4,
    message:{
        success:false,
        message:"Too many request,wait for a while"
    }
})

const otpLimit=rateLimit({
    windowMs:15*60*1000,
    max:4,
    message:{
        success:false,
        message:"Too many request,wait for a while"
    }
})

const sendLimit=rateLimit({
    windowMs:15*60*1000,
    max:4,
    message:{
        success:false,
        message:"Too many request,wait for a while"
    }
})

const verifyLimit=rateLimit({
    windowMs:15*60*1000,
    max:4,
    message:{
        success:false,
        message:"Too many request,wait for a while"
    }
})

router.post('/forgot/send-otp',sendLimit,sendOtpReset)
router.post('/forgot/verify-otp',verifyLimit,verifyOtp)
router.post('/forgot/reset',resetPassword)

router.post('/signUp',signUp)
router.post('/send-otp',otpLimit,sendOtp)
router.post('/login',loginLimit,loginUser)
router.get('/refresh',refreshAccessToken)
router.post('/logout',logoutUser)


router.get('/admin-only',fetchUser,verifyRole(['Admin']),(req,res)=>{
    res.json({success:true,message:"Welcome Admin Boss"})
})
module.exports=router