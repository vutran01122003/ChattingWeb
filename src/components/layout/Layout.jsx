import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Tab from "./Tab";
import SideBar from "./Sidebar";
import SideBarContact from "./SidebarContact";
import { Outlet } from "react-router";

function Layout() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentFeatureId, setCurrentFeatureId] = useState(1);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/friend-request") {
      setCurrentFeatureId(2);
    } else if (location.pathname === "/") {
      setCurrentFeatureId(1);
    }
  }, [location.pathname]);

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    setSelectedUserId(user._id);
  };

  return (
    <div className="w-full h-screen flex">
      <Tab currentFeatureId={currentFeatureId} setCurrentFeatureId={setCurrentFeatureId} />
      {currentFeatureId === 1 && (
        <SideBar setSelectedUser={handleUserSelection} selectedUserId={selectedUserId} />
      )}
      {currentFeatureId === 2 && <SideBarContact />}

      <main className="flex-1">
        {currentFeatureId === 1 && !selectedUser ? (
          <div className="p-4 text-gray-500">Chọn người dùng để bắt đầu trò chuyện</div>
        ) : (
          <Outlet context={selectedUser} />
        )}
      </main>
    </div>
  );
}

export default Layout;
