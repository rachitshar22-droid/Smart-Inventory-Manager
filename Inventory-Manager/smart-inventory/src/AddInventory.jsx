import { useState,useEffect} from "react"
import { useLocation,useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"


export default function AddInventory() {
    const {accessToken}=useAuth()
    const navigate=useNavigate()
    const location=useLocation()
    const [productName, setProductName] = useState("")
    const [batchNo, setBatchNo] = useState("")
    const [category, setCategory] = useState("")
    const [quantity, setQuantity] = useState("")
    const [expiryDate, setExpiryDate] = useState("")

    const editData=location.state?.editData||null

    useEffect(()=>{
        if(editData){
            setProductName(editData.productName)
            setBatchNo(editData.batchNo)
            setCategory(editData.category)
            setQuantity(editData.quantity)
            setExpiryDate(editData.expiryDate)
        }
    },[editData])

    const handleSubmit =async (e) => {
        e.preventDefault()
        const newData = { productName, batchNo, category, quantity, expiryDate }
        try {
            if(editData){
                const response=await fetch(`http://localhost:3000/api/inventory/${editData._id}`,{
                    method:"PUT",
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${accessToken}`
                    },
                    body:JSON.stringify(newData)
                })
                console.log("Updated successFully")
                alert("Done Hogya")
            }else{
            const response = await fetch('http://localhost:3000/api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${accessToken}`
                },
                body:JSON.stringify(newData)
            })
            const result = await response.json()
            console.log('Hogya Gandu', result)
        }
        navigate('/dashboard')
        } catch (error) {
            console.log("Submit mai error",error)
        }
        setProductName("")
        setBatchNo("")
        setCategory("")
        setQuantity("")
        setExpiryDate("")
    }

    return (
        <div className="flex flex-col gap-5 max-w-md mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
            <h1 className="text-3xl font-extrabold text-center text-gray-900">{editData?"Update Stock":"Add New Stock"}</h1>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
            <input className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" type="text" placeholder="Batch Number" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
            <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={category} onChange={(e) => setCategory(e.target.value)} style={{ margin: "10px", padding: "5px" }}>
                <option value=''>Select Category</option>
                <option value='Medicine'>Medicine</option>
                <option value='Grocery'>Grocery</option>
                <option value='Cosmatics'>Cosmatics</option>
            </select>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" type="text" placeholder="Stock Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <input className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" type="date" placeholder="Expiry Date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            <button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-colors mt-4" onClick={handleSubmit}>{editData?"Update Stock":"Add Stock"}</button>
        </div>
    )
}