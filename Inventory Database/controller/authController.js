const mainUser=require("../models/User")
const RefreshToken=require('../models/RefreshToken')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {randomUUID}=require('crypto')
const cookieOpts={httpOnly:true,secure:false,sameSite:'lax'}
 
const issueRefresh=async(tokenData,family=randomUUID())=>{
    const jti=randomUUID()
    const token=jwt.sign({...tokenData,jti,family},process.env.JWT_REFRESH_SECRET,{expiresIn:'7d'})
    await RefreshToken.create({
        userId:tokenData.userId,family,jti,
        expiresAt:new Date(Date.now()+7*24*60*60*1000)
    })
    return token
}


const loginUser=async(req,res)=>{
    try{
        const{username,password}=req.body
        if(!username||!password){
            return res.status(400).json({success:false,message:"username password kha hai"})
        }
        const foundUser=await mainUser.findOne(
            {username:username})
            if(!foundUser){
                    return res.status(404).json({success:false,message:"DB mai Data nhi mila"})
            }
            const isMatch=await bcrypt.compare(password,foundUser.password)
        if(!isMatch){
            return res.status(401).json({success:false,message:"password galat"})
        }

        const tokenData={userId: foundUser._id, role:foundUser.role,tenantId:foundUser.tenantId}
        const accessToken=jwt.sign(tokenData,process.env.JWT_ACCESS_SECRET,{expiresIn:'15m'})
        const refreshToken=await issueRefresh(tokenData)

        res.cookie('refreshToken',refreshToken,{
            ...cookieOpts,maxAge:7*24*60*60*1000
        })

        res.json({success:true,message:"Done hai",accessToken})
    }catch(error){
        console.log("Yha crash hua",error.stack)
        res.status(500).json({success:false,error:error.message})
    }
}

const refreshAccessToken=async(req,res)=>{
    try{
        const old=req.cookies.refreshToken
        if(!old) return res.status(401).json({success:false,message:'No Token'})

            let decoded
            try{decoded=jwt.verify(old,process.env.JWT_REFRESH_SECRET)}
            catch{return res.status(403).json({success:false,message:'Invalid Token'})}

            //atomic:sirf unsend token hi revoke hoga
            const record=await RefreshToken.findOneAndUpdate(
                {jti:decoded.jti,revoked:false},
                {revoked:true}
            )
            if(!record){
                //reuse detected:poori family kill
                await RefreshToken.updateMany({family:decoded.family},{revoked:true})
                res.clearCookie('refreshToken',cookieOpts)
                return res.status(403).json({success:false,message:'Token Reuse detected'})
            }

            const tokenData={userId:decoded.userId,role:decoded.role,tenantId:decoded.tenantId}
            const newRefresh=await issueRefresh(tokenData,decoded.family)
            const accessToken=jwt.sign(tokenData,process.env.JWT_ACCESS_SECRET,{expiresIn:'15m'})

            res.cookie('refreshToken',newRefresh,{...cookieOpts,maxAge:7*24*60*60*1000})
            res.json({success:true,accessToken})
        
    }catch(error){
        res.status(500).json({success:false,error:error.message})
    }
}

const logoutUser=async(req,res)=>{
    try{
        const token=req.cookies.refreshToken
        if(token){
            const decoded=jwt.decode(token)
            if(decoded?.family) await RefreshToken.updateMany({family:decoded.family},{revoked:true})
        }
    
    }catch(e){console.log(e)}
    res.clearCookie('refreshToken',cookieOpts)
    res.json({success:true,message:"Bahar nikal"})
}


module.exports={loginUser,refreshAccessToken,logoutUser}