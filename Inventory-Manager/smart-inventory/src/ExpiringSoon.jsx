import { useState, useEffect } from "react"
export default function ExpiringSoon() {
    const [inventory, setInventory] = useState([])

    useEffect(() => {
        const fetchExpiryItems = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/inventory')
                const data = await response.json()
                if (data.success) {
                    const khatreWaleItems = data.data.filter((item) => item.daysRemaining <= 3)
                    setInventory(khatreWaleItems)
                }
            } catch (error) {
                console.log("Error aagya Bhai:".error)
            }
        }
        fetchExpiryItems()
    }, [])

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-100">
            <h1 className="text-2xl md:text-3xl font-extrabold text-rose-500 mb-6 border-b border-slate-800 pb-4">
                🚨 Expiring Soon (Khatre Ki Ghanti)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory.length === 0 ? (
                    <p className="text-slate-400 font-semibold bg-slate-900 p-6 rounded-2xl border border-slate-800 col-span-full">
                        Bhai sab theek hai, koi saman nahi kharab hone wala abhi! Chill kar.
                    </p>
                ) : (
                    inventory.map((item) => (
                        <div
                            key={item._id}
                            className="bg-slate-900 border-l-4  p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col gap-2"
                        >
                            <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
                                {item.productName}
                            </h2>
                            <p className="text-sm text-slate-300 mt-1">
                                <span className="font-semibold text-slate-400">Category:</span> {item.category}
                            </p>
                            {item.expiryDate && (
                                <p className="text-sm text-slate-300">
                                    <span className="font-semibold text-slate-400">Expiry Date:</span>{' '}
                                    <span className="text-amber-400 font-bold">
                                        {item.expiryDate.split('T')[0].split('-').reverse().join('-')}
                                    </span>
                                </p>
                            )}
                            <div className="mt-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold px-3 py-1.5 rounded-lg self-start">
                                ⏳ Days Left: {item.daysRemaining}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-800">
                                Backend Status: <span className="text-slate-300 font-semibold">{item.status}</span>
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

