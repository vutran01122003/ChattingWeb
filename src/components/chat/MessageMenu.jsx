import { MdContentCopy, MdInfoOutline, MdClose } from "react-icons/md";
import { BsPinAngle, BsReply } from "react-icons/bs";
import { CiStar, CiUndo } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { useEffect, useState } from "react";

import { formatDateHeader } from "../../utils/index";
import { useDispatch } from "react-redux";
import { suggestMessage } from "../../redux/slices/aiSlice";

function ReadStatus({ isMe, otherUser, message }) {
    if (isMe) {
        if (otherUser.length === 1) {
            const readUsers = otherUser.filter((user) => message.read_by.includes(user._id));
            return (
                <div className="mb-4">
                    {readUsers.length > 0 && (
                        <>
                            <h3 className="text-gray-700 font-medium mb-2">Đã nhận ({readUsers.length})</h3>
                            <div className="flex flex-wrap items-center gap-2">
                                {readUsers.slice(0, 5).map((user) => (
                                    <div key={user._id} className="flex items-center mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                            <img
                                                src={user.avatar_url}
                                                alt="User avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            {user.full_name.length > 20
                                                ? user.full_name.substring(0, 10) + "..."
                                                : user.full_name}
                                        </div>
                                    </div>
                                ))}
                                {readUsers.length > 5 && (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                        +{readUsers.length - 5}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            );
        } else if (otherUser.length > 1) {
            const readUsers = otherUser.filter((user) => message.read_by.includes(user._id));
            return (
                <div className="mb-4">
                    {readUsers.length > 0 && (
                        <>
                            <h3 className="text-gray-700 font-medium mb-2">Đã nhận ({readUsers.length})</h3>
                            <div className="flex flex-wrap items-center gap-2">
                                {readUsers.slice(0, 5).map((user) => (
                                    <div key={user._id} className="flex items-center mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                            <img
                                                src={user.avatar_url}
                                                alt="User avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            {user.full_name.length > 20
                                                ? user.full_name.substring(0, 10) + "..."
                                                : user.full_name}
                                        </div>
                                    </div>
                                ))}
                                {readUsers.length > 5 && (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                        +{readUsers.length - 5}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            );
        }
    }
    return <div> </div>;
}

function MessageDetailModal({ onClose, message, isMe, otherUser }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-medium">Thông tin tin nhắn</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <MdClose className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4">
                    {/* Message content */}
                    <div className="flex items-center">
                        {!isMe ? (
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                <img
                                    src={otherUser[0].avatar_url}
                                    alt="User avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                        <div className="bg-blue-100 p-3 rounded-lg mb-4">
                            <div className="text-gray-700">{message.sender.full_name}</div>
                            <div>{message.content}</div>
                            <div className="text-right text-xs text-gray-500 mt-1">
                                {formatDateHeader(new Date(message.createdAt || Date.now()))}
                            </div>
                        </div>
                    </div>

                    {/* Read status */}
                    <ReadStatus otherUser={otherUser} isMe={isMe} message={message} />
                </div>
            </div>
        </div>
    );
}

export default function MessageMenu({
    isMe,
    currentYScroll,
    onClose,
    otherUser,
    msg,
    handleDeleteMessage,
    handleRevokeMessage
}) {
    const dispatch = useDispatch();
    const [showDetailModal, setShowDetailModal] = useState(false);

    const onSuggestMessage = () => {
        if (!msg.content) alert("Tin nhắn không hợp lệ");
        dispatch(suggestMessage(msg.content));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".message-menu")) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleViewDetails = () => {
        setShowDetailModal(true);
    };

    return (
        <>
            <div
                className={`message-menu absolute 
            ${currentYScroll < 350 ? "bottom-full mb-2" : "top-full mt-2"}
            ${isMe ? "right-0" : "left-0"} 
            w-60 bg-white border shadow-lg rounded-lg z-50`}
            >
                <ul className="text-sm py-1">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                        <MdContentCopy className="w-5 h-5 mr-3 text-gray-600" />
                        Sao chép tin nhắn
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                        <BsPinAngle className="w-5 h-5 mr-3 text-gray-600" />
                        Ghim tin nhắn
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                        <CiStar className="w-5 h-5 mr-3 text-gray-600" />
                        Đánh dấu tin nhắn
                    </li>
                    {!isMe && (
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={onSuggestMessage}
                        >
                            <BsReply className="w-5 h-5 mr-3 text-gray-600" />
                            Gợi ý tin nhắn
                        </li>
                    )}

                    <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={handleViewDetails}
                    >
                        <MdInfoOutline className="w-5 h-5 mr-3 text-gray-600" />
                        Xem chi tiết
                    </li>
                    <hr className="my-1" />
                    {isMe && (
                        <>
                            <li
                                className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => handleRevokeMessage({ messageId: msg._id })}
                            >
                                <CiUndo className="w-5 h-5 mr-3 text-red-600" />
                                Thu hồi
                            </li>
                            <li
                                className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => handleDeleteMessage({ messageId: msg._id })}
                            >
                                <AiOutlineDelete className="w-5 h-5 mr-3 text-red-600" />
                                Xóa chỉ ở phía tôi
                            </li>
                        </>
                    )}
                    {!isMe && (
                        <li
                            className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => handleDeleteMessage({ messageId: msg._id })}
                        >
                            <AiOutlineDelete className="w-5 h-5 mr-3 text-red-600" />
                            Xóa ở phía tôi
                        </li>
                    )}
                </ul>
            </div>

            {showDetailModal && (
                <MessageDetailModal
                    onClose={() => setShowDetailModal(false)}
                    message={msg || "Đây là một tin nhắn mẫu"}
                    isMe={isMe}
                    otherUser={otherUser}
                />
            )}
        </>
    );
}
