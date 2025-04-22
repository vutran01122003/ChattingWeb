import { MdOutlinePersonAddAlt } from "react-icons/md";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchConversations } from '../../redux/thunks/chatThunks'

function SideBar() {
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { friendConversations, strangerConversations } = useSelector(state => state.chat)
    const conversations = [...friendConversations, ...strangerConversations]
    useEffect(() => {
        dispatch(fetchConversations());
    }, []);

    return (
        <div className="w-xs h-screen flex flex-col border-r border-gray-200">
            {/* Thanh tìm kiếm + nút */}
            <div className="flex gap-1 items-center p-3">
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="flex-1 bg-gray-100 px-2.5 py-1 rounded-sm outline-none focus:border border-blue-500"
                />
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
            </div>

            {/* Vùng danh sách có scroll */}
            <div className="flex-1 overflow-y-auto">
                {conversations.map(chat => (
                    (chat.last_message !== null && chat.conversation_type === 'friend') && (
                        <div
                            key={chat.conversation_id}
                            className="flex gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate(`/chat/${chat.other_user._id}`)}
                        >
                            <img
                                src={chat.other_user.avatar_url}
                                alt={chat.other_user.full_name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold">{chat.other_user.full_name}</span>
                                    <span className="text-gray-400">{new Date(chat.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="text-gray-500 text-sm truncate">
                                    {(chat.last_message?.content !== "") ? (chat.last_message?.content || 'Không có tin nhắn')
                                        : chat.last_message?.attachments[chat.last_message?.attachments.length - 1].file_name}
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );

}

export default SideBar;
