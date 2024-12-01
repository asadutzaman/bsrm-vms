import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import EmployeeAPI from './api/EmployeeAPI'
import UserAPI from './api/UserAPI'


export const GlobalState = createContext()


export const DataProvider = ({children}) =>{
    const [token, setToken] = useState(false)


    useEffect(() =>{
        const firstLogin = localStorage.getItem('firstLogin')
        if(firstLogin){
            console.log(firstLogin)
            const refreshToken = async () =>{
                const res = await axios.get('/api/refresh_token')
            console.log(res.data.accesstoken)
                setToken(res.data.accesstoken)
    
                setTimeout(() => {
                    refreshToken()
                }, 10 * 60 * 1000)
            }
            refreshToken()
        }
    },[])
    
    const state = {
        token: [token, setToken],
        userAPI: UserAPI(token),
        employeeAPI: EmployeeAPI(token),
    }

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}