const mongoose=require('mongoose')
const userScheama=new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String, enum:['User','Admin'],default:'Admin'}
},{timestamps:true})
module.exports=mongoose.model("User",userScheama)