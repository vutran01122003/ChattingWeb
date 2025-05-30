import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegSmile, FaRegAddressCard } from "react-icons/fa";
import { CiChat1 } from "react-icons/ci";
import { AiOutlinePicture, AiOutlinePaperClip } from "react-icons/ai";
import { LuSticker } from "react-icons/lu";
import { IoSendSharp } from "react-icons/io5";
import { BiSolidLike } from "react-icons/bi";
import EmojiPicker from "./EmojiPicker";
import FilePopup from "./FilePopup";

import { aiSelector } from "../../redux/selector";
import { IoMdClose } from "react-icons/io";

export default function MessageInput({ onSendMessage, onImageUpload, onFileUpload, socket, conversation, user }) {
    const { replies } = useSelector(aiSelector);
    const [visibleSuggestionModal, setVisibleSuggestionModal] = useState(false);
    const [message, setMessage] = useState("");
    const [showStickerPopup, setShowStickerPopup] = useState(false);
    const [showFilePopup, setShowFilePopup] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const hideDisplaySuggestionModal = () => {
        setVisibleSuggestionModal(false);
    };

    useEffect(() => {
        if (replies.length > 0) setVisibleSuggestionModal(true);
    }, [JSON.stringify(replies)]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".popup-container")) {
                setShowStickerPopup(false);
                setShowFilePopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (conversation.allow_send_message || [...conversation.admin, ...conversation.sub_admin].includes(user._id))
            if (message.trim()) {
                onSendMessage(message);
                setMessage("");
                if (textareaRef.current) {
                    textareaRef.current.style.height = "auto";
                }
            }
    };

    const handleTyping = () => {
        if (!socket || !user || !conversation.conversation_id) return;
        socket.emit("typing", {
            user,
            conversation_id: conversation.conversation_id
        });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop_typing", { conversation_id: conversation.conversation_id });
        }, 1000);
    };

    const handleChangeMessage = (e) => {
        const value = e.target.value;
        const wordCount = value.trim().split(/\s+/).length;

        if (wordCount <= 200) {
            setMessage(value);
            handleTyping();
        } else {
            alert("Bạn đã vượt quá số lượng từ tối đa cho phép là 200 từ.");
            setMessage(value.split(/\s+/).slice(0, 200).join(" "));
        }
    };

    const handleEmojiClick = (emoji) => {
        setMessage((prev) => prev + emoji);
        setShowStickerPopup(false);
    };

    return (
        <div className="border-t border-gray-300 p-2 flex items-center relative">
            {visibleSuggestionModal && (
                <div className="absolute -top-12 left-4 flex-10 flex items-center">
                    <div className="flex gap-2">
                        {replies.map((reply, index) => (
                            <span
                                className="inline-block p-2 bg-gray-200 border-1 border-stone-50 rounded-md cursor-pointer transform active:scale-95 font-semibold"
                                key={index}
                                onClick={() => {
                                    setMessage(reply);
                                    hideDisplaySuggestionModal();
                                }}
                            >
                                {reply}
                            </span>
                        ))}
                    </div>

                    <span className="cursor-pointer" onClick={hideDisplaySuggestionModal}>
                        <IoMdClose color="red" size={28} />
                    </span>
                </div>
            )}
            <div
                className={`flex space-x-2 mr-2 ${
                    !conversation?.allow_send_message &&
                    conversation?.admin &&
                    conversation?.sub_admin &&
                    ![...conversation.admin, ...conversation.sub_admin].includes(user._id)
                        ? "pointer-events-none"
                        : ""
                }`}
            >
                {/* Sticker button with popup */}
                <div className="relative popup-container">
                    <button
                        className="p-2"
                        onClick={() => {
                            setShowStickerPopup(!showStickerPopup);
                            setShowFilePopup(false);
                        }}
                    >
                        <LuSticker className="h-6 w-6 text-black" />
                    </button>
                    {showStickerPopup && <EmojiPicker onEmojiClick={handleEmojiClick} />}
                </div>

                {/* Image button */}
                <div>
                    <button className="p-2" onClick={() => imageInputRef.current?.click()}>
                        <AiOutlinePicture className="h-6 w-6 text-black" />
                    </button>
                    <input
                        type="file"
                        ref={imageInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={onImageUpload}
                        multiple
                    />
                </div>

                {/* File button with popup */}
                <div className="relative popup-container">
                    <button
                        className="p-2"
                        onClick={() => {
                            setShowFilePopup(!showFilePopup);
                            setShowStickerPopup(false);
                        }}
                    >
                        <AiOutlinePaperClip className="h-6 w-6 text-black" />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={onFileUpload} />
                    {showFilePopup && <FilePopup onFileSelect={() => fileInputRef.current?.click()} />}
                </div>

                <button className="p-2">
                    <FaRegAddressCard className="h-6 w-6 text-black" />
                </button>
                <button className="p-2">
                    <CiChat1 className="h-6 w-6 text-black" />
                </button>
            </div>

            <textarea
                value={message}
                onChange={handleChangeMessage}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className={`flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden ${
                    !conversation?.allow_send_message &&
                    conversation?.admin &&
                    conversation?.sub_admin &&
                    ![...conversation.admin, ...conversation.sub_admin].includes(user._id)
                        ? "cursor-not-allowed"
                        : ""
                }`}
                rows={1}
                ref={textareaRef}
                readOnly={
                    !conversation?.allow_send_message &&
                    conversation?.admin &&
                    conversation?.sub_admin &&
                    ![...conversation.admin, ...conversation.sub_admin].includes(user._id)
                }
            />

            <div
                className={`flex ml-2 ${
                    !conversation?.allow_send_message &&
                    conversation?.admin &&
                    conversation?.sub_admin &&
                    ![...conversation.admin, ...conversation.sub_admin].includes(user._id)
                        ? "pointer-events-none"
                        : ""
                }`}
            >
                <button className="p-2">
                    <FaRegSmile className="h-6 w-6 text-black" />
                </button>
                <button className="p-2" onClick={handleSendMessage}>
                    {message ? (
                        <IoSendSharp className="h-6 w-6 text-blue-600" />
                    ) : (
                        <BiSolidLike className="h-6 w-6 text-yellow-400" />
                    )}
                </button>
            </div>
        </div>
    );
}
