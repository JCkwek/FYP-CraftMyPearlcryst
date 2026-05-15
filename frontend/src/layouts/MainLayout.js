import {Outlet} from "react-router-dom";
import './MainLayout.css'
import SideNav from '../components/SideNav';
import TopNav  from "../components/TopNav";

function MainLayout({ currentUser, setCurrentUser }){
    return(
        <div className="mainlayout">
            <TopNav />
            <SideNav user={currentUser}/>
            <div className="contentContainer">
                <div className="contentCard">
                    <Outlet context={{ currentUser, setCurrentUser }}/>
                </div>
            </div>
        </div>
    );
}

export default MainLayout;