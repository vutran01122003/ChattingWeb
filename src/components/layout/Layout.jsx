import { Fragment, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";
import Tab from "./Tab";
import SideBar from "./Sidebar";
import SideBarContact from "./SidebarContact";
import CallModal from "../call/CallModal";
import { callSelector, peerSelector, socketSelector } from "../../redux/selector";

function Layout({ auth }) {
    const location = useLocation();
    const peer = useSelector(peerSelector);
    const socket = useSelector(socketSelector);
    const call = useSelector(callSelector);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [currentFeatureId, setCurrentFeatureId] = useState(1);

    const handleUserSelection = (user) => {
        setSelectedUser(user);
        setSelectedUserId(user._id);
    };

    useEffect(() => {
        if (location.pathname === "/friend-request") {
            setCurrentFeatureId(2);
        } else if (location.pathname === "/") {
            setCurrentFeatureId(1);
        }
    }, [location.pathname]);

    return (
        <Fragment>
            {Object.keys(call).length > 0 && !call.calling && (
                <CallModal auth={auth} call={call} socket={socket} peer={peer} />
            )}

            <div className="w-full h-screen flex">
                <Tab currentFeatureId={currentFeatureId} setCurrentFeatureId={setCurrentFeatureId} />
                {currentFeatureId === 1 && (
                    <SideBar auth={auth} setSelectedUser={handleUserSelection} selectedUserId={selectedUserId} />
                )}
                {currentFeatureId === 2 && <SideBarContact />}

                <main className="flex-1">
                    <div>
                        <Outlet context={selectedUser} />
                    </div>
                </main>
            </div>
        </Fragment>
    );
}

export default Layout;
