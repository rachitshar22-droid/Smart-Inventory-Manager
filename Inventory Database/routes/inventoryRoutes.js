const express=require('express')
const router=express.Router()
const{addInventory,getInventory,updateInventory,deleteInventory}=require('../controller/inventoryController')
router.post('/',addInventory)
router.get('/',getInventory)
router.put('/:id',updateInventory)
router.delete('/:id',deleteInventory)
module.exports=router