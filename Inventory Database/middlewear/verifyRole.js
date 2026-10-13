const verifyRole=(allowedRoles)=>{
    return(req,res,next)=>{
        if(!req.user||!req.user.role){
            return res.status(401).json({success:false,message:"Role kha hai"})
        }
        if(allowedRoles.includes(req.user.role)){
            next()
        }else{
            res.status(403).json({success:false,message:"Admin only tu gand mara"})
        }
    }
}
module.exports=verifyRole