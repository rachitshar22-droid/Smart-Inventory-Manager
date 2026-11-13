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
    <div className="min-h-screen bg-[#060b19] p-4 text-slate-100 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ================= TOP COMMAND HEADER ================= */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                Udhar Recovery Easily
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Udhar{' '}
              <span className="bg-linear-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
                Command
              </span>
            </h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-slate-400">
              {isUpiConfigured
                ? `🏪 ${shopConfig.shopName} • 💳 ${shopConfig.upiId}`
                : 'Real-Time Credit & WhatsApp UPI Recovery'}
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
            <button
              onClick={() => {
                setPendingCustomer(null)
                setShowConfigModal(true)
              }}
              className="rounded-xl border border-cyan-500/30 bg-[#0a1124] px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 transition-all hover:border-cyan-400 hover:bg-cyan-500/10 active:scale-95"
            >
              ⚙️ {isUpiConfigured ? 'Edit Shop / UPI' : 'Setup Shop & UPI'}
            </button>

            <button
              onClick={() => navigate('/addCustomer')}
              className="rounded-xl bg-linear-to-r from-cyan-400 to-sky-500 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:from-cyan-300 hover:to-sky-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95"
            >
              + New Udhar Entry
            </button>
          </div>
        </div>

        {/* ================= 3 TELEMETRY KPI CARDS ================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card 1: Active Debtors */}
          <div className="rounded-2xl border border-slate-800/90 bg-[#0a1124]/90 p-5 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-slate-400">
              <span>Active Credit Accounts</span>
              <span className="text-cyan-400">[01]</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-extrabold text-white">
                {customers.length}
              </span>
              <span className="font-mono text-xs text-slate-500">
                / {customers.length} total
              </span>
            </div>
          </div>

          {/* Card 2: Total Market Udhar */}
          <div className="rounded-2xl border border-emerald-500/30 bg-[#0a1124]/90 p-5 shadow-[0_0_30px_-12px_rgba(16,185,129,0.2)] backdrop-blur-md">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-slate-400">
              <span>Total Market Udhar</span>
              <span className="text-emerald-400">[02]</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-extrabold text-emerald-400">
                ₹{totalUdharVolume.toLocaleString('en-IN')}
              </span>
              <span className="font-mono text-[10px] uppercase text-slate-500">
                INR Pending
              </span>
            </div>
          </div>

          {/* Card 3: Threat / Recovery Radar */}
          <div className="rounded-2xl border border-slate-800/90 bg-[#0a1124]/90 p-5 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-slate-400">
              <span>Recovery Threat Radar</span>
              <span className="text-amber-400">HIGH &gt; ₹2K</span>
            </div>
            <div className="mt-3 flex items-baseline gap-3 font-mono">
              <span className="text-3xl font-extrabold text-amber-400">
                {highRiskCount}
              </span>
              <span className="text-[11px] uppercase text-amber-400/80">
                Critical
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-xl font-bold text-cyan-400">
                {customers.length - highRiskCount}
              </span>
              <span className="text-[11px] uppercase text-slate-400">
                Normal
              </span>
            </div>
          </div>
        </div>

        {/* ================= ERROR ALERT ================= */}
        {msg && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-400">
            ● {msg}
          </div>
        )}

        {/* ================= MASTER LEDGER CONTAINER ================= */}
        <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1124]/90 shadow-[0_0_50px_-15px_rgba(6,182,212,0.12)] backdrop-blur-md">
          {/* Table Top Bar: Badge & Search Input */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 p-4 sm:flex-row sm:items-center sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                  Master Credit Ledger
                </span>
              </div>
              <span className="rounded-md bg-slate-800/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-cyan-400">
                {filteredCustomers.length} ROWS
              </span>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="🔍 SEARCH CUSTOMER, PHONE, AREA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-[#060a17] px-4 py-2.5 font-mono text-xs text-cyan-50 placeholder-slate-500 transition-all focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              />
            </div>
          </div>

          {/* ================= DESKTOP TABLE VIEW (md and up) ================= */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#070c1a]/60 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="py-4 pl-6 pr-3">Customer</th>
                  <th className="px-3 py-4">Location / Address</th>
                  <th className="px-3 py-4">WhatsApp No.</th>
                  <th className="px-3 py-4">Udhar Amount</th>
                  <th className="px-3 py-4">Telemetry Status</th>
                  <th className="py-4 pl-3 pr-6 text-right">Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      ⚡ Syncing ledger nodes...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      [ NO ACTIVE UDHAR RECORDS FOUND IN LEDGER ]
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => {
                    const amount = Number(c.totalAmount) || 0
                    const isHighRisk = amount >= 2000

                    return (
                      <tr
                        key={c._id}
                        className="transition-colors hover:bg-cyan-500/5"
                      >
                        <td className="py-4 pl-6 pr-3 font-sans text-sm font-bold text-white whitespace-nowrap">
                          {c.name}
                        </td>

                        <td className="px-3 py-4">
                          <span className="inline-block rounded-md border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sky-400">
                            {c.address}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-slate-300 whitespace-nowrap">
                          +91 {c.phone}
                        </td>

                        <td className="px-3 py-4 text-sm font-extrabold text-cyan-300 whitespace-nowrap">
                          ₹{amount.toLocaleString('en-IN')}
                        </td>

                        <td className="px-3 py-4 whitespace-nowrap">
                          {isHighRisk ? (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-amber-400"></span>
                              High Recovery Priority
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                              Cron Armed [Active]
                            </span>
                          )}
                        </td>

                        <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRemind(c)}
                              className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 transition-all hover:bg-emerald-400 hover:text-slate-950 active:scale-95"
                            >
                              Remind
                            </button>
                            <button
                              onClick={() => handleUpdate(c)}
                              className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 transition-all hover:bg-cyan-400 hover:text-slate-950 active:scale-95"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
                              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400 transition-all hover:bg-red-500 hover:text-white active:scale-95"
                            >
                              Del
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

          {/* ================= MOBILE RESPONSIVE CARD VIEW (Below md) ================= */}
          <div className="divide-y divide-slate-800/60 md:hidden">
            {loading ? (
              <div className="p-8 text-center font-mono text-xs text-slate-500">
                ⚡ Syncing ledger nodes...
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-8 text-center font-mono text-xs text-slate-500">
                [ NO ACTIVE UDHAR RECORDS FOUND ]
              </div>
            ) : (
              filteredCustomers.map((c) => {
                const amount = Number(c.totalAmount) || 0
                const isHighRisk = amount >= 2000

                return (
                  <div key={c._id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {c.name}
                        </h3>
                        <p className="font-mono text-xs text-slate-400">
                          +91 {c.phone}
                        </p>
                      </div>
                      <span className="font-mono text-lg font-extrabold text-cyan-300">
                        ₹{amount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-sky-400">
                        📍 {c.address}
                      </span>

                      {isHighRisk ? (
                        <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-400">
                          ● High Priority
                        </span>
                      ) : (
                        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-400">
                          ● Cron Armed
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <button
                        onClick={() => handleRemind(c)}
                        className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 py-2 text-center font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-300 transition-all active:scale-95 active:bg-emerald-400 active:text-slate-950"
                      >
                        Remind
                      </button>
                      <button
                        onClick={() => handleUpdate(c)}
                        className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-2 text-center font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-300 transition-all active:scale-95 active:bg-cyan-400 active:text-slate-950"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-center font-mono text-[11px] font-bold uppercase tracking-wider text-red-400 transition-all active:scale-95 active:bg-red-500 active:text-white"
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

      {/* ================= SHOP & UPI ONE-TIME SETUP MODAL ================= */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-[#0a1124] p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  Tenant Payment Config
                </span>
                <h2 className="text-xl font-bold text-white">
                  Shop & UPI Setup
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowConfigModal(false)
                  setPendingCustomer(null)
                }}
                className="rounded-lg px-2 py-1 font-mono text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Shop / Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharma General Store"
                  value={shopConfig.shopName}
                  onChange={(e) =>
                    setShopConfig({ ...shopConfig, shopName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#060a17] px-4 py-2.5 font-mono text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Merchant UPI ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210@ybl or shop@okaxis"
                  value={shopConfig.upiId}
                  onChange={(e) =>
                    setShopConfig({ ...shopConfig, upiId: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#060a17] px-4 py-2.5 font-mono text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfigModal(false)
                    setPendingCustomer(null)
                  }}
                  className="rounded-xl border border-slate-700 px-4 py-2.5 font-mono text-xs font-bold uppercase text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-linear-to-r from-cyan-400 to-sky-500 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:from-cyan-300 hover:to-sky-400"
                >
                  {pendingCustomer ? 'Save & Send WhatsApp' : 'Save Config'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}