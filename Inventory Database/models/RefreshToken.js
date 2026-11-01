// const mongoose=require('mongoose')
// const tokenSchema=new mongoose.Schema({
//     userId:String,
//     family:String, //A,B,C ek hi family mtlb 1 hi login session mai bne
//     jti:{type:String,required:true},//refresh token ka unique id
//     revoked:{type:Boolean,default:false}, //purana token deke new milta toh purana expire hojata 
//     expiresAt:{type:Date,index:{expires:0}}//wohi TTL,purana khud delete
// })
// module.exports=mongoose.model('RefreshToken',tokenSchema)