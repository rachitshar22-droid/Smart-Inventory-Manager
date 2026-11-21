import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const API = 'http://localhost:3000/api/inventory/customers'

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
    <div className="min-h-screen bg-[#0A0F1E] p-4 sm:p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[12px] font-bold tracking-widest text-amber-400">DUKAAN • UDHAR</p>
            <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight leading-none mt-1">
              Udhar Khata
            </h1>
            <p className="text-[13px] text-slate-400 mt-1.5">
              {isUpiConfigured
                ? `🏪 ${shopConfig.shopName} • UPI: ${shopConfig.upiId}`
                : 'Kisne kitna udhar liya, sab yahi hai. WhatsApp se yaad dilao.'}
            </p>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => { setPendingCustomer(null); setShowConfigModal(true) }}
              className="bg-[#151E32] hover:bg-[#1D2942] text-slate-200 text-[14px] font-semibold px-4 py-3 rounded-xl border border-slate-700 cursor-pointer"
            >
              ⚙️ {isUpiConfigured ? 'Shop / UPI Badlo' : 'Shop & UPI Setup'}
            </button>
            <button
              onClick={() => navigate('/addCustomer')}
              className="flex-1 sm:flex-none bg-amber-400 hover:bg-amber-300 text-black text-[14px] font-bold px-5 py-3 rounded-xl cursor-pointer"
            >
              + Naya Udhar
            </button>
          </div>
        </div>

        {/* 3 CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-[#121A2E] border border-slate-800 rounded-2xl p-4 sm:p-5">
            <p className="text-[12px] font-semibold text-slate-400">Kitne Log Udhar Pe Hain</p>
            <p className="text-[32px] sm:text-[36px] font-extrabold leading-none mt-2">{customers.length}</p>
            <p className="text-[12px] text-slate-500 mt-2">Total customers</p>
          </div>

          <div className="bg-[#121A2E] border border-slate-800 rounded-2xl p-4 sm:p-5">
            <p className="text-[12px] font-semibold text-slate-400">Total Udhar Baaki Hai</p>
            <p className="text-[28px] sm:text-[36px] font-extrabold leading-none mt-2 text-emerald-400">₹{totalUdharVolume.toLocaleString('en-IN')}</p>
            <p className="text-[12px] text-slate-500 mt-2">Market me paisa fasa hai</p>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-[#1A150A] border border-amber-500/40 rounded-2xl p-4 sm:p-5">
            <p className="text-[12px] font-bold tracking-wide text-amber-300">⚠ BADA UDHAR • ₹2,000 SE UPAR</p>
            <div className="flex gap-6 mt-3">
              <div>
                <p className="text-[28px] font-extrabold leading-none text-amber-400">{highRiskCount}</p>
                <p className="text-[12px] text-amber-200/80 mt-1">Pehle inko yaad dilao</p>
              </div>
              <div className="w-px bg-amber-500/20" />
              <div>
                <p className="text-[28px] font-extrabold leading-none text-slate-200">{customers.length - highRiskCount}</p>
                <p className="text-[12px] text-slate-400 mt-1">Chhota udhar</p>
              </div>
            </div>
          </div>
        </div>

        {msg && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] font-medium text-red-300">
            {msg}
          </div>
        )}

        {/* LEDGER */}
        <div className="bg-[#121A2E] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
            <p className="text-[15px] font-bold">Sab Udhar Wale <span className="text-[12px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full ml-1">{filteredCustomers.length}</span></p>
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Naam, phone, mohalla dhoondho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0A0F1E] border border-slate-700 focus:border-amber-400 rounded-xl pl-10 pr-3 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto md:block border-t border-slate-800">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0F1626] border-b border-slate-800 text-[12px] font-semibold text-slate-400">
                  <th className="py-3.5 pl-5 pr-3">Customer</th><th className="px-3 py-3.5">Mohalla / Address</th><th className="px-3 py-3.5">WhatsApp No.</th><th className="px-3 py-3.5">Udhar</th><th className="px-3 py-3.5">Status</th><th className="py-3.5 pl-3 pr-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-[14px]">
                {loading ? (
                  <tr><td colSpan="6" className="py-12 text-center text-slate-500">Load ho raha hai...</td></tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr><td colSpan="6" className="py-12 text-center text-slate-500">Koi udhar nahi hai. Sab hisaab clear hai.</td></tr>
                ) : (
                  filteredCustomers.map((c) => {
                    const amount = Number(c.totalAmount) || 0
                    const isHighRisk = amount >= 2000
                    return (
                      <tr key={c._id} className="hover:bg-[#16203A]/60">
                        <td className="py-4 pl-5 pr-3 font-bold text-[15px] whitespace-nowrap">{c.name}</td>
                        <td className="px-3 py-4"><span className="text-[12px] font-semibold bg-slate-800 text-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap">📍 {c.address}</span></td>
                        <td className="px-3 py-4 text-slate-300 whitespace-nowrap">+91 {c.phone}</td>
                        <td className="px-3 py-4 font-extrabold text-[15px] whitespace-nowrap">₹{amount.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {isHighRisk ? (
                            <span className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300">● Pehle Vasool Karo</span>
                          ) : (
                            <span className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400">● Normal Udhar</span>
                          )}
                        </td>
                        <td className="py-4 pl-3 pr-5 text-right whitespace-nowrap">
                          <div className="inline-flex gap-2">
                            <button onClick={() => handleRemind(c)} className="bg-emerald-500 hover:bg-emerald-400 text-black px-3.5 py-1.5 rounded-lg font-bold text-[13px] cursor-pointer">WhatsApp Remind</button>
                            <button onClick={() => handleUpdate(c)} className="bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-lg font-semibold text-[13px] cursor-pointer">Edit</button>
                            <button onClick={() => handleDelete(c._id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-1.5 rounded-lg font-semibold text-[13px] cursor-pointer">Delete</button>
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
          <div className="divide-y divide-slate-800 md:hidden border-t border-slate-800">
            {loading ? (
              <div className="p-8 text-center text-[13px] text-slate-500">Load ho raha hai...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-slate-500">Koi udhar nahi hai.</div>
            ) : (
              filteredCustomers.map((c) => {
                const amount = Number(c.totalAmount) || 0
                const isHighRisk = amount >= 2000
                return (
                  <div key={c._id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-[16px] font-bold leading-tight">{c.name}</h3>
                        <p className="text-[12px] text-slate-400 mt-1">📍 {c.address} • +91 {c.phone}</p>
                      </div>
                      <span className="text-[18px] font-extrabold whitespace-nowrap">₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${isHighRisk ? "bg-amber-400/15 text-amber-300" : "bg-emerald-500/15 text-emerald-400"}`}>
                        {isHighRisk ? "● Bada Udhar - Pehle Vasool Karo" : "● Normal Udhar"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <button onClick={() => handleRemind(c)} className="py-2.5 bg-emerald-500 text-black rounded-xl font-bold text-[13px]">Remind</button>
                      <button onClick={() => handleUpdate(c)} className="py-2.5 bg-slate-800 rounded-xl font-semibold text-[13px]">Edit</button>
                      <button onClick={() => handleDelete(c._id)} className="py-2.5 bg-red-500/10 text-red-400 rounded-xl font-semibold text-[13px]">Delete</button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#121A2E] p-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <p className="text-[11px] font-bold tracking-widest text-amber-400">SHOP SETUP</p>
                <h2 className="text-[20px] font-bold">Dukaan & UPI Setup</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Ye ek baar daalo, har Remind me apne aap jayega.</p>
              </div>
              <button onClick={() => { setShowConfigModal(false); setPendingCustomer(null) }} className="text-slate-400 hover:text-white px-2 py-1">✕</button>
            </div>
            <form onSubmit={handleSaveConfig} className="space-y-4 mt-4">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Dukaan ka Naam</label>
                <input type="text" required placeholder="e.g. Sharma General Store" value={shopConfig.shopName} onChange={(e) => setShopConfig({ ...shopConfig, shopName: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-[#0A0F1E] px-4 py-3 text-[14px] text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Apni UPI ID</label>
                <input type="text" required placeholder="e.g. 9876543210@ybl" value={shopConfig.upiId} onChange={(e) => setShopConfig({ ...shopConfig, upiId: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-[#0A0F1E] px-4 py-3 text-[14px] text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none" />
                <p className="text-[12px] text-slate-500 mt-1.5">Customer isi pe paisa bhejega.</p>
              </div>
              <div className="flex justify-end gap-2.5 pt-1">
                <button type="button" onClick={() => { setShowConfigModal(false); setPendingCustomer(null) }} className="px-4 py-2.5 rounded-xl border border-slate-700 text-[13px] font-semibold text-slate-300">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-amber-400 text-black text-[13px] font-bold">{pendingCustomer ? 'Save & WhatsApp Bhejo' : 'Save Karo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}