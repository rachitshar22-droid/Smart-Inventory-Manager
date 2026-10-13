import { createContext,useState,useEffect,useContext } from "react";
const AuthContext=createContext()
export const AuthProvider=({children})=>{
    const[accessToken,setAccessToken]=useState(null)
    const[loading,setLoading]=useState(true)

    useEffect(()=>{
        const fetchNewToken=async()=>{
            try{
                const response=await fetch('http://localhost:3000/api/auth/refresh',{
                    method:'GET',
                    credentials:'include'
                })
                const data=await response.json()

                if(data.success){
                    setAccessToken(data.accessToken)
                }else{
                    setAccessToken(null)
                }
            }catch(error){
                console.error("Nhi hua refresh failed hogya",error)
                setAccessToken(null)
            }finally{
                setLoading(false)
            }
        }
        fetchNewToken()
    },[])

    return(
        <AuthContext.Provider value={{accessToken,setAccessToken,loading}}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
export const useAuth=()=>useContext(AuthContext)