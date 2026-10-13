const mainInventory = require('../models/Inventory')


const addInventory= async (req, res) => {
    try {
        const { productName, batchNo, category, quantity, expiryDate } = req.body
        if (!productName || !quantity || !expiryDate || !category || !batchNo) {
            return res.status(400).json({ success: false, error: "Data tu bharle madarchod" })
        }
        const bakchodi = new mainInventory(req.body)
        await bakchodi.save()
        res.json({ success: true, message: "Hogya Bhai" })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

const getInventory= async (req, res) => {
    try {
        const chodu = await mainInventory.find()
        const aajKiTarikh = new Date()
        const updatedInventory = chodu.map((item) => {
            const expiry = new Date(item.expiryDate)
            const timeDifference=expiry-aajKiTarikh
            const daysLeft=Math.ceil(timeDifference/(1000*60*60*24))

            let alertMsg="Abhi time hai"
            if(daysLeft<=3 && daysLeft>=0){
                alertMsg="Saman Chudne Wala hai"
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
    try {
        const lodo = await mainInventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.json({ success: true, data: chodu })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

const deleteInventory= async (req, res) => {
    await mainInventory.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "Done hai bro" })
}

module.exports={addInventory,getInventory,updateInventory,deleteInventory}
