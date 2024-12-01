import axios from 'axios';
import React, { useState } from 'react';
import logo from './bTrac.png';

function Login() {
    const [user, setUser] = useState({
        email:'', password: ''
    })

    const onChangeInput = e =>{
        const {name, value} = e.target;
        setUser({...user, [name]:value})
    }

    const loginSubmit = async e =>{
        e.preventDefault()
        try {
            await axios.post('/api/access_token', {...user})

            localStorage.setItem('firstLogin', true)
            
            window.location.href = "/welcome";
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    return (
        <div>
            <div className="log"><img src={logo} alt="" /></div>
        <h1>Smart Visitor management system</h1>
        <div className="login-page">
            <form onSubmit={loginSubmit} autoComplete="off">
            <label>USER NAME</label>
                <input type="email" name="email" required
                placeholder="Admin" value={user.email} onChange={onChangeInput} />
            <label>PASSWORD</label>
                <input type="password" name="password" required autoComplete="on"
                placeholder="********" value={user.password} onChange={onChangeInput} />

                <div className="row">
                    <button type="submit">Sign in</button>
                </div>
            </form>
        </div>
        </div>
    )
}

export default Login
