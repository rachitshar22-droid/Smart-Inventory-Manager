import { useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

export default function ExpiringSoon() {
    const { authFetch } = useAuth()
    const [inventory, setInventory] = useState([])

    useEffect(() => {
        const fetchExpiryItems = async () => {
            try {
                const response = await authFetch('http://localhost:3000/api/inventory', {})
                if (!response.ok) {
                    console.log('Fetch failed:', response.status)
                    return
                }
                const data = await response.json()
                if (data.success) {
                    setInventory(data.data.filter((item) => item.daysRemaining <= 30))
                }
            } catch (error) {
                console.log("Error aagya Bhai:", error)
            }
        }
        fetchExpiryItems()
    }, [])

    const deadCount = inventory.filter(i => i.daysRemaining < 0).length
    const criticalCount = inventory.filter(i => i.daysRemaining >= 0 && i.daysRemaining <= 3).length

    return (
        <div className="min-h-screen bg-[#050b1a] p-4 sm:p-6 md:p-8 text-slate-100 relative overflow-hidden font-sans">
            
            {/* Silicon Valley Threat Ambient Glows */}
            <div className="fixed -top-32 -right-32 w-96 h-96 bg-rose-600/15 blur-[140px] pointer-events-none"></div>
            <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[140px] pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                
                {/* Top Threat Radar Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-blue-900/50">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 mb-2.5 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-rose-300 font-bold">
                                Shelf-Life Threat Radar
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                            <span>🚨 Expiring Soon</span>
                            <span className="text-sm sm:text-base font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2.5 py-0.5 rounded-lg">
                                Khatra hai bhai
                            </span>
                        </h1>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                            SMART ALERTS FOR EXPIRING & DEAD STOCK
                        </p>
                    </div>

                    {/* Quick Threat Summary Pills */}
                    <div className="flex items-center gap-2.5 font-mono">
                        <div className="bg-[#0b1736]/90 border border-amber-500/40 px-3.5 py-2 rounded-xl flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            <span className="text-[10px] uppercase text-slate-300">Expiring:</span>
                            <span className="text-sm font-extrabold text-amber-400">{criticalCount}</span>
                        </div>
                        <div className="bg-[#0b1736]/90 border border-rose-500/40 px-3.5 py-2 rounded-xl flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span className="text-[10px] uppercase text-slate-300">Dead:</span>
                            <span className="text-sm font-extrabold text-rose-500">{deadCount}</span>
                        </div>
                    </div>
                </div>

                {/* Responsive Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {inventory.length === 0 ? (
                        <div className="col-span-full bg-[#0b1736]/60 backdrop-blur-xl p-10 rounded-2xl border border-blue-800/60 text-center shadow-2xl">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3 text-xl font-bold">
                                ✓
                            </div>
                            <p className="text-sm font-extrabold text-white tracking-wide">
                                ALL BATCHES OPTIMAL
                            </p>
                            <p className="text-xs font-mono text-slate-400 mt-1">
                                Bhai sab theek hai, koi saman nahi kharab hone wala abhi! Chill kar.
                            </p>
                        </div>
                    ) : (
                        inventory.map((item) => {
                            const isDead = item.daysRemaining < 0

                            return (
                                <div
                                    key={item._id}
                                    className={`bg-[#0b1736]/75 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-blue-900/60 border-t-2 flex flex-col justify-between gap-4 transition-all hover:-translate-y-0.5 ${
                                        isDead
                                            ? "border-t-rose-500 hover:border-rose-500/50"
                                            : "border-t-amber-400 hover:border-amber-400/50"
                                    }`}
                                >
                                    <div>
                                        {/* Top Row: Category & Days Left Badge */}
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className="text-[10px] font-mono uppercase tracking-widest font-bold bg-blue-950/90 text-cyan-300 border border-blue-800/80 px-2.5 py-1 rounded-md">
                                                {item.category || "GENERAL"}
                                            </span>

                                            <div
                                                className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-full border ${
                                                    isDead
                                                        ? "bg-rose-950/80 border-rose-500/50 text-rose-400"
                                                        : "bg-amber-950/80 border-amber-500/50 text-amber-300"
                                                }`}
                                            >
                                                <span>⏳</span>
                                                <span>
                                                    {isDead
                                                        ? `Expired ${Math.abs(item.daysRemaining)}d ago`
                                                        : `Days Left: ${item.daysRemaining}`}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Product Title */}
                                        <h2 className="text-lg font-extrabold text-white tracking-tight leading-snug">
                                            {item.productName}
                                        </h2>

                                        {/* Telemetry Details Box */}
                                        <div className="mt-3 bg-[#050b1a]/80 border border-blue-900/50 rounded-xl p-3 space-y-1.5 font-mono text-xs">
                                            {item.batchNo && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-slate-400 uppercase">Batch ID</span>
                                                    <span className="text-slate-200 font-bold">#{item.batchNo}</span>
                                                </div>
                                            )}
                                            {item.expiryDate && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-slate-400 uppercase">Expiry Date</span>
                                                    <span className={`font-bold ${isDead ? "text-rose-400" : "text-amber-400"}`}>
                                                        {item.expiryDate.split('T')[0].split('-').reverse().join('-')}
                                                    </span>
                                                </div>
                                            )}
                                            {item.quantity !== undefined && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-slate-400 uppercase">At-Risk Volume</span>
                                                    <span className="text-emerald-400 font-bold">{item.quantity} UNITS</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer: Backend Status */}
                                    <div className="pt-3 border-t border-blue-900/50 flex items-center justify-between text-[11px] font-mono">
                                        <span className="text-slate-400 uppercase tracking-wider">Backend Status</span>
                                        <span
                                            className={`font-bold uppercase px-2 py-0.5 rounded border ${
                                                isDead
                                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                                    : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                            }`}
                                        >
                                            {item.status || (isDead ? "DEAD STOCK" : "CRITICAL")}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}