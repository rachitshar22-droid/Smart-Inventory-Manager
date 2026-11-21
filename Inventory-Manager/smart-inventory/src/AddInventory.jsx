import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

export default function AddInventory() {
  const { authFetch } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [productName, setProductName] = useState("")
  const [batchNo, setBatchNo] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [isScanning, setIsScanning] = useState(false)

  const editData = location.state?.editData || null

  useEffect(() => {
    if (editData) {
      setProductName(editData.productName)
      setBatchNo(editData.batchNo)
      setCategory(editData.category)
      setQuantity(editData.quantity)
      setExpiryDate(editData.expiryDate)
    }
  }, [editData])

  const handleImageScan = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsScanning(true)
    const reader = new FileReader()

    reader.onloadend = async () => {
      const base64String = reader.result
      try {
        const response = await authFetch("http://localhost:3000/api/ai/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64: base64String })
        })
        const aiData = await response.json()
        if (!response.ok) {
          throw new Error(aiData.error || "AI api phat gya")
        }

        setProductName(aiData.productName || "")
        setBatchNo(aiData.batchNo || "")
        setExpiryDate(aiData.expiryDate || "")
        console.log("AI Data Extracted:", aiData)
      } catch (error) {
        console.error("Scanner Error:", error)
        alert("Bhai kuch gadbad hai: " + error.message)
      } finally {
        setIsScanning(false)
        e.target.value = ""
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newData = { productName, batchNo, category, quantity, expiryDate }
    try {
      if (editData) {
        const response = await authFetch(`http://localhost:3000/api/inventory/${editData._id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData)
        })
        if (!response.ok) {
          const err = await response.json()
          alert(err.error || err.message || 'Update Failed')
          return
        }
        console.log("Updated successFully")
        alert("Done Hogya")
      } else {
        const response = await authFetch('http://localhost:3000/api/inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData)
        })
        if (!response.ok) {
          const err = await response.json()
          alert(err.error || err.message || 'Add Failed')
          return
        }
        const result = await response.json()
        console.log('Hogya bhai', result)
      }
      navigate('/dashboard')
    } catch (error) {
      console.log("Submit mai error", error)
    }
    setProductName("")
    setBatchNo("")
    setCategory("")
    setQuantity("")
    setExpiryDate("")
  }

 return (
    <div className="min-h-screen bg-[#0A0F1E] p-3 sm:p-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-[#121A2E] border border-slate-800 p-4 sm:p-5 rounded-2xl text-white">
        
        {/* Header - Chhota kar diya */}
        <div className="text-center border-b border-slate-800 pb-3 mb-3">
          <p className="text-[11px] font-bold tracking-widest text-amber-400">DUKAAN • STOCK</p>
          <h1 className="text-[22px] font-extrabold tracking-tight leading-tight mt-0.5">
            {editData ? "Stock Update Karo" : "Naya Maal Daalo"}
          </h1>
        </div>

        {/* Scanner - Chhota */}
        <label className={`flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl font-bold text-[13px] cursor-pointer border mb-3 ${
          isScanning ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-black hover:bg-slate-100'
        }`}>
          <span>{isScanning ? "Bill padh raha hu..." : "📸 Bill ki Photo se Bharo"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageScan} disabled={isScanning} />
        </label>

        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Naam - Full */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-200 mb-1">Dawa / Maal ka Naam</label>
            <input
              className="w-full px-3 py-2.5 rounded-lg bg-[#0A0F1E] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-[14px]"
              type="text"
              placeholder="e.g. Paracetamol 500mg"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* 2-2 Ek Line Me */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-200 mb-1">Batch Number</label>
              <input
                className="w-full px-3 py-2.5 rounded-lg bg-[#0A0F1E] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-[14px]"
                type="text"
                placeholder="e.g. A-102"
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-200 mb-1">Category</label>
              <select
                className="w-full px-3 py-2.5 rounded-lg bg-[#0A0F1E] border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" className="bg-[#0A0F1E]">Select</option>
                <option value="Medicine" className="bg-[#0A0F1E]">Medicine</option>
                <option value="Grocery" className="bg-[#0A0F1E]">Grocery</option>
                <option value="Cosmatics" className="bg-[#0A0F1E]">Cosmatics</option>
              </select>
            </div>
          </div>

          {/* Quantity + Expiry Ek Line Me */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-200 mb-1">Kitne Piece?</label>
              <input
                className="w-full px-3 py-2.5 rounded-lg bg-[#0A0F1E] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-[14px]"
                type="text"
                placeholder="e.g. 500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-200 mb-1">Kab Expire Hoga?</label>
              <input
                className="w-full px-3 py-2.5 rounded-lg bg-[#0A0F1E] border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-[14px] scheme-dark"
                type="date"
                value={expiryDate ? expiryDate.split('T')[0] : ''}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-xl text-[14px] mt-1 cursor-pointer"
          >
            {editData ? "Update Karo" : "+ Stock Me Daalo"}
          </button>
        </form>

      </div>
    </div>
  )
}