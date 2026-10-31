const crypto=require('crypto')  //math se accha hai predict krna hard hai
const User=require('../models/User')
const Otp=require('../models/Otp')
const {sendOtpMail}=require('../services/mailer')
const bcrypt=require('bcryptjs')
const PASS_REGEX=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/

function hashOtp(otp){
    return crypto.createHash('sha256').update(otp).digest('hex')
}

const sendOtp=async(req,res)=>{
    try{
        const {email}=req.body

        //email string hona chahiye
        if(typeof email!=='string'){
            return res.status(400).json({error:'Email toh daale'})
        }
        const cleanEmail=email.trim().toLowerCase()

        //email ka format check karo
        if (!/^\S+@\S+\.\S+$/.test(cleanEmail)){
            return res.status(400).json({error:'Sahi email daalo'})
        }

        //email phele se registered toh nhi
        const alreadyUser=await User.findOne({email:cleanEmail})
        if(alreadyUser){
            return res.status(409).json({error:'Ye email phele se registered hai'})
        }

        //6 digit ka random otp
        const otp=String(crypto.randomInt(100000,1000000))

        //otp ka hash save kro 5 min baad expire aur agar email otp aaya hai phele se toh new usko badlega
        await Otp.findOneAndUpdate(
            {email:cleanEmail},
            {
                otpHash:hashOtp(otp),
                attempts:0,
                expiresAt: new Date(Date.now()+5*60*1000),
            },
            {upsert:true}//record hai toh update kro nhi hai toh new bnao
        )

        //mail bhejo
        await sendOtpMail(cleanEmail,otp)
        res.json({message:'OTp bhej diya'})
    }catch(error){
        console.log('sendOtp error:',error)
        res.status(500).json({error:'OTP nahi bhej paaya'})
    }
}

const signUp=async(req,res)=>{
    try{
        const{name,username,password,email,otp}=req.body    
    //sab kuch text hona chahiye
    const all=[name,username,password,email,otp]
    if(all.some((v)=>typeof v!=='string')){  // some puri list check krega v 1 1 item ke liye
        return res.status(400).json({error:'Saari details daalo'})
    }
    const cleanEmail=email.trim().toLowerCase()
    const cleanUsernname=username.trim()

    //password strong hai
    if(!PASS_REGEX.test(password)){
        return res.status(400).json({error:'Password mein 8+ character,capital,small,number aur symbol chahiye'})
    }

    //username ya email phele se to nhi?
    const nameTaken=await User.findOne({username:cleanUsernname})
    if(nameTaken) return res.status(409).json({error:'Username is already taken'})
    const mailTaken=await User.findOne({email:cleanEmail})
    if (mailTaken) return res.status(409).json({error:'Email is already registerd'})

    //email ka otp record dekho
    const record=await Otp.findOne({email:cleanEmail})
    if(!record||record.expiresAt<new Date()){
        return res.status(400).json({error:'Otp expires hogya hai'})
    }

    //bahut galat attempt hogaya
    if(record.attempts>=3){
        await Otp.deleteOne({email:cleanEmail})
        return res.status(429).json({error:'bahut galat try hogye,wait'})
    }

    //otp check
    if(record.otpHash!==hashOtp(otp.trim())){
        record.attempts=record.attempts+1
        await record.save()
        return res.status(400).json({error:' Wrong otp'})
    }

    //pasword hash salt
    const hashedPassword=await bcrypt.hash(password,10)

    //user save kro(role toh backend se milega)
    await User.create({
        name:name.trim(),
        username:cleanUsernname,
        email:cleanEmail,
        password:hashedPassword,
        role:'User',
    })

    //otp ka kaam khtm delete
    await Otp.deleteOne({email:cleanEmail})
    res.status(201).json({message:'Account Created SuccessFully'})

    }catch(error){
        //unique index ne duplicate pakda(do log ek sath signup kare to)
        if(error.code===11000){
            return res.status(409).json({error:'username or email already registerd'})
        }
        console.log('signup error:',error)
        res.status(500).json({error:'Signup failed'})
    }
}


module.exports={sendOtp,signUp}