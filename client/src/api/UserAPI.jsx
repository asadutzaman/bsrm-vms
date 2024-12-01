import axios from 'axios'
import { useEffect, useState } from 'react'

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    // const [cart, setCart] = useState([])
    // const [history, setHistory] = useState([])
    const [user, setUser] = useState([])

    useEffect(() =>{
        if(token){
            const getUser = async () =>{
                try {
                    const res = await axios.get('/api/infor', {
                        headers: {Authorization: token}
                    })

                    setIsLogged(true)
                    res.data.user.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

                    // setCart(res.data.cart)
                    setUser(res.data.user);

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }

            getUser();
        }
    },[token])

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        user: [user, setUser],
    }
}

export default UserAPI
 