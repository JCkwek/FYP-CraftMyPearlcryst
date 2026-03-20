import {Outlet} from "react-router-dom";
import './MainLayout.css'
import SideNav from '../components/SideNav';
import TopNav  from "../components/TopNav";

function MainLayout(){
    return(
        <div className="mainlayout">
            <TopNav />
            <SideNav />
            <div className="contentContainer">
                <div className="contentCard">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default MainLayout;