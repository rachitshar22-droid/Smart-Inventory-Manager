import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { useAuth } from "./AuthContext"

export default function DashBoard() {
  const { authFetch } = useAuth()
  const navigate = useNavigate()
  const [allData, setAllData] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    try {
      await authFetch(`http://localhost:3000/api/inventory/${id}`, {
        method: "DELETE",
      })
      setAllData(allData.filter((item) => item._id !== id))
    } catch (error) {
      console.log("Nhi hua Delete", error)
    }
  }

  const fetchData = async () => {
    try {
      const response = await authFetch('http://localhost:3000/api/inventory', {
        method: 'GET',
      })
      const data = await response.json()

      if (data.success) {
        setAllData(data.data)
      }
    } catch (error) {
      console.log("failed", error)
    }
  } //When the war is over we finally get married and earth will grow flowers like you and your womb will carry the most beautiful girl in the universe

  // --- Backend Driven Smart Metrics ---
  const activeBatches = allData.filter(item => item.daysRemaining >= 0)
  const expiringSoonBatches = allData.filter(item => item.daysRemaining <= 30 && item.daysRemaining >= 0)
  const expiredBatches = allData.filter(item => item.daysRemaining < 0)
  const totalActiveUnits = activeBatches.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0)

  const filteredData = allData.filter(item =>
    item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.batchNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0A0F1E] p-4 sm:p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[12px] font-bold tracking-widest text-amber-400">DUKAAN • STOCK</p>
            <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight leading-none mt-1">
              Mera Stock
            </h1>
            <p className="text-[13px] text-slate-400 mt-1.5">Sab kuch ek nazar me, kya bacha hai, kya khatam ho raha hai.</p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => navigate('/addstock')}
              className="flex-1 sm:flex-none bg-amber-400 hover:bg-amber-300 text-black text-[14px] font-bold px-5 py-3 rounded-xl cursor-pointer"
            >
              + Add Stock
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div className="bg-[#121A2E] border border-slate-800 rounded-2xl p-4 sm:p-5">
            <p className="text-[12px] font-semibold text-slate-400">Active Batches</p>
            <p className="text-[32px] sm:text-[36px] font-extrabold leading-none mt-2">{activeBatches.length} <span className="text-[14px] font-medium text-slate-500">/ {allData.length}</span></p>
            <p className="text-[12px] text-slate-500 mt-2">Total batches</p>
          </div>

          <div className="bg-[#121A2E] border border-slate-800 rounded-2xl p-4 sm:p-5">
            <p className="text-[12px] font-semibold text-slate-400">Total Units</p>
            <p className="text-[32px] sm:text-[36px] font-extrabold leading-none mt-2 text-emerald-400">{totalActiveUnits.toLocaleString()}</p>
            <p className="text-[12px] text-slate-500 mt-2">Abhi bechne ke liye</p>
          </div>

          {/* Needs Attention - Ab sahi chalega */}
          <div
            onClick={() => navigate('/expiringsoon')}
            className="col-span-2 lg:col-span-1 bg-[#1A150A] border border-amber-500/40 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-amber-400 transition-all"
          >
            <div className="flex justify-between items-center">
              <p className="text-[12px] font-bold tracking-wide text-amber-300">⚠ DHYAAN DO</p>
              <span className="text-[12px] font-bold bg-amber-400 text-black px-2.5 py-1 rounded-full">Dekho →</span>
            </div>
            <div className="flex gap-7 mt-3">
              <div>
                <p className="text-[28px] font-extrabold leading-none text-amber-400">{expiringSoonBatches.length}</p>
                <p className="text-[12px] text-amber-200/80 mt-1">30 din me expire</p>
              </div>
              <div className="w-px bg-amber-500/20" />
              <div>
                <p className="text-[28px] font-extrabold leading-none text-red-400">{expiredBatches.length}</p>
                <p className="text-[12px] text-red-300/80 mt-1">Expire ho gaya</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#121A2E] border border-slate-800 border-b-0 rounded-t-2xl px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[15px] font-bold">All Batches <span className="text-[12px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full ml-1">{filteredData.length}</span></p>
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Dawa, batch dhoondho..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-amber-400 rounded-xl pl-10 pr-3 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* List */}
        <div className="bg-[#121A2E] border border-slate-800 rounded-b-2xl overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[15px] font-semibold">Kuch nahi mila</p>
              <p className="text-[13px] text-slate-400 mt-1">+ Add Stock dabake pehla maal daalo.</p>
            </div>
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#0F1626] border-b border-slate-800 text-[12px] font-semibold text-slate-400">
                      <th className="py-3.5 px-5">Product</th><th className="py-3.5 px-3">Category</th><th className="py-3.5 px-3">Batch</th><th className="py-3.5 px-3">Quantity</th><th className="py-3.5 px-3">Expiry</th><th className="py-3.5 px-3">Status</th><th className="py-3.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-[14px]">
                    {filteredData.map((stock) => {
                      const isExpired = stock.daysRemaining < 0
                      const isExpiringSoon = stock.daysRemaining <= 30 && stock.daysRemaining >= 0
                      return (
                        <tr key={stock._id} className="hover:bg-[#16203A]/60">
                          <td className="py-4 px-5 font-bold text-[15px]">{stock.productName}</td>
                          <td className="py-4 px-3"><span className="text-[12px] font-semibold bg-slate-800 text-slate-200 px-2.5 py-1 rounded-full">{stock.category}</span></td>
                          <td className="py-4 px-3 font-mono text-slate-300">#{stock.batchNo}</td>
                          <td className="py-4 px-3 font-bold">{stock.quantity} <span className="text-[12px] font-normal text-slate-400">units</span></td>
                          <td className="py-4 px-3 text-slate-300">{stock.expiryDate ? stock.expiryDate.split('T')[0].split('-').reverse().join('-') : 'N/A'}</td>
                          <td className="py-4 px-3">
                            <span className={`inline-flex text-[12px] font-bold px-2.5 py-1 rounded-full ${isExpired ? "bg-red-500/15 text-red-400" : isExpiringSoon ? "bg-amber-400/15 text-amber-300" : "bg-emerald-500/15 text-emerald-400"}`}>
                              {isExpired ? `Expired • ${Math.abs(stock.daysRemaining)} din pehle` : isExpiringSoon ? `Expire hone wala • ${stock.daysRemaining} din bache` : "In Stock"}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="inline-flex gap-2">
                              <button onClick={() => navigate('/addstock', { state: { editData: stock } })} className="bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-lg font-semibold text-[13px] cursor-pointer">Edit</button>
                              <button onClick={() => handleDelete(stock._id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-1.5 rounded-lg font-semibold text-[13px] cursor-pointer">Delete</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="md:hidden divide-y divide-slate-800">
                {filteredData.map((stock) => {
                  const isExpired = stock.daysRemaining < 0
                  const isExpiringSoon = stock.daysRemaining <= 30 && stock.daysRemaining >= 0
                  return (
                    <div key={stock._id} className="p-4">
                      <div className="flex justify-between gap-2">
                        <div><h3 className="font-bold text-[16px] leading-tight">{stock.productName}</h3><p className="text-[12px] text-slate-400 mt-1">{stock.category} • #{stock.batchNo}</p></div>
                        <span className={`shrink-0 h-fit text-[12px] font-bold px-2.5 py-1 rounded-full ${isExpired ? "bg-red-500/15 text-red-400" : isExpiringSoon ? "bg-amber-400/15 text-amber-300" : "bg-emerald-500/15 text-emerald-400"}`}>
                          {isExpired ? "Expired" : isExpiringSoon ? `${stock.daysRemaining}d bache` : "In Stock"}
                        </span>
                      </div>
                      <div className="flex justify-between bg-[#0A0F1E] rounded-xl px-3 py-2.5 mt-3 text-[13px] border border-slate-800">
                        <span className="text-slate-400">Qty: <b className="text-white">{stock.quantity}</b></span>
                        <span className="text-slate-400">Expiry: <b className="text-white">{stock.expiryDate ? stock.expiryDate.split('T')[0].split('-').reverse().join('-') : 'N/A'}</b></span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => navigate('/addstock', { state: { editData: stock } })} className="flex-1 py-2.5 bg-slate-800 rounded-xl font-semibold text-[14px]">Edit</button>
                        <button onClick={() => handleDelete(stock._id)} className="px-5 py-2.5 bg-red-500/10 text-red-400 rounded-xl font-semibold text-[14px]">Delete</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}