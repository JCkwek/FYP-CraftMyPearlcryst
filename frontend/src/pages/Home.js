import style from './Home.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import {useState} from 'react';
import { getUsers } from '../api/userApi';


function Home(){

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
            <h1>Home</h1>
            {/* <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://via.placeholder.com/800x300"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>First Slide</h3>
          <p>Some description</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://via.placeholder.com/800x300"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Second Slide</h3>
          <p>Another description</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel> */}

    <button onClick={handleClick}>Load Users</button>
    {users.map(user => (
      <h3 key={user.id}>{user.name}, {user.email}, {user.phone_no}</h3>
    ))}
        </div>
    )
}

export default Home;