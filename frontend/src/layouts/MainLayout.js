import {Outlet} from "react-router-dom";
import { useState } from "react";
import './MainLayout.css'
import SideNav from '../components/SideNav';
import TopNav  from "../components/TopNav";

function MainLayout({ currentUser, setCurrentUser }){
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return(
        <div className="mainlayout">
            <TopNav 
                user={currentUser}  
                toggleSidebar={() => setSidebarOpen(prev => !prev)}
            />
            <SideNav 
                user={currentUser}
                isOpen={sidebarOpen}
                closeSidebar={() => setSidebarOpen(false)}
            />

            {sidebarOpen && (
                <div
                    className="sidebarOverlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            <div className="contentContainer">
                <div className="contentCard">
                    <Outlet context={{ currentUser, setCurrentUser }}/>
                </div>
            </div>
        </div>
    );
}

export default MainLayout;