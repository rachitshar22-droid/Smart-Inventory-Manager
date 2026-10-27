import { useState,useEffect } from "react"
import {useNavigate} from 'react-router-dom'
import { useAuth } from "./AuthContext"

export default function DashBoard(){
    const {accessToken,setAccessToken}=useAuth()
    const navigate=useNavigate()
    const[allData,setAllData]=useState([])
    useEffect(()=>{
        fetchData()
    },[])

    const handleLogout=async()=>{
        try{
            await fetch('http://localhost:3000/api/auth/logout',{
                method:'POST',
                credentials:'include'
            })
            setAccessToken(null)
            navigate('/login')
        }catch(error){
            console.log(error)
        }
    }

    const handleDelete=async(id)=>{
        try{
            await fetch(`http://localhost:3000/api/inventory/${id}`,{
                method:"DELETE",
                headers:{
                    'Authorization':`Bearer ${accessToken}`
                }
            })
            setAllData(allData.filter((item)=>item._id!==id))
        }catch(error){
            console.log("Nhi hua Delete",error)
        }
    }

    const fetchData=async()=>{
        try{
            const response=await fetch('http://localhost:3000/api/inventory',{
                method:'GET',
                headers:{
                    'Authoriztion':`Bearer ${accessToken}`
                }
            })
            const data=await response.json()
            
            if(data.success){
                setAllData(data.data)
            }
        }catch(error){
            console.log("Chud gya",error)
        }
    } //When the war is over we finally get married and earth will grow flowers like you and your womb will carry the most beautiful girl in the universe
    return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-100">
      {/* Top Bar with Title & Logout */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Inventory Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Monitor and manage all active stock batches</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg transition-all cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {allData.map((stock) => (
          <div
            key={stock._id}
            className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-extrabold text-white">{stock.productName}</h2>
              <span className="text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                {stock.category}
              </span>
            </div>

            <div className="text-sm text-slate-300 space-y-2 py-2">
              <p className="flex justify-between">
                <span className="text-slate-400">Batch Number:</span>
                <span className="font-semibold text-white">{stock.batchNo}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400">Quantity:</span>
                <span className="font-semibold text-emerald-400">{stock.quantity} units</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400">Expiry Date:</span>
                <span className="font-semibold text-amber-400">
                  {stock.expiryDate ? stock.expiryDate.split('T')[0].split('-').reverse().join('-') : 'N/A'}
                </span>
              </p>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm w-full transition-colors cursor-pointer"
                onClick={() => navigate('/addstock', { state: { editData: stock } })}
              >
                Update
              </button>
              <button
                className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 px-4 py-2.5 rounded-xl font-bold text-sm w-full transition-colors cursor-pointer"
                onClick={() => handleDelete(stock._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
       
}