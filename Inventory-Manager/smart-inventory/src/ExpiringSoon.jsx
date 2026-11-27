import { useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { API_URL } from "./config"

export default function ExpiringSoon() {
    const { authFetch } = useAuth()
    const [inventory, setInventory] = useState([])

    useEffect(() => {
        const fetchExpiryItems = async () => {
            try {
                const response = await authFetch(`${API_URL}/api/inventory`, {})
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
    const criticalCount = inventory.filter(i => i.daysRemaining >= 0 && i.daysRemaining <= 30).length

  return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 text-slate-900">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 pb-4 mb-4 border-b border-slate-200">
                    <div>
                      
                        <h1 className="text-[24px] sm:text-[30px] font-extrabold tracking-tight leading-none text-slate-900 mt-1">
                         Stock nearing exhaustion
                        </h1>
                        <p className="text-[12px] sm:text-[13px] text-slate-500 font-medium mt-1">
                            Sell the stock that is about to expire first.
                        </p>
                    </div>

                    {/* Compact Pills */}
                    <div className="grid grid-cols-2 sm:flex items-center gap-2">
                        <div className="bg-amber-50 border border-amber-200/80 px-3 py-2 rounded-xl flex items-center justify-between sm:justify-start gap-2">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                                <span className="text-[11px] font-semibold text-amber-900">About to expire</span>
                            </div>
                            <span className="text-[14px] font-extrabold text-amber-700">{criticalCount}</span>
                        </div>
                        <div className="bg-red-50 border border-red-200/80 px-3 py-2 rounded-xl flex items-center justify-between sm:justify-start gap-2">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                                <span className="text-[11px] font-semibold text-red-900">It has expired</span>
                            </div>
                            <span className="text-[14px] font-extrabold text-red-600">{deadCount}</span>
                        </div>
                    </div>
                </div>

                {/* Compact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
                    {inventory.length === 0 ? (
                        <div className="col-span-full bg-white border border-slate-200/80 p-10 rounded-2xl text-center shadow-xs">
                            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-2.5 text-lg font-bold">
                                ✓
                            </div>
                            <p className="text-[15px] font-bold text-slate-900">Everything is fine!</p>
                            <p className="text-[13px] text-slate-500 mt-1">
                                Nothing is going to spoil.Everything is safe for now
                            </p>
                        </div>
                    ) : (
                        inventory.map((item) => {
                            const isDead = item.daysRemaining < 0

                            return (
                                <div
                                    key={item._id}
                                    className={`bg-white rounded-xl p-3.5 border border-slate-200/80 border-l-4 shadow-xs flex flex-col gap-2.5 transition-all hover:border-slate-300 ${
                                        isDead ? "border-l-red-500" : "border-l-amber-400"
                                    }`}
                                >
                                    {/* Top Row: Name + Meta on Left, Days Badge on Right */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h2 className="text-[15px] font-bold text-slate-900 leading-tight truncate">
                                                {item.productName}
                                            </h2>
                                            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                                                {item.category || "General"}
                                                {item.batchNo && <span className="font-mono text-slate-400"> • #{item.batchNo}</span>}
                                            </p>
                                        </div>

                                        <span
                                            className={`shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                                isDead
                                                    ? "bg-red-50 text-red-700 border-red-200/70"
                                                    : "bg-amber-50 text-amber-800 border-amber-200/70"
                                            }`}
                                        >
                                            {isDead
                                                ? `Expired • ${Math.abs(item.daysRemaining)}d pehle`
                                                : `${item.daysRemaining}d left`}
                                        </span>
                                    </div>

                                    {/* Bottom Strip: Qty & Expiry Side-by-Side */}
                                    <div className="bg-slate-50/90 border border-slate-100 rounded-lg px-3 py-2 flex items-center justify-between text-[12px]">
                                        {item.quantity !== undefined && (
                                            <span className="text-slate-500 font-medium">
                                                Stock: <b className="text-emerald-600 font-bold">{item.quantity} pcs</b>
                                            </span>
                                        )}
                                        {item.expiryDate && (
                                            <span className="text-slate-500 font-medium">
                                                Exp:{' '}
                                                <b className={`font-bold ${isDead ? "text-red-600" : "text-slate-800"}`}>
                                                    {item.expiryDate.split('T')[0].split('-').reverse().join('-')}
                                                </b>
                                            </span>
                                        )}
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