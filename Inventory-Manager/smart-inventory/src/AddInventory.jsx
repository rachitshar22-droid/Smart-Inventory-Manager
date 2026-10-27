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
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 p-8 shadow-2xl rounded-2xl border border-slate-800 flex flex-col gap-5">
        <div className="text-center border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {editData ? "Update Stock" : "Add New Stock"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">Enter batch details and expiration timeline</p>
        </div>

        <input
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <input
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          type="text"
          placeholder="Batch Number"
          value={batchNo}
          onChange={(e) => setBatchNo(e.target.value)}
        />

        <select
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Medicine">Medicine</option>
          <option value="Grocery">Grocery</option>
          <option value="Cosmatics">Cosmatics</option>
        </select>

        <input
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          type="text"
          placeholder="Stock Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Expiry Date (DD-MM-YYYY)
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            type="date"
            placeholder="Expiry Date"
            value={expiryDate ? expiryDate.split('T')[0] : ''}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors mt-2 cursor-pointer text-sm"
          onClick={handleSubmit}
        >
          {editData ? "Update Stock" : "Add Stock"}
        </button>
      </div>
    </div>
  )
}