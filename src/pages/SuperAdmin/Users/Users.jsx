import axios from 'axios';
import React, { useState } from 'react'

const Users = () => {

const [users, setUsers] = useState();

const fetchingUsers = async() => {
    try{
        const response = await axios.get(`http://localhost:9000/superadmin/users`)
        .then((res) => {
            
        })
    }
    catch(e){

    }
}
return (
    <div>

    </div>
)
}

export default Users