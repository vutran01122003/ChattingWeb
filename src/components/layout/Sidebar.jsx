import { useDispatch, useSelector } from "react-redux";
import { getUserBySearch, getAllUser } from "../../redux/slices/authSlice";
import { useEffect, useState } from "react";

function SideBar({ auth, setSelectedUser, selectedUserId }) {
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    const allUsers = useSelector((state) => state.auth.allUsers);
    const searchResults = useSelector((state) => state.auth.searchResults);

    useEffect(() => {
        dispatch(getAllUser());
    }, [dispatch]);

    useEffect(() => {
        if (searchTerm) {
            dispatch(getUserBySearch({ search: searchTerm }));
        } else {
            dispatch(getAllUser());
        }
    }, [searchTerm, dispatch]);

    const filteredUsers =
        activeTab === "unread"
            ? searchResults?.filter((user) => user.unread)
            : searchResults?.length > 0
            ? searchResults
            : allUsers;

    return (
        <div className="w-[300px] flex flex-col h-screen bg-white">
            <div className="flex gap-1 items-center p-3">
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-gray-100 px-2.5 py-1 rounded-sm outline-none focus:border border-blue-500"
                />
            </div>

            <div className="flex items-center px-3 text-sm">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`py-2 mr-4 ${
                        activeTab === "all" ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-600"
                    }`}
                >
                    Tất cả
                </button>
                <button
                    onClick={() => setActiveTab("unread")}
                    className={`py-2 mr-4 ${
                        activeTab === "unread"
                            ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                            : "text-gray-600"
                    }`}
                >
                    Chưa đọc
                </button>
            </div>

            <div className="overflow-y-auto flex-1">
                {filteredUsers?.map((user) => {
                    if (auth?.user?._id === user._id) return null;

                    return (
                        <div
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                                selectedUserId === user._id ? "bg-gray-300" : ""
                            }`}
                        >
                            <img
                                src={user.avatar_url}
                                alt={user.full_name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{user.full_name}</div>
                                <div className="text-xs text-gray-500 truncate">{user.lastMessage || "No message"}</div>
                            </div>
                            <div className="text-xs text-gray-400">
                                {user.timestamp
                                    ? `${Math.floor((new Date() - new Date(user.timestamp)) / 60000)} phút trước`
                                    : "No time"}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SideBar;
