const mongoose=require("mongoose")
const otpSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true,lowercase:true},
    otpHash:{type:String,required:true},
    attempts:{type:Number,default:0},
    expiresAt:{type:Date,rerquired:true,index:{expires:0}},
})
module.exports=mongoose.model("Otp",otpSchema)