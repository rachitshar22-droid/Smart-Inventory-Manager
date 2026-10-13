const mainUser=require("../models/User")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const signUpUser=async(req,res)=>{
    try{
        const{username,password}=req.body
        if(!username||!password){
            return res.status(400).json({success:false,message:"username password kha hai"})
        }
        const salt=await bcrypt.genSalt(10)
        const hashesdPassword=await bcrypt.hash(password,salt)
        const newUser=new mainUser({
            username:username,
            password:hashesdPassword
        })
        await newUser.save()
        res.json({success:true,message:"Hogya hash"})
    }catch(error){
        res.status(500).json({success:false,error:error.message})
    }
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

        const tokenData={userId: foundUser._id, role:foundUser._role}
        const accessToken=jwt.sign(tokenData,process.env.JWT_ACCESS_SECRET,{expiresIn:'15m'})
        const refreshToken=jwt.sign(tokenData,process.env.JWT_REFRESH_SECRET,{expiresIn:'7d'})

        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:'lax',
            maxAge:7*24*60*60*1000
        })

        res.json({success:true,message:"Done hai",accessToken})
    }catch(error){
        console.log("Yha crash hua",error.stack)
        res.status(500).json({success:false,error:error.message})
    }
}

const refreshAccessToken=(req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken
        if(!refreshToken){
            return res.status(401).json({success:false,message:"Refresh token hi nhi hai"})
        }

        jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET,(err,decoded)=>{
            if(err){
                return res.status(403).json({success:false,message:"Token expired/invalid hai"})
            }
            const newAccessToken=jwt.sign({userId:decoded.userId,role:decoded.role},process.env.JWT_ACCESS_SECRET,{expiresIn:'15m'})
            res.json({success:true,accessToken:newAccessToken})
        })
    }catch(error){
        res.status(500).json({success:false,error:error.message})
    }
}

const logoutUser=(req,res)=>{
    res.clearCookie('refreshToken',{
        httpOnly:true,
        sameSite:'lax'
    })
    res.json({success:true,message:"Bahar nikal"})
}


module.exports={loginUser,signUpUser,refreshAccessToken,logoutUser}