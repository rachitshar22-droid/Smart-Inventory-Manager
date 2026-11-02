const mongoose=require('mongoose')
const resetSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    otpHash:String,
    attempts:{type:Number,default:0},
    expiresAt:{type:Date,index:{expires:0}}//TTL:expire hote hi autodelete
})
module.exports=mongoose.model('ResetOtp',resetSchema)