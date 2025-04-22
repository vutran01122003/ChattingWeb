import { useState, useRef, useEffect } from 'react';
import { FaRegSmile, FaRegAddressCard } from 'react-icons/fa';
import { CiChat1 } from "react-icons/ci";
import { AiOutlinePicture, AiOutlinePaperClip } from "react-icons/ai";
import { LuSticker } from "react-icons/lu";
import { IoSendSharp } from "react-icons/io5";
import { BiSolidLike } from "react-icons/bi";
import EmojiPicker from './EmojiPicker';
import FilePopup from './FilePopup';

export default function MessageInput({ onSendMessage, onImageUpload, onFileUpload }) {
    const [message, setMessage] = useState('');
    const [showStickerPopup, setShowStickerPopup] = useState(false);
    const [showFilePopup, setShowFilePopup] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.popup-container')) {
                setShowStickerPopup(false);
                setShowFilePopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const handleChangeMessage = (e) => {
        const value = e.target.value;
        const wordCount = value.trim().split(/\s+/).length;

        if (wordCount <= 200) {
            setMessage(value);
        } else {
            alert("Bạn đã vượt quá số lượng từ tối đa cho phép là 200 từ.");
            setMessage(value.split(/\s+/).slice(0, 200).join(" "));
        }
    };

    const handleEmojiClick = (emoji) => {
        setMessage(prev => prev + emoji);
        setShowStickerPopup(false);
    };

    return (
        <div className="border-t p-2 flex items-center relative">
            <div className="flex space-x-2 mr-2">
                {/* Sticker button with popup */}
                <div className="relative popup-container">
                    <button className="p-2" onClick={() => {
                        setShowStickerPopup(!showStickerPopup);
                        setShowFilePopup(false);
                    }}>
                        <LuSticker className="h-6 w-6 text-black" />
                    </button>
                    {showStickerPopup && (
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    )}
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
                    <button className="p-2" onClick={() => {
                        setShowFilePopup(!showFilePopup);
                        setShowStickerPopup(false);
                    }}>
                        <AiOutlinePaperClip className="h-6 w-6 text-black" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={onFileUpload}
                    />
                    {showFilePopup && (
                        <FilePopup onFileSelect={() => fileInputRef.current?.click()} />
                    )}
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
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                rows={1}
                ref={textareaRef}
            />

            <div className="flex ml-2">
                <button className="p-2">
                    <FaRegSmile className="h-6 w-6 text-black" />
                </button>
                <button className="p-2" onClick={handleSendMessage}>
                    {message ? (<IoSendSharp className="h-6 w-6 text-blue-600" />) :
                        (<BiSolidLike className="h-6 w-6 text-yellow-400" />)}
                </button>
            </div>
        </div>
    );
}