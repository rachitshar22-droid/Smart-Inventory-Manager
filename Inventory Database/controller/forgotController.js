const crypto=require('crypto')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const mainUser=require('../models/User')
const ResetOtp=require('../models/ResetOtp')
const RefreshToken=require('../models/RefreshToken')
const {sendOtpMail}=require('../services/mailer')

const sendOtpReset=async(req,res)=>{
    try{
        const email=req.body.email?.trim().toLowerCase()
        if(!email) return res.status(400).json({success:false,message:'Please Enter Email'})

            const user=await mainUser.findOne({email})
            if(!user) return res.status(400).json({success:false,message:'The email does not belomg to this account'})

                const otp=String(crypto.randomInt(100000,1000000)) //crypto wala secure 6 digit
                const otpHash=await bcrypt.hash(otp,10)

                //purana OTP apne aap replace(upsert),attempt wapas 0

                await ResetOtp.findOneAndUpdate(
                    {email},
                    {otpHash,attempts:0,expiresAt:new Date(Date.now()+5*60*1000)},
                    {upsert:true}
                )
                await sendOtpMail(email,otp)
                res.json({success:true,message:'OTP Sent Successfully'})
        }catch(error){
            res.status(500).json({success:false,error:error.message})
        }
}

const verifyOtp=async(req,res)=>{
    try{
        const email=req.body.email?.trim().toLowerCase()
        const {otp}=req.body

        const rec=await ResetOtp.findOne({email})
        if(!rec) return res.status(400).json({success:false,message:'OTP expired'})

            const ok=await bcrypt.compare(String(otp),rec.otpHash)
            if(!ok){
                rec.attempts+=1
                if(rec.attempts>=3){
                    await rec.deleteOne()
                    return res.status(429).json({success:false,message:'3 attempts finished,Please try again later'})
                }
                await rec.save()
                return res.status(400).json({success:false,message:`Wrong Otp,${3-rec.attempts} attempts left`})
            }
            await rec.deleteOne() //Otp sirf one time chalega
            const resetToken=jwt.sign({email,purpose:'reset'},process.env.JWT_RESET_SECRET,{expiresIn:'10m'})
            res.json({success:true,resetToken})
    }catch(error){
        res.status(500).json({success:false,error:error.message})
    }
}

const resetPassword=async(req,res)=>{
    try{
        const {resetToken,newPassword,confirmPassword}=req.body

        let decoded
        try{decoded=jwt.verify(resetToken,process.env.JWT_RESET_SECRET)}
        catch{return res.status(403).json({success:false,message:'Session expired,Please Retake Otp'})}
        if(decoded.purpose!=='reset') return res.status(403).json({success:false,message:'Invalid Token'})

            if(newPassword!==confirmPassword)
                return res.status(400).json({success:false,message:'Dono password match nhi krte'})

            const strong=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/
            if(!strong.test(newPassword))
                return res.status(400).json({success:false,message:'Min 8 character 1 capital 1 small 1 number'})

            const user=await mainUser.findOne({email:decoded.email})
            if(!user) return res.status(404).json({success:false,message:'User did not found'})

                //new password purane jaisa toh nhi
                if(await bcrypt.compare(newPassword,user.password))
                    return res.status(400).json({success:false,message:'New password is not same as old Password'})

                user.password=await bcrypt.hash(newPassword,10)
                await user.save()

                //saare purane login session kill
                await RefreshToken.updateMany({userId:String(user._id)},{revoked:true})

                res.json({success:true,message:'Password update successfully,Please Logim'})
    }catch(error){
        res.status(500).json({success:false,error:error.message})
    }
}
module.exports={sendOtpReset,verifyOtp,resetPassword}