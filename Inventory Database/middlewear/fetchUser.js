const jwt=require('jsonwebtoken')

const fetchUser=(req,res,next)=>{
    const authHeader=req.header('Authorization')
    const token=authHeader&&authHeader.split(' '[1])
    if(!token){
        return res.status(401).json({success:false,message:'Access nhi hai'})
    }
    try{
        const verifiedData=jwt.verify(token,process.env.JWT_ACCESS_SECRET)
        req.user=verifiedData
        next()
    }catch(error){
        res.status(401).json({success:false,message:"Invalid hai"})
    }
}
module.exports=fetchUser