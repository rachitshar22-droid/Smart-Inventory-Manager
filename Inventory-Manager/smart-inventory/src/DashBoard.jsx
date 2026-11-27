import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { useAuth } from "./AuthContext"
import { API_URL } from "./config"

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
      await authFetch(`${API_URL}/api/inventory/${id}`, {
        method: "DELETE",
      })
      setAllData(allData.filter((item) => item._id !== id))
    } catch (error) {
      console.log("Nhi hua Delete", error)
    }
  }

  const fetchData = async () => {
    try {
      const response = await authFetch(`${API_URL}/api/inventory`, {
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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
           
            <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight leading-none text-slate-900 mt-1">
              My Stock!
            </h1>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => navigate('/addstock')}
              className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-[14px] font-bold px-5 py-3.5 sm:py-3 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              + Add Stock
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
            <p className="text-[12px] font-semibold text-slate-500">Active Batches</p>
            <p className="text-[30px] sm:text-[36px] font-extrabold leading-none text-slate-900 mt-2">
              {activeBatches.length}{' '}
              <span className="text-[14px] font-medium text-slate-400">/ {allData.length}</span>
            </p>
            <p className="text-[12px] text-slate-400 mt-2">Total batches</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
            <p className="text-[12px] font-semibold text-slate-500">Total Units</p>
            <p className="text-[30px] sm:text-[36px] font-extrabold leading-none mt-2 text-emerald-600">
              {totalActiveUnits.toLocaleString()}
            </p>
            <p className="text-[12px] text-slate-400 mt-2">For sale now</p>
          </div>

          {/* Needs Attention */}
          <div
            onClick={() => navigate('/expiringsoon')}
            className="col-span-2 lg:col-span-1 bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-amber-300 shadow-sm transition-all"
          >
            <div className="flex justify-between items-center">
              <p className="text-[12px] font-bold tracking-wide text-amber-800">⚠ Pay attention</p>
              <span className="text-[12px] font-bold bg-white text-amber-900 border border-amber-200 px-3 py-1 rounded-full shadow-xs">
                See →
              </span>
            </div>
            <div className="flex gap-7 mt-3">
              <div>
                <p className="text-[28px] font-extrabold leading-none text-amber-600">
                  {expiringSoonBatches.length}
                </p>
                <p className="text-[12px] font-medium text-amber-800/80 mt-1">Expires in 30 days</p>
              </div>
              <div className="w-px bg-amber-200" />
              <div>
                <p className="text-[28px] font-extrabold leading-none text-red-600">
                  {expiredBatches.length}
                </p>
                <p className="text-[12px] font-medium text-red-700/80 mt-1">It has expired</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-200/80 border-b-slate-100 rounded-t-2xl px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <p className="text-[15px] font-bold text-slate-900">
            All Batches{' '}
            <span className="text-[12px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full ml-1">
              {filteredData.length}
            </span>
          </p>
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Product Name,BatchNo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-base sm:text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* List */}
        <div className="bg-white border border-slate-200/80 border-t-0 rounded-b-2xl shadow-sm overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[15px] font-bold text-slate-800">Found Nothing</p>
              <p className="text-[13px] text-slate-500 mt-1">+ Add Stock and load the items first</p>
            </div>
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[12px] font-semibold text-slate-500">
                      <th className="py-3.5 px-5">Product</th>
                      <th className="py-3.5 px-3">Category</th>
                      <th className="py-3.5 px-3">Batch</th>
                      <th className="py-3.5 px-3">Quantity</th>
                      <th className="py-3.5 px-3">Expiry</th>
                      <th className="py-3.5 px-3">Status</th>
                      <th className="py-3.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[14px]">
                    {filteredData.map((stock) => {
                      const isExpired = stock.daysRemaining < 0
                      const isExpiringSoon = stock.daysRemaining <= 30 && stock.daysRemaining >= 0
                      return (
                        <tr key={stock._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-5 font-bold text-[15px] text-slate-900">{stock.productName}</td>
                          <td className="py-4 px-3">
                            <span className="text-[12px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                              {stock.category}
                            </span>
                          </td>
                          <td className="py-4 px-3 font-mono text-slate-600">#{stock.batchNo}</td>
                          <td className="py-4 px-3 font-bold text-slate-900">
                            {stock.quantity} <span className="text-[12px] font-normal text-slate-400">units</span>
                          </td>
                          <td className="py-4 px-3 text-slate-600">
                            {stock.expiryDate ? stock.expiryDate.split('T')[0].split('-').reverse().join('-') : 'N/A'}
                          </td>
                          <td className="py-4 px-3">
                            <span
                              className={`inline-flex text-[12px] font-bold px-2.5 py-1 rounded-full border ${
                                isExpired
                                  ? 'bg-red-50 text-red-700 border-red-200/70'
                                  : isExpiringSoon
                                  ? 'bg-amber-50 text-amber-700 border-amber-200/70'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                              }`}
                            >
                              {isExpired
                                ? `Expired • ${Math.abs(stock.daysRemaining)} days ago`
                                : isExpiringSoon
                                ? `About to expire • ${stock.daysRemaining} days left`
                                : 'In Stock'}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => navigate('/addstock', { state: { editData: stock } })}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-lg font-semibold text-[13px] transition-colors cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(stock._id)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-1.5 rounded-lg font-semibold text-[13px] transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredData.map((stock) => {
                  const isExpired = stock.daysRemaining < 0
                  const isExpiringSoon = stock.daysRemaining <= 30 && stock.daysRemaining >= 0
                  return (
                    <div key={stock._id} className="p-4">
                      <div className="flex justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-[16px] text-slate-900 leading-tight">{stock.productName}</h3>
                          <p className="text-[12px] text-slate-500 mt-1">
                            {stock.category} • #{stock.batchNo}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 h-fit text-[12px] font-bold px-2.5 py-1 rounded-full border ${
                            isExpired
                              ? 'bg-red-50 text-red-700 border-red-200/70'
                              : isExpiringSoon
                              ? 'bg-amber-50 text-amber-700 border-amber-200/70'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                          }`}
                        >
                          {isExpired ? 'Expired' : isExpiringSoon ? `${stock.daysRemaining}d left` : 'In Stock'}
                        </span>
                      </div>
                      <div className="flex justify-between bg-slate-50 rounded-xl px-3.5 py-2.5 mt-3 text-[13px] border border-slate-200/70">
                        <span className="text-slate-500">
                          Qty: <b className="text-slate-900">{stock.quantity}</b>
                        </span>
                        <span className="text-slate-500">
                          Expiry:{' '}
                          <b className="text-slate-900">
                            {stock.expiryDate ? stock.expiryDate.split('T')[0].split('-').reverse().join('-') : 'N/A'}
                          </b>
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => navigate('/addstock', { state: { editData: stock } })}
                          className="flex-1 py-2.5 bg-slate-100 active:bg-slate-200 text-slate-800 rounded-xl font-semibold text-[14px] transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(stock._id)}
                          className="px-5 py-2.5 bg-red-50 active:bg-red-100 text-red-600 rounded-xl font-semibold text-[14px] transition-colors cursor-pointer"
                        >
                          Delete
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