import { useState } from "react";
import Tab from "./Tab";
import SideBar from "./Sidebar";
import { Outlet } from "react-router";

function Layout() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); 

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    setSelectedUserId(user._id); 
  };

  return (
    <div className="w-full h-screen flex">
        <Tab />
      <SideBar setSelectedUser={handleUserSelection} selectedUserId={selectedUserId} />
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
  );
}

export default Layout;
