import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { API_URL } from './config'

const API = `${API_URL}/api/inventory/customers`

// Helper: JWT Access Token se bina backend hit kiye Tenant/User ID nikalne ke liye
const getTenantKeyFromToken = (token) => {
  try {
    if (!token) return 'default_tenant'
    const base64Payload = token.split('.')[1]
    const payload = JSON.parse(atob(base64Payload))
    return payload.tenantId || payload.userId || payload.id || payload._id || 'default_tenant'
  } catch {
    return 'default_tenant'
  }
}

export default function CustomerList() {
  const { authFetch, accessToken } = useAuth()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  // Tenant-Scoped Shop & UPI Configuration States
  const tenantKey = getTenantKeyFromToken(accessToken)
  const storageKey = `smart_inv_shop_config_${tenantKey}`

  const [shopConfig, setShopConfig] = useState({ shopName: '', upiId: '' })
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [pendingCustomer, setPendingCustomer] = useState(null)

  // Load Tenant's Shop Name & UPI ID on mount or token change
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setShopConfig(JSON.parse(saved))
      } catch {
        setShopConfig({ shopName: '', upiId: '' })
      }
    }
  }, [storageKey])

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await authFetch(API, {})
        if (!res.ok) {
          setMsg('Telemetry sync failed: Data load nahi hua')
          setLoading(false)
          return
        }
        const data = await res.json()
        if (data.success) setCustomers(data.data)
      } catch (error) {
        setMsg('Network Error: Server se connect nahi hua')
      } finally {
        setLoading(false)
      }
    }
    loadCustomers()
  }, [])

  // ==========================================
  // 🛠️ CORE ACTIONS & WHATSAPP DISPATCHER
  // ==========================================
  const handleUpdate = (customer) => {
    navigate('/editCustomer', { state: { customer } })
  }

  const handleDelete = async (customerId) => {
    if (!window.confirm('Ye customer delete karna hai?')) return
    try {
      const res = await authFetch(`${API}/${customerId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setMsg(data.message || 'Delete nahi hua')
        return
      }
      setCustomers((prev) => prev.filter((c) => c._id !== customerId))
    } catch (error) {
      setMsg('Server se connect nahi hua')
    }
  }

 // Actual WhatsApp Link Generator (Clean & Professional)
  const fireWhatsAppMessage = (c, config) => {
    const digits = String(c.phone).replace(/\D/g, '').slice(-10)
    const amount = Number(c.totalAmount) || 0
    const formattedAmt = amount.toLocaleString('en-IN')

    const text =
      `Namaste ${c.name} ji,\n\n` +
      `${config.shopName.trim()} par aapka ₹${formattedAmt} ka udhar baaki hai.\n\n` +
      `UPI ID: ${config.upiId.trim()}\n\n` +
      `Kripya is UPI ID par payment clear kar dein aur screenshot send kar de. Dhanyavaad!`

    window.open(
      `https://wa.me/91${digits}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  // Remind Button Click Handler
  const handleRemind = (c) => {
    // Agar Shop Name ya UPI ID set nahi hai, toh pehle one-time setup modal dikhao
    if (!shopConfig.shopName.trim() || !shopConfig.upiId.trim()) {
      setPendingCustomer(c)
      setShowConfigModal(true)
      return
    }
    fireWhatsAppMessage(c, shopConfig)
  }

  // Save Shop & UPI Setup
  const handleSaveConfig = (e) => {
    e.preventDefault()
    if (!shopConfig.shopName.trim() || !shopConfig.upiId.trim()) return

    localStorage.setItem(storageKey, JSON.stringify(shopConfig))
    setShowConfigModal(false)

    // Agar Remind dabane par modal khula tha, toh save hote hi turant WhatsApp bhej do
    if (pendingCustomer) {
      fireWhatsAppMessage(pendingCustomer, shopConfig)
      setPendingCustomer(null)
    }
  }

  // Real-time Search Filter
  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.address?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Live Telemetry Calculations
  const totalUdharVolume = customers.reduce(
    (acc, curr) => acc + (Number(curr.totalAmount) || 0),
    0
  )
  const highRiskCount = customers.filter(
    (c) => (Number(c.totalAmount) || 0) >= 2000
  ).length

  const isUpiConfigured = shopConfig.shopName.trim() && shopConfig.upiId.trim()

 return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
           
            <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight leading-none text-slate-900 mt-1">
              Record of loans
            </h1>
          
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => { setPendingCustomer(null); setShowConfigModal(true) }}
              className="bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-800 text-[13px] sm:text-[14px] font-semibold px-3.5 sm:px-4 py-3 rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
            >
              ⚙️ {isUpiConfigured ? 'Shop / UPI Change' : 'Shop & UPI Setup'}
            </button>
            <button
              onClick={() => navigate('/addCustomer')}
              className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-[14px] font-bold px-5 py-3 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              + New Loan
            </button>
          </div>
        </div>

        {/* 3 STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
            <p className="text-[12px] font-semibold text-slate-500">How many people are on credit?</p>
            <p className="text-[30px] sm:text-[36px] font-extrabold leading-none text-slate-900 mt-2">
              {customers.length}
            </p>
            
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
            <p className="text-[12px] font-semibold text-slate-500">Total outstanding debt</p>
            <p className="text-[26px] sm:text-[36px] font-extrabold leading-none mt-2 text-rose-600">
              ₹{totalUdharVolume.toLocaleString('en-IN')}
            </p>
            
          </div>

          <div className="col-span-2 lg:col-span-1 bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <p className="text-[12px] font-bold tracking-wide text-amber-800">⚠ Large loan-over 2,000</p>
            <div className="flex gap-6 mt-3">
              <div>
                <p className="text-[28px] font-extrabold leading-none text-amber-600">{highRiskCount}</p>
                <p className="text-[12px] font-medium text-amber-800/80 mt-1">Remind them first</p>
              </div>
              <div className="w-px bg-amber-200" />
              <div>
                <p className="text-[28px] font-extrabold leading-none text-slate-800">
                  {customers.length - highRiskCount}
                </p>
                <p className="text-[12px] font-medium text-slate-600 mt-1">Small Loan</p>
              </div>
            </div>
          </div>
        </div>

        {msg && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
            {msg}
          </div>
        )}

        {/* LEDGER */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
            <p className="text-[15px] font-bold text-slate-900">
              All those who buy on credit{' '}
              <span className="text-[12px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full ml-1">
                {filteredCustomers.length}
              </span>
            </p>
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Name, phone, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto md:block border-t border-slate-100">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[12px] font-semibold text-slate-500">
                  <th className="py-3.5 pl-5 pr-3">Customer</th>
                  <th className="px-3 py-3.5">Address</th>
                  <th className="px-3 py-3.5">WhatsApp No.</th>
                  <th className="px-3 py-3.5">Loan</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="py-3.5 pl-3 pr-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14px]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                      Loading...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                      No outstanding dues;everything is settled
                                          </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => {
                    const amount = Number(c.totalAmount) || 0
                    const isHighRisk = amount >= 2000
                    return (
                      <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 pl-5 pr-3 font-bold text-[15px] text-slate-900 whitespace-nowrap">
                          {c.name}
                        </td>
                        <td className="px-3 py-4">
                          <span className="text-[12px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                            📍 {c.address}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-slate-600 font-medium whitespace-nowrap">
                          +91 {c.phone}
                        </td>
                        <td className="px-3 py-4 font-extrabold text-[15px] text-rose-600 whitespace-nowrap">
                          ₹{amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {isHighRisk ? (
                            <span className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70">
                              ● Collect payment first
                            </span>
                          ) : (
                            <span className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                              ● Small Loan
                            </span>
                          )}
                        </td>
                        <td className="py-4 pl-3 pr-5 text-right whitespace-nowrap">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleRemind(c)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-bold text-[13px] shadow-xs transition-colors cursor-pointer"
                            >
                              WhatsApp Remind
                            </button>
                            <button
                              onClick={() => handleUpdate(c)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-lg font-semibold text-[13px] transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-1.5 rounded-lg font-semibold text-[13px] transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="divide-y divide-slate-100 md:hidden border-t border-slate-100">
            {loading ? (
              <div className="p-8 text-center text-[13px] text-slate-500 font-medium">Load ho raha hai...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-slate-500 font-medium">Koi udhar nahi hai.</div>
            ) : (
              filteredCustomers.map((c) => {
                const amount = Number(c.totalAmount) || 0
                const isHighRisk = amount >= 2000
                return (
                  <div key={c._id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[16px] font-bold text-slate-900 leading-tight truncate">
                          {c.name}
                        </h3>
                        <p className="text-[12px] text-slate-500 mt-1">
                          📍 {c.address} • +91 {c.phone}
                        </p>
                      </div>
                      <span className="text-[18px] font-extrabold text-rose-600 whitespace-nowrap">
                        ₹{amount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="mt-2.5">
                      <span
                        className={`inline-flex text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isHighRisk
                            ? 'bg-amber-50 text-amber-800 border-amber-200/70'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                        }`}
                      >
                        {isHighRisk ? '● Collect payment first' : '● Small Loan'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <button
                        onClick={() => handleRemind(c)}
                        className="py-2.5 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-bold text-[13px] shadow-xs transition-colors cursor-pointer"
                      >
                        Remind
                      </button>
                      <button
                        onClick={() => handleUpdate(c)}
                        className="py-2.5 bg-slate-100 active:bg-slate-200 text-slate-800 rounded-xl font-semibold text-[13px] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="py-2.5 bg-red-50 active:bg-red-100 text-red-600 rounded-xl font-semibold text-[13px] transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* SHOP & UPI MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl text-slate-900">
            <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
              <div>
               
                <h2 className="text-[20px] font-extrabold text-slate-900 mt-0.5">Shop Setup</h2>
                
              </div>
              <button
                onClick={() => { setShowConfigModal(false); setPendingCustomer(null) }}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg px-2 py-1 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 mt-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Shop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharma General Store"
                  value={shopConfig.shopName}
                  onChange={(e) => setShopConfig({ ...shopConfig, shopName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-base sm:text-[14px] font-medium text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">UPI ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210@ybl"
                  value={shopConfig.upiId}
                  onChange={(e) => setShopConfig({ ...shopConfig, upiId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-base sm:text-[14px] font-medium text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
                />
                
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowConfigModal(false); setPendingCustomer(null) }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {pendingCustomer ? 'Save & send' : 'Save it'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}