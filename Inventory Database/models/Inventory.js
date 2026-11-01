const mongoose=require("mongoose")
const inventorySchema=new mongoose.Schema({
    productName: {type:String,required:true},
    batchNo: {type:String,required:true},
    category: {type:String,required:true},
    quantity: {type:String,required:true},
    expiryDate: {type:Date,required:true},
    alertSent:{type:Boolean,default:false},
     tenantId:{type:String,required:true,index:true},//index:true se searching tezz hoti
})
module.exports=mongoose.model("Inventory",inventorySchema)