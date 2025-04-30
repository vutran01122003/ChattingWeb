import { useDispatch, useSelector } from "react-redux";
import { getUserBySearch, getAllUser } from "../../redux/slices/authSlice";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { fetchConversations } from "../../redux/thunks/chatThunks";
import { socketSelector, authSelector } from "../../redux/selector";
function SideBar({ auth, setSelectedUser, selectedUserId }) {
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const socket = useSelector(socketSelector);
    const { user } = useSelector(authSelector);
    const allUsers = useSelector((state) => state.auth.allUsers);
    const searchResults = useSelector((state) => state.auth.searchResults);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const { friendConversations, strangerConversations, groupConversations } = useSelector((state) => state.chat);
    const conversations = useMemo(() => {
        return [...friendConversations, ...strangerConversations, ...groupConversations];
    }, [friendConversations, strangerConversations, groupConversations]);

    useEffect(() => {
        dispatch(fetchConversations());
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("conversation_updated", (data) => {
            dispatch(fetchConversations());
        });

        return () => {
            socket.off("conversation_updated");
        };
    }, [socket, dispatch]);

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

    const LastMessageCF = ({ chat }) => {
        if (chat.last_message.deleted_by && chat.last_message.deleted_by.includes(user._id)) {
            return "Tin nhắn đã bị xóa";
        } else if (chat.last_message.is_revoked) {
            return "Tin nhắn đã được thu hồi";
        } else {
            const content = chat.last_message?.content;
            const file_name = chat.last_message?.attachments[chat.last_message?.attachments.length - 1]?.file_name;

            const splitContent = (content) => {
                return content.length > 30 ? content.slice(0, 30) + "..." : content;
            };

            return content !== "" ? splitContent(content) || "Không có tin nhắn" : splitContent(file_name);
        }
    };

    return (
        <div className="w-xs h-screen flex flex-col border-r border-gray-200">
            {/* Thanh tìm kiếm + nút */}
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

            {/* <div className="overflow-y-auto flex-1">
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
                <abbr title="Thêm bạn">
                    <button className="w-9 h-9 flex justify-center items-center hover:bg-gray-200 rounded-sm cursor-pointer">
                        <MdOutlinePersonAddAlt size={18} />
                    </button>
                </abbr>
                <abbr title="Tạo nhóm chat">
                    <button className="w-9 h-9 flex justify-center items-center hover:bg-gray-200 rounded-sm cursor-pointer">
                        <MdOutlineGroupAdd size={18} />
                    </button>
                </abbr>
            </div> */}
            {/* 
            {conversations.map((chat) => {
                console.log(chat);
            })} */}

            {/* Vùng danh sách có scroll */}
            <div className="flex-1 overflow-y-auto">
                {conversations.map((chat) => {
                    if ("last_message" in chat && chat.conversation_type !== "group") {
                        return (
                            <div
                                key={chat.conversation_id}
                                className="flex gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                    navigate(`/chat/${chat.conversation_id}`, {
                                        state: {
                                            chat: chat
                                        }
                                    })
                                }
                            >
                                <img
                                    src={chat.other_user[0]?.avatar_url}
                                    alt={chat.other_user[0]?.full_name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold">{chat.other_user[0]?.full_name}</span>
                                        <span className="text-gray-400">
                                            {new Date(chat.last_message_time).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                    <div
                                        className={`${
                                            chat.unread ? "text-black font-bold text-md" : "text-gray-500 text-sm"
                                        }`}
                                    >
                                        <LastMessageCF chat={chat} />
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    if (chat.conversation_type === "group" && chat.last_message !== null) {
                        return (
                            <div
                                key={chat.conversation_id}
                                className="flex gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                    navigate(`/chat/${chat.conversation_id}`, {
                                        state: {
                                            chat
                                        }
                                    })
                                }
                            >
                                <img
                                    src={chat.group_avatar}
                                    alt={chat.group_name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold">{chat.group_name}</span>
                                        <span className="text-gray-400">
                                            {new Date(chat.last_message_time).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                    <div
                                        className={`${
                                            chat.unread ? "text-black font-bold text-md" : "text-gray-500 text-sm"
                                        }`}
                                    >
                                        <LastMessageCF chat={chat} />
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}

export default SideBar;
