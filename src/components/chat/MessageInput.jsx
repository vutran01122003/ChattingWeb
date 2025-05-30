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

import { authSelector } from "../../redux/selector";

export default function MessageInput({
  onSendMessage,
  onImageUpload,
  onFileUpload,
  socket,
  conversation,
  user,
  isBlocked,
  isBlockedUser,
}) {
  const [message, setMessage] = useState("");
  const [showStickerPopup, setShowStickerPopup] = useState(false);
  const [showFilePopup, setShowFilePopup] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const canSendMessage = !isBlocked && !isBlockedUser;

  const hasGroupPermission =
    conversation?.allow_send_message ||
    (conversation?.admin &&
      conversation?.sub_admin &&
      [...conversation.admin, ...conversation.sub_admin].includes(user?._id));

  const canInteract = canSendMessage && hasGroupPermission;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

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
    if (!canInteract) return;

    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleTyping = () => {
    if (!socket || !user || !conversation.conversation_id || !canInteract)
      return;
    socket.emit("typing", {
      user,
      conversation_id: conversation.conversation_id,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        conversation_id: conversation.conversation_id,
      });
    }, 1000);
  };

  const handleChangeMessage = (e) => {
    if (!canInteract) return;

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
    if (!canInteract) return;
    setMessage((prev) => prev + emoji);
    setShowStickerPopup(false);
  };

  const getBlockMessage = () => {
    if (isBlocked) return "Bạn đã bị chặn bởi người dùng này";
    if (isBlockedUser) return "Bạn đã chặn người dùng này";
    if (!hasGroupPermission)
      return "Bạn không có quyền gửi tin nhắn trong nhóm này";
    return "";
  };

  return (
    <div className="border-t border-gray-300 p-2">
      {/* Thông báo khi bị chặn */}
      {!canSendMessage && (
        <div className="mb-2 p-2 bg-red-100 text-red-600 rounded text-sm text-center">
          {getBlockMessage()}
        </div>
      )}

      <div className="flex items-center relative">
        <div
          className={`flex space-x-2 mr-2 ${
            !canInteract ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {/* Sticker button with popup */}
          <div className="relative popup-container">
            <button
              className="p-2"
              onClick={() => {
                if (!canInteract) return;
                setShowStickerPopup(!showStickerPopup);
                setShowFilePopup(false);
              }}
              disabled={!canInteract}
            >
              <LuSticker className="h-6 w-6 text-black" />
            </button>
            {showStickerPopup && canInteract && (
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            )}
          </div>

          {/* Image button */}
          <div>
            <button
              className="p-2"
              onClick={() => canInteract && imageInputRef.current?.click()}
              disabled={!canInteract}
            >
              <AiOutlinePicture className="h-6 w-6 text-black" />
            </button>
            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/*"
              onChange={canInteract ? onImageUpload : undefined}
              multiple
              disabled={!canInteract}
            />
          </div>

          {/* File button with popup */}
          <div className="relative popup-container">
            <button
              className="p-2"
              onClick={() => {
                if (!canInteract) return;
                setShowFilePopup(!showFilePopup);
                setShowStickerPopup(false);
              }}
              disabled={!canInteract}
            >
              <AiOutlinePaperClip className="h-6 w-6 text-black" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={canInteract ? onFileUpload : undefined}
              disabled={!canInteract}
            />
            {showFilePopup && canInteract && (
              <FilePopup onFileSelect={() => fileInputRef.current?.click()} />
            )}
          </div>

          <button className="p-2" disabled={!canInteract}>
            <FaRegAddressCard className="h-6 w-6 text-black" />
          </button>
          <button className="p-2" disabled={!canInteract}>
            <CiChat1 className="h-6 w-6 text-black" />
          </button>
        </div>

        <textarea
          value={message}
          onChange={handleChangeMessage}
          onKeyDown={handleKeyDown}
          placeholder={
            canInteract ? "Type your message..." : "Không thể gửi tin nhắn"
          }
          className={`flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden ${
            !canInteract ? "cursor-not-allowed bg-gray-100" : ""
          }`}
          rows={1}
          ref={textareaRef}
          readOnly={!canInteract}
          disabled={!canInteract}
        />

        <div
          className={`flex ml-2 ${
            !canInteract ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <button className="p-2" disabled={!canInteract}>
            <FaRegSmile className="h-6 w-6 text-black" />
          </button>
          <button
            className="p-2"
            onClick={handleSendMessage}
            disabled={!canInteract}
          >
            {message ? (
              <IoSendSharp
                className={`h-6 w-6 ${
                  canInteract ? "text-blue-600" : "text-gray-400"
                }`}
              />
            ) : (
              <BiSolidLike
                className={`h-6 w-6 ${
                  canInteract ? "text-yellow-400" : "text-gray-400"
                }`}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
