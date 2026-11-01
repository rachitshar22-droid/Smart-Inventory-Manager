const mainInventory = require('../models/Inventory')

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
            if(daysLeft<=3 && daysLeft>=0){
                alertMsg="Saman expire hone Wala hai"
            }else if(daysLeft<0){
                alertMsg="Saman expire hogya"
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

module.exports={addInventory,getInventory,updateInventory,deleteInventory}
