const mainInventory = require('../models/Inventory')
const Customer=require('../models/Customer')

const addInventory= async (req, res) => {
    try {
        const { productName, batchNo, category, quantity, expiryDate } = req.body
        if (!productName || !quantity || !expiryDate || !category || !batchNo) {
            return res.status(400).json({ success: false, error: "Data tu bharle " })
        }
        const newItem = new mainInventory({productName,batchNo,category,quantity,expiryDate,tenantId:req.user.tenantId,})
        await newItem.save()
        res.json({ success: true, message: "Hogya Bhai" })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

const getInventory= async (req, res) => {
    try {
        const data = await mainInventory.find({tenantId: req.user.tenantId})
        //console.log('TENAT:',req.user.tenantId,'COUNT:',data.length)
        const aajKiTarikh = new Date()
        const updatedInventory = data.map((item) => {
            const expiry = new Date(item.expiryDate)
            const timeDifference=expiry-aajKiTarikh
            const daysLeft=Math.ceil(timeDifference/(1000*60*60*24))

            let alertMsg="Abhi time hai"
            if(daysLeft<=30 && daysLeft>=0){
                alertMsg="Product is expiring soon"
            }else if(daysLeft<0){
                alertMsg="Expired"
            }
            return{
                ...item._doc,
                daysRemaining:daysLeft,
                status:alertMsg
            }
        })
        res.json({success:true,data:updatedInventory})
    }catch(error){
        res.status(500).json({ success: false, error: error.message })
    }
}

const updateInventory= async (req, res) => {
    const allowed=['productName','batchNo','category','quantity','expiryDate']
    const updates={}
    allowed.forEach((k)=>{if(req.body[k]!==undefined)updates[k]=req.body[k]})
    try {
        const update = await mainInventory.findByIdAndUpdate(
            {_id:req.params.id,tenantId:req.user.tenantId},
            updates,
            { new: true }
        )
        if(!update) return res.status(404).json({success:false,message:'Item nhi mila'})
        res.json({ success: true, data: update })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

const deleteInventory= async (req, res) => {
    try{
        const deleted=await mainInventory.findOneAndDelete({
            _id:req.params.id,tenantId:req.user.tenantId,
        })
        if(!deleted) return res.status(404).json({success:false,message:'Item nhi mila'})
            res.json({success:true,message:'Done hai bro'})
    }catch(error){
        res.status(500).json({success:false,error:error.message})
    }
}

const addCustomer=async(req,res)=>{
    try{
        const {name,totalAmount,address,phone}=req.body
        if(!name||!phone||!address||!totalAmount){
            return res.status(400).json({success:false,message:"All fields are mandatory"})
        }
        if(!/^[6-9]\d{9}$/.test(phone)){
            return res.status(400).json({success:false,message:'Phone Number should be 10 digit'})
        }
        const customer=await Customer.create({
            name,totalAmount,address,phone,tenantId:req.user.tenantId
        })
        res.status(201).json({success:true,data:customer})
    }catch(error){
        console.log(error)
        res.status(500).json({success:false,error:error.message})
    }
}

const getCustomers=async(req,res)=>{
    try{
    const customers=await Customer.find({tenantId:req.user.tenantId})
    res.json({success:true,data:customers})
    }catch(error){
        console.log(error)
        res.status(500).json({success:false,error:error.message})
    }
}

const updateCustomer = async (req, res) => {
  try {
    const allowed = ['name', 'totalAmount', 'address', 'phone']
    const updates = {}
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k]
    })

    if (updates.phone !== undefined && !/^[6-9]\d{9}$/.test(updates.phone)) {
      return res.status(400).json({ success: false, message: 'Phone Number should be 10 digit' })
    }
    if (updates.totalAmount !== undefined && (updates.totalAmount === '' || Number(updates.totalAmount) < 0)) {
      return res.status(400).json({ success: false, message: 'Amount galat hai' })
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      updates,
      { new: true, runValidators: true }
    )
    if (!customer) return res.status(404).json({ success: false, message: 'Customer nahi mila' })

    res.json({ success: true, data: customer })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error.message })
  }
}

const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user.tenantId
    })
    if (!deleted) return res.status(404).json({ success: false, message: 'Customer nahi mila' })

    res.json({ success: true, message: 'Customer delete ho gaya' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error.message })
  }
}

module.exports={addInventory,getInventory,updateInventory,deleteInventory,addCustomer,getCustomers,updateCustomer,deleteCustomer}
