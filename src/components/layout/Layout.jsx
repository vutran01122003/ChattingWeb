import { Fragment, useState } from "react";
import Tab from "./Tab";
import SideBar from "./Sidebar";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { callSelector, peerSelector, socketSelector } from "../../redux/selector";
import CallModal from "../message/CallModal";

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
                    {selectedUser ? (
                        <div>
                            <Outlet context={selectedUser} />
                        </div>
                    ) : (
                        <div>Chọn người dùng để bắt đầu trò chuyện</div>
                    )}
                </main>
            </div>
        </Fragment>
    );
}

export default Layout;
