import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { API_URL } from "./config"

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
        const response = await authFetch(`${API_URL}/api/ai/scan`, {
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
        const response = await authFetch(`${API_URL}/api/inventory/${editData._id}`, {
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
        const response = await authFetch(`${API_URL}/api/inventory`, {
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
    <div className="min-h-screen bg-white sm:bg-slate-50 px-4 py-5 sm:py-8 text-slate-900">
      <div className="w-full max-w-xl mx-auto sm:bg-white sm:border sm:border-slate-200/80 sm:p-7 sm:rounded-2xl sm:shadow-sm">
        
        {/* Header - Left aligned, clean */}
        <div className="mb-5">
          
          <h1 className="text-[26px] sm:text-[28px] font-extrabold tracking-tight leading-tight text-slate-900 mt-1">
            {editData ? "Update Stock" : "Add New Stock!"}
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Scan a photo of the bill or enter the details below
          </p>
        </div>

        {/* AI Bill Scanner Card */}
        <label
          className={`flex items-center gap-3.5 w-full p-3.5 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
            isScanning
              ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-wait'
              : 'bg-slate-50 hover:bg-blue-50/50 border-slate-300 hover:border-blue-400 active:scale-[0.99]'
          }`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs border ${
            isScanning ? 'bg-slate-200 border-slate-300 text-slate-500' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-[14px] font-bold text-slate-900 leading-tight">
              {isScanning ? "Reading the bill..." : "Fill in using a photo of the bill"}
            </p>
            
          </div>
          {!isScanning && (
            <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg shrink-0">
              Scan
            </span>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageScan} disabled={isScanning} />
        </label>

        {/* Clean Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[11px] font-bold tracking-wider text-slate-400">Fill it yourself</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Product Name */}
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Product Name</label>
            <input
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-base sm:text-[14px] font-medium focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
              type="text"
              placeholder="e.g. Paracetamol 500mg"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* Batch + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Batch Number</label>
              <input
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-base sm:text-[14px] font-medium focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
                type="text"
                placeholder="e.g. A-102"
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Category</label>
              <select
                className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-[14px] font-medium focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Medicine">Medicine</option>
                <option value="Grocery">Grocery</option>
                <option value="Cosmatics">Cosmetics</option>
              </select>
            </div>
          </div>

          {/* Quantity + Expiry */}
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Quantity?</label>
              <input
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-base sm:text-[14px] font-medium focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Expiry Date?</label>
              <input
                className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-[14px] font-medium focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
                type="date"
                value={expiryDate ? expiryDate.split('T')[0] : ''}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-[15px] shadow-sm transition-all cursor-pointer mt-2"
          >
            {editData ? "Update it" : "+ Add to stock"}
          </button>
        </form>

      </div>
    </div>
  )
}