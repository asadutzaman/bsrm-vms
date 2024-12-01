import axios from 'axios'
import { useEffect, useState } from 'react'

function EmployeeAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [employee, setEmployee] = useState([])

    useEffect(() =>{
        if(token){
            const getEmployee = async () => {
                try{
                  var employee = await axios.get('/api/employee',{
                      headers: {Authorization: token}
                  });
                  setEmployee(employee.data.employeeDetails)
                //   console.log(employee.data)
                } catch(err) {
                    alert(err.response.data.msg)
                }
            }
            getEmployee();
        }
    },[token])

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        employee: [employee, setEmployee],
    }
}

export default EmployeeAPI
 