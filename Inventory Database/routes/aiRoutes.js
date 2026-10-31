const express=require('express')
const router=express.Router()

const { scanProductImage } = require("../controller/aiController");

router.post("/scan",scanProductImage)
module.exports=router