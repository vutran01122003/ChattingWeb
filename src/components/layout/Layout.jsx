import { Outlet } from "react-router";
import Tab from "./Tab";
import SideBar from "./Sidebar";

function Layout() {
    return (
        <div className="w-full h-screen flex">
            <Tab />
            <SideBar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
