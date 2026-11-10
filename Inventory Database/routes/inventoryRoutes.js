const express=require('express')
const router=express.Router()
const{addInventory,getInventory,updateInventory,deleteInventory, addCustomer, getCustomers,updateCustomer,deleteCustomer}=require('../controller/inventoryController')
const fetchUser=require('../middlewear/fetchUser')

router.use(fetchUser)

router.post('/',fetchUser,addInventory)
router.get('/',fetchUser,getInventory)
router.post('/customers',fetchUser,addCustomer)
router.get('/customers',fetchUser,getCustomers)
router.put('/customers/:id',fetchUser,updateCustomer)
router.delete('/customers/:id',fetchUser,deleteCustomer)
router.put('/:id',fetchUser,updateInventory)
router.delete('/:id',fetchUser,deleteInventory)
module.exports=router