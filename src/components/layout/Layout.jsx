import { Fragment, useState } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import Tab from "./Tab";
import SideBar from "./Sidebar";
import CallModal from "../message/CallModal";
import { callSelector, peerSelector, socketSelector } from "../../redux/selector";

function Layout({ auth }) {
    const peer = useSelector(peerSelector);
    const socket = useSelector(socketSelector);
    const call = useSelector(callSelector);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleUserSelection = (user) => {
        setSelectedUser(user);
        setSelectedUserId(user._id);
    };

    return (
        <Fragment>
            {Object.keys(call).length > 0 && !call.calling && (
                <CallModal auth={auth} call={call} socket={socket} peer={peer} />
            )}

            <div className="w-full h-screen flex">
                <Tab />
                <SideBar auth={auth} setSelectedUser={handleUserSelection} selectedUserId={selectedUserId} />
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
