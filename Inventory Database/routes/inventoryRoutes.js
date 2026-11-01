const express=require('express')
const router=express.Router()
const{addInventory,getInventory,updateInventory,deleteInventory}=require('../controller/inventoryController')
const fetchUser=require('../middlewear/fetchUser')

router.use(fetchUser)

router.post('/',addInventory)
router.get('/',getInventory)
router.put('/:id',updateInventory)
router.delete('/:id',deleteInventory)
module.exports=router