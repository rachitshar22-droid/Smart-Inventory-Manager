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
        <div className="p-6">
            <h1 className="text-3xl font-bold text-red-600 mb-6 border-b-2 border-red-200 pb-2">
                🚨 Expiring Soon (Khatre Ki Ghanti)
            </h1>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {inventory.length === 0 ? (
                    <p className="text-gray-500 font-semibold">Bhai sab theek hai, koi saman nahi kharab hone wala abhi! Chill kar.</p>
                ) : (
                    inventory.map((item) => (
                        <div key={item._id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 uppercase">{item.productName}</h2>
                            <p className="text-gray-600 mt-2">
                                <span className="font-semibold">Category:</span> {item.category}
                            </p>
                            <div className="mt-3 bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded inline-block">
                                Days Left: {item.daysRemaining}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Backend Status: {item.status}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

