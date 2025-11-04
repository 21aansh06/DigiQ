import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { data } from "react-router-dom";
import { toast } from "react-toastify";


export const AppContent = createContext();

export const AppContextProvider = (props)=>{
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin , setIsLoggedIn] = useState(false)
    const[services , setServices] = useState([])
    const [userData , setUserData] = useState("")
    const [organization , setOrganization] = useState("")
    const getAllServices = async () => {
        try {
            axios.defaults.withCredentials = true
            const {data} = await axios.get(backendURL + "/api/service")
            if(data.success){
                setServices(data.services)
            } else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(data.message)
        }
    }
    const value = {
        backendURL,
        isLoggedin , setIsLoggedIn,
        services , getAllServices,
        userData , setUserData,
        organization , setOrganization
    }
    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}