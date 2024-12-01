import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from './btraclogo.jpg';

function Welcome() {

    const logoutUser = async () =>{
        await axios.get('/api/logout')
        
        localStorage.removeItem('firstLogin')
        
        window.location.href = "/";
    }


    return (
        <div>
            <div className="log"><img onClick={logoutUser} src={logo} alt="" /></div>
        <h1>Welcome to</h1>
        <h2>bTrac Solutions Ltd</h2>
        <h3>Smart Visitor Management System</h3>
        <div className="welcome-page">
            <div className="row">
            <Link to="/visitor"><button className="get_started" type="submit">GET STARTED</button></Link>
                </div>
        </div>
        </div>
    )
}

export default Welcome
