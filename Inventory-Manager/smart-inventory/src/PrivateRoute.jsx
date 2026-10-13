import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute=({children})=>{
    const{accessToken,loading}=useAuth()
    if(loading){
        return <div>Loading Vault...</div>
    }
    if(!accessToken){
        return <Navigate to='/login' replace/>
    }
    return children
}
export default PrivateRoute