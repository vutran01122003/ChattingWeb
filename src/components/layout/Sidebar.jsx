import { useDispatch, useSelector } from "react-redux";
import { getUserBySearch } from "../../redux/slices/authSlice";
import { useEffect, useState, useMemo, Fragment, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TbUsersPlus } from "react-icons/tb";
import { fetchConversations } from "../../redux/thunks/chatThunks";
import { socketSelector, authSelector } from "../../redux/selector";
import CreateGroupModal from "../modal/CreateGroupModal";
import Account from "../user/Account";

function SideBar({ auth }) {
    const navigate = useNavigate();
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const searchInputRef = useRef(null);
    const searchDropdownRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    const dispatch = useDispatch();
    const socket = useSelector(socketSelector);
    const { user } = useSelector(authSelector);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isVisibleCreateGroupModal, setIsVisibleCreateGroupModal] = useState(false);

    const { friendConversations, strangerConversations, groupConversations } = useSelector((state) => state.chat);

    const conversations = useMemo(() => {
        return [...friendConversations, ...strangerConversations, ...groupConversations];
    }, [friendConversations, strangerConversations, groupConversations]);

    const handleToggleDisplayCreateGroupModal = () => {
        setIsVisibleCreateGroupModal((prev) => !prev);
    };

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

    const debouncedSearch = useCallback(
        (term) => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            if (!term) {
                setIsSearching(false);
                setSearchList([]);
                return;
            }

            setIsSearching(true);
            searchTimeoutRef.current = setTimeout(() => {
                dispatch(getUserBySearch({ search: term }))
                    .unwrap()
                    .then((response) => {
                        console.log("Search response:", response);
                        if (response && response.metadata) {
                            setSearchList(response.metadata);
                        } else if (response) {
                            setSearchList(response);
                        }
                    })
                    .catch((error) => {
                        console.error("Search error:", error);
                        setSearchList([]);
                    })
                    .finally(() => {
                        setIsSearching(false);
                    });
            }, 500);
        },
        [dispatch]
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchDropdownRef.current &&
                !searchDropdownRef.current.contains(event.target) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target)
            ) {
                setShowSearchDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchFocus = () => {
        setShowSearchDropdown(true);
    };

    const handleCloseSearchDropdown = () => {
        setShowSearchDropdown(false);
        setSearchTerm("");
        setIsSearching(false);
        setSearchList([]);
    };

    const LastMessageCF = ({ chat }) => {
        if (chat.last_message?.deleted_by && chat.last_message?.deleted_by.includes(user._id)) {
            return "Tin nhắn đã bị xóa";
        } else if (chat.last_message?.is_revoked) {
            return "Tin nhắn đã được thu hồi";
        } else {
            const content = chat.last_message?.content;
            const file_name = chat.last_message?.attachments[chat.last_message?.attachments.length - 1]?.file_name;

            const splitContent = (content) => {
                return content && content.length > 30 ? content.slice(0, 30) + "..." : content;
            };

            return content !== "" ? splitContent(content) || "Không có tin nhắn" : splitContent(file_name);
        }
    };

    return (
        <Fragment>
            {isVisibleCreateGroupModal && (
                <CreateGroupModal handleToggleDisplayCreateGroupModal={handleToggleDisplayCreateGroupModal} />
            )}
            <div className="w-xs h-screen flex flex-col border-r border-gray-200">
                <div className="w-xs flex flex-col border-r border-gray-200">
                    {/* Thanh tìm kiếm + nút */}
                    <div className="flex gap-1 items-center p-3 relative">
                        <div className="flex gap-1 items-center flex-1">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Tìm kiếm"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={handleSearchFocus}
                                className="flex-1 bg-gray-100 px-2.5 py-1 rounded-sm outline-none focus:border border-blue-500"
                            />

                            <div onClick={handleToggleDisplayCreateGroupModal} className="cursor-pointer">
                                <TbUsersPlus size={20} />
                            </div>
                        </div>

                        {/* Search dropdown */}
                        {showSearchDropdown && (
                            <div
                                ref={searchDropdownRef}
                                className="absolute top-full left-0 right-0 bg-white shadow-lg z-10 mt-0 h-[calc(100vh-4rem)] overflow-y-auto"
                            >
                                <div className="flex justify-between items-center border-b">
                                    <div className="px-3 py-2 text-blue-500 text-sm font-medium">
                                        {searchTerm ? "Kết quả tìm kiếm" : "Tìm kiếm"}
                                    </div>
                                    <button
                                        onClick={handleCloseSearchDropdown}
                                        className="px-3 py-2 text-gray-500 cursor-pointer"
                                    >
                                        Đóng
                                    </button>
                                </div>

                                {/* Show loading indicator during search */}
                                {isSearching && (
                                    <div className="flex justify-center items-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                )}

                                {/* No results message when search is complete but no results found */}
                                {searchTerm && !isSearching && searchList.length === 0 && (
                                    <div className="py-4 text-center text-gray-500">
                                        Không tìm thấy kết quả nào cho "{searchTerm}"
                                    </div>
                                )}

                                {/* Display search results when searching */}
                                {searchTerm && !isSearching && searchList.length > 0 && (
                                    <div className="flex-1 overflow-y-auto">
                                        {searchList.map((user, index) => (
                                            <Account user={user} key={user._id} authUser={auth.user} />
                                        ))}
                                    </div>
                                )}

                                {/* Show message when no search term is entered */}
                                {!searchTerm && !isSearching && (
                                    <div className="py-4 text-center text-gray-500">
                                        Nhập từ khóa để tìm kiếm người dùng
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center px-3 text-sm">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`py-2 mr-4 ${
                            activeTab === "all"
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-600"
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

                {/* Vùng danh sách có scroll */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((chat) => {
                        if ("last_message" in chat && chat.conversation_type !== "group") {
                            return (
                                <div
                                    key={chat.conversation_id}
                                    className="flex gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => navigate(`/chat/${chat.conversation_id}`)}
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
                                                chat.unread
                                                    ? "text-black font-semibold text-md"
                                                    : "text-gray-500 text-sm"
                                            }`}
                                        >
                                            <LastMessageCF chat={chat} />
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        if (chat.conversation_type === "group" && chat.last_message !== null && chat.is_active) {
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
                                                chat.unread
                                                    ? "text-black font-semibold text-md"
                                                    : "text-gray-500 text-sm"
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
        </Fragment>
    );
}

export default SideBar;
