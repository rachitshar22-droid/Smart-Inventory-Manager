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
    <div className="min-h-screen bg-[#050b1a] p-4 sm:p-6 md:p-10 flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Silicon Valley Ambient Background Glows */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-blue-600/15 blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg bg-[#0b1736]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl rounded-3xl border border-blue-900/60 flex flex-col gap-5 text-slate-100">
        
        {/* Header Section */}
        <div className="text-center border-b border-blue-900/50 pb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-950/80 border border-cyan-500/30 mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-300 font-semibold">
              Telemetry Input Node
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {editData ? "Update Stock Batch" : "Initialize New Stock"}
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">ENTER BATCH METADATA & EXPIRATION TIMELINE</p>
        </div>

        {/* AI Scanner Button */}
        <div className="flex flex-col gap-1.5">
          <label className={`flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-2xl font-mono font-bold text-xs uppercase tracking-wider cursor-pointer transition-all border ${
            isScanning 
              ? 'bg-blue-950/50 text-slate-400 border-blue-800/40' 
              : 'bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-600/25 border-cyan-400/30'
          }`}>
            <span>{isScanning ? "🤖 AI OCR Engine Analyzing..." : "📸 Auto-Fill via AI Bill Scan"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageScan} disabled={isScanning} />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Product Name */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold pl-1">Product Name</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-[#050b1a]/90 border border-blue-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-mono transition-all"
              type="text"
              placeholder="e.g. Paracetamol 500mg"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* Batch Number */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold pl-1">Batch Identifier</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-[#050b1a]/90 border border-blue-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-mono transition-all"
              type="text"
              placeholder="e.g. BATCH-9942"
              value={batchNo}
              onChange={(e) => setBatchNo(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold pl-1">Inventory Class</label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-[#050b1a]/90 border border-blue-900/80 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-mono transition-all"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" className="bg-[#050b1a]">Select Category</option>
              <option value="Medicine" className="bg-[#050b1a]">Medicine</option>
              <option value="Grocery" className="bg-[#050b1a]">Grocery</option>
              <option value="Cosmatics" className="bg-[#050b1a]">Cosmatics</option>
            </select>
          </div>

          {/* Stock Quantity */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold pl-1">Unit Volume</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-[#050b1a]/90 border border-blue-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-mono transition-all"
              type="text"
              placeholder="e.g. 500"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Expiry Date */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold pl-1">
              Shelf-Life Expiry Date
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-[#050b1a]/90 border border-blue-900/80 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs font-mono transition-all"
              type="date"
              value={expiryDate ? expiryDate.split('T')[0] : ''}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer text-xs border border-cyan-400/30 mt-2"
          >
            {editData ? "⚡ Update Batch Protocol" : "⚡ Initialize Batch Record"}
          </button>
        </form>

      </div>
    </div>
  )
}