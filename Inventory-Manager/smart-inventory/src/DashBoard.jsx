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
    return(
        <div>
            <button onClick={handleLogout} className="bg-red-500 text-white p-2">Logout</button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50 min-h-screen items-start">
            {allData.map((stock)=>(
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col gap-3" key={stock._id} style={{border:"1px solid black",margin:'10px'}}>
                    <h2>Product Name: {stock.productName}</h2>
                    <p>Batch Number: {stock.batchNo}</p>
                    <p>Category: {stock.category}</p>
                    <p>Quantity: {stock.quantity}</p>
                    <p>Expiry Date: {stock.expiryDate}</p>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold w-full" onClick={()=>handleDelete(stock._id)}>Delete</button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold w-full mt-2" onClick={()=>navigate('/addstock',{state:{editData:stock}})}>Update</button>
                    </div>
            ))}
        </div>
        </div>
    )
}