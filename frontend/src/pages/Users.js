import style from './Home.module.css';
import {useState} from 'react';
import { getUsers } from '../api/userApi';


function Users(){

//state and handle functions
const [users, setUsers] = useState([]);

const handleClick = async () =>{
  try{
    const data = await getUsers();
    setUsers(data); //set in state
  }catch(err){
    console.error(err)
  }
}
 
//
    return(
        <div className={style.home}>
            <h1>Users</h1>
           
    <button onClick={handleClick}>Load Users</button>
    {users.map(user => (
      <h3 key={user.id}>{user.name}, {user.email}, {user.phone_no}</h3>
    ))}
        </div>
    )
}

export default Users;