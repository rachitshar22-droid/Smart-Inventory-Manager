import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { useAuth } from "./AuthContext"

export default function DashBoard() {
  const { authFetch, setAccessToken } = useAuth()
  const navigate = useNavigate()
  const [allData, setAllData] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      await authFetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
      })
      setAccessToken(null)
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

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
  const expiringSoonBatches = allData.filter(item => item.daysRemaining <= 3 && item.daysRemaining >= 0)
  const expiredBatches = allData.filter(item => item.daysRemaining < 0)
  const totalActiveUnits = activeBatches.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0)

  const filteredData = allData.filter(item =>
    item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.batchNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#050b1a] p-4 sm:p-6 md:p-8 text-slate-100 relative overflow-hidden">
      
      {/* Silicon Valley Ambient Glows (Matching Login Page) */}
      <div className="fixed -top-32 -right-32 w-96 h-96 bg-blue-600/15 blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top Command Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-blue-900/50">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-950/80 border border-cyan-500/30 mb-2.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                Multi-Tenant Isolated
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Inventory <span className="text-[#00b4ff]">Command</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              REAL-TIME BATCH LEDGER & SHELF-LIFE TELEMETRY
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/addstock')}
              className="flex-1 sm:flex-initial justify-center bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/25 border border-cyan-400/30"
            >
              <span>+ New Batch</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#0b1736]/90 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-blue-800/60 hover:border-rose-500/50 transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Silicon Valley Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          
          {/* Metric 1: Active Batches */}
          <div className="bg-[#0b1736]/70 backdrop-blur-xl border border-blue-800/50 border-t-2 border-t-[#00b4ff] rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-slate-300 font-semibold">Valid Active Batches</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">[01]</span>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{activeBatches.length}</span>
              <span className="text-xs font-mono text-slate-400">/ {allData.length} total</span>
            </div>
          </div>

          {/* Metric 2: Active Volume */}
          <div className="bg-[#0b1736]/70 backdrop-blur-xl border border-blue-800/50 border-t-2 border-t-emerald-400 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-slate-300 font-semibold">Sellable Volume</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">[02]</span>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                {totalActiveUnits.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-slate-400 uppercase">Units</span>
            </div>
          </div>

          {/* Metric 3: Risk Radar */}
          <div
            onClick={() => navigate('/expiringsoon')}
            className={`sm:col-span-2 lg:col-span-1 bg-[#0b1736]/70 backdrop-blur-xl border border-blue-800/50 border-t-2 rounded-2xl p-5 shadow-xl relative transition-all cursor-pointer hover:bg-[#0f214a]/80 ${
              expiredBatches.length > 0
                ? "border-t-rose-500"
                : expiringSoonBatches.length > 0
                ? "border-t-amber-400"
                : "border-t-blue-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-slate-300 font-semibold">Shelf-Life Threat Radar</span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-md font-bold">VIEW →</span>
            </div>
            <div className="flex items-center gap-4 mt-3 font-mono">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-extrabold ${expiringSoonBatches.length > 0 ? "text-amber-400" : "text-slate-500"}`}>
                  {expiringSoonBatches.length}
                </span>
                <span className="text-[10px] uppercase text-slate-400">Expiring</span>
              </div>
              <span className="text-blue-800">/</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-extrabold ${expiredBatches.length > 0 ? "text-rose-500" : "text-slate-500"}`}>
                  {expiredBatches.length}
                </span>
                <span className="text-[10px] uppercase text-slate-400">Dead</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger Control Bar */}
        <div className="bg-[#0b1736]/80 backdrop-blur-xl border border-b-0 border-blue-800/60 rounded-t-2xl px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00b4ff] shadow-[0_0_8px_#00b4ff]"></span>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">Master Batch Ledger</span>
            <span className="text-[11px] font-mono bg-blue-950/90 text-cyan-300 px-2 py-0.5 rounded-md border border-blue-800/80">
              {filteredData.length} ROWS
            </span>
          </div>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="SEARCH PRODUCT, BATCH, CATEGORY..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050b1a]/90 border border-blue-800/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 rounded-xl pl-8 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
            />
            <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Data Container (Responsive: Cards on Mobile, Table on Desktop) */}
        <div className="bg-[#0b1736]/60 backdrop-blur-xl border border-blue-800/60 rounded-b-2xl shadow-2xl overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="p-12 text-center font-mono">
              <p className="text-xs uppercase tracking-widest text-slate-300">No Inventory Records Found</p>
              <p className="text-[11px] text-slate-500 mt-1">Click "+ New Batch" to initialize stock.</p>
            </div>
          ) : (
            <>
              {/* ================= DESKTOP TABLE VIEW (md and up) ================= */}
              <div className="hidden md:block w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#060d21]/90 border-b border-blue-800/60 text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">
                      <th className="py-3.5 px-5">Product</th>
                      <th className="py-3.5 px-3">Category</th>
                      <th className="py-3.5 px-3">Batch ID</th>
                      <th className="py-3.5 px-3">Quantity</th>
                      <th className="py-3.5 px-3">Expiry</th>
                      <th className="py-3.5 px-3">Telemetry Status</th>
                      <th className="py-3.5 px-5 text-right">Command</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/40 text-xs">
                    {filteredData.map((stock) => {
                      const isExpired = stock.daysRemaining < 0
                      const isExpiringSoon = stock.daysRemaining <= 3 && stock.daysRemaining >= 0

                      return (
                        <tr
                          key={stock._id}
                          className={`transition-colors ${
                            isExpired
                              ? "bg-rose-950/20 hover:bg-rose-950/35"
                              : isExpiringSoon
                              ? "bg-amber-950/20 hover:bg-amber-950/35"
                              : "hover:bg-blue-900/25"
                          }`}
                        >
                          <td className="py-3.5 px-5 font-bold text-white tracking-tight">
                            {stock.productName}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="text-[10px] font-mono uppercase tracking-widest font-bold bg-blue-950/80 text-cyan-300 border border-blue-700/50 px-2.5 py-1 rounded-md">
                              {stock.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-300">
                            <span className="bg-[#050b1a] px-2.5 py-1 rounded-md border border-blue-900/60 text-[11px]">
                              {stock.batchNo}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                            {stock.quantity} <span className="text-[10px] font-normal text-slate-400">UNITS</span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px]">
                            {stock.expiryDate ? stock.expiryDate.split('T')[0].split('-').reverse().join('-') : 'N/A'}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                  isExpired
                                    ? "bg-rose-950/70 text-rose-400 border-rose-500/40"
                                    : isExpiringSoon
                                    ? "bg-amber-950/70 text-amber-300 border-amber-500/40"
                                    : "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  isExpired ? "bg-rose-500" : isExpiringSoon ? "bg-amber-400 animate-ping" : "bg-emerald-400"
                                }`}></span>
                                {stock.status || (isExpired ? "Expired" : isExpiringSoon ? "Expiring" : "Optimal")}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                [{stock.daysRemaining < 0 ? `${Math.abs(stock.daysRemaining)}d ago` : `${stock.daysRemaining}d`}]
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <div className="inline-flex items-center gap-2 font-mono">
                              <button
                                onClick={() => navigate('/addstock', { state: { editData: stock } })}
                                className="bg-blue-950/80 hover:bg-[#00b4ff] text-cyan-300 hover:text-slate-950 border border-blue-700/60 hover:border-[#00b4ff] px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(stock._id)}
                                className="bg-rose-950/40 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 hover:border-rose-600 px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                              >
                                Del
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* ================= MOBILE CARD VIEW (Below md) ================= */}
              <div className="md:hidden divide-y divide-blue-900/50">
                {filteredData.map((stock) => {
                  const isExpired = stock.daysRemaining < 0
                  const isExpiringSoon = stock.daysRemaining <= 3 && stock.daysRemaining >= 0

                  return (
                    <div
                      key={stock._id}
                      className={`p-4 space-y-3 ${
                        isExpired
                          ? "bg-rose-950/15"
                          : isExpiringSoon
                          ? "bg-amber-950/15"
                          : "bg-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-white text-sm">{stock.productName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono uppercase bg-blue-950 text-cyan-300 border border-blue-800 px-2 py-0.5 rounded">
                              {stock.category}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              #{stock.batchNo}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border shrink-0 ${
                            isExpired
                              ? "bg-rose-950/70 text-rose-400 border-rose-500/40"
                              : isExpiringSoon
                              ? "bg-amber-950/70 text-amber-300 border-amber-500/40"
                              : "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isExpired ? "bg-rose-500" : isExpiringSoon ? "bg-amber-400 animate-ping" : "bg-emerald-400"
                          }`}></span>
                          {stock.status || (isExpired ? "Expired" : isExpiringSoon ? "Expiring" : "Optimal")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-[#050b1a]/80 p-2.5 rounded-xl border border-blue-900/40 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 block">QUANTITY</span>
                          <span className="font-bold text-emerald-400">{stock.quantity} UNITS</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">EXPIRY ({stock.daysRemaining < 0 ? `${Math.abs(stock.daysRemaining)}d ago` : `${stock.daysRemaining}d`})</span>
                          <span className="text-slate-200">
                            {stock.expiryDate ? stock.expiryDate.split('T')[0].split('-').reverse().join('-') : 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 font-mono">
                        <button
                          onClick={() => navigate('/addstock', { state: { editData: stock } })}
                          className="flex-1 py-1.5 bg-blue-950 hover:bg-[#00b4ff] text-cyan-300 hover:text-slate-950 border border-blue-800 rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                        >
                          Edit Batch
                        </button>
                        <button
                          onClick={() => handleDelete(stock._id)}
                          className="px-4 py-1.5 bg-rose-950/50 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/40 rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                        >
                          Del
                        </button>
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