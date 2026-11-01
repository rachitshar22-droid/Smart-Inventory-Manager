const mongoose=require('mongoose')
const userScheama=new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true,lowercase:true},
    tenantId:{type:String,required:true,index:true},//index:true se searching tezz hoti
    role:{type:String, enum:['User','Admin'],default:'User'}
},{timestamps:true})
module.exports=mongoose.model("User",userScheama)