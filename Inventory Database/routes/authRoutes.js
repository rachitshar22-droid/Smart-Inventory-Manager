const express=require('express')
const router=express.Router()
const rateLimit=require('express-rate-limit')
const{loginUser, signUpUser,refreshAccessToken,logoutUser}=require('../controller/authController')
const fetchUser=require('../middlewear/fetchUser')
const verifyRole=require('../middlewear/verifyRole')

const loginLimit=rateLimit({
    windowMs:15*60*1000,
    max:4,
    message:{
        success:false,
        message:"Maa chuda"
    }
})

router.post('/login',loginLimit,loginUser)
router.post('/signup',signUpUser)
router.get('/refresh',refreshAccessToken)
router.post('/logout',logoutUser)

router.get('/admin-only',fetchUser,verifyRole(['Admin']),(req,res)=>{
    res.json({success:true,message:"Welcome Admin Boss"})
})
module.exports=router