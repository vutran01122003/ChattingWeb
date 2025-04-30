import { useState, useRef, useEffect, useMemo } from 'react';
import { FaReplyAll, FaShare } from 'react-icons/fa';
import { MdOutlineMoreHoriz } from "react-icons/md";
import { FaSmile } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import MessageMenu from './MessageMenu';
import FileAttachment from './FileAttachment';

import { useDispatch, useSelector } from 'react-redux';
import { addReaction, fetchConversations } from '../../redux/thunks/chatThunks'
import { socketSelector } from "../../redux/selector";
import ShareModal from '../modal/ShareModal';

export default function Message({ message: msg, isMe, onImageClick, containerRef, otherUser, handleDeleteMessage, handleRevokeMessage, isRevoked, handleFowardMessage }) {
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const [activeMenuMessageId, setActiveMenuMessageId] = useState(null);
    const [currentYScroll, setCurrentYScroll] = useState(0);
    const [hoveredReactions, setHoveredReactions] = useState(null);
    const [showReactions, setShowReactions] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const messageRefs = useRef({});
    const reactionRef = useRef(null);
    const dispatch = useDispatch();
    const { friendConversations, strangerConversations, groupConversations } = useSelector((state) => state.chat);
    const conversations = useMemo(() => {
        return [...friendConversations, ...strangerConversations, ...groupConversations];
    }, [friendConversations, strangerConversations, groupConversations]);

    const handleMouseEnter = (msg, e) => {
        if (messageRefs.current && e.currentTarget) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const msgRect = e.currentTarget.getBoundingClientRect();
            const y = msgRect.top - containerRect.top;
            setCurrentYScroll(containerRect.height - y);
        }
        setHoveredMessageId(msg._id);
        setHoveredReactions(msg._id);
    };
    const handleMouseLeave = () => {
        setHoveredMessageId(null);
        setHoveredReactions(null);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (reactionRef.current && !reactionRef.current.contains(event.target)) {
                setShowReactions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleReaction = async (emoji) => {
        const emojiMap = {
            "❤️": ":heart",
            '👍': ":like",
            '🤣': ":haha",
            '😮': ":wow",
            '😭': ":huhu",
            '😡': ":angry"
        }
        dispatch(addReaction({ messageId: msg._id, reaction: emojiMap[emoji] }));
        setShowReactions(false);
    };
    const convertTextToEmoji = (reaction) => {
        const emojiMap = {
            ":heart": "❤️",
            ":like": '👍',
            ":haha": '🤣',
            ":wow": '😮',
            ":huhu": '😭',
            ":angry": '😡',
        }
        return emojiMap[reaction] || reaction;
    }
    // Handle revoked messages
    if (isRevoked) {
        return (
            <div className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                    <img
                        src={msg.sender?.avatar_url}
                        alt={msg.sender?.full_name}
                        className="w-10 h-10 rounded-full mr-2 self-end"
                    />
                )}
                <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${isMe ? 'bg-blue-100 text-blue-900' : 'bg-white text-gray-800'}`}>
                    Tin nhắn đã được thu hồi
                </div>
            </div>
        )
    } else {
        if (msg.attachments?.length > 1) {
            return (
                <>
                    <div
                        className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        onMouseEnter={(e) => handleMouseEnter(msg, e)}
                        onMouseLeave={() => handleMouseLeave()}
                        ref={(el) => (messageRefs.current[msg._id] = el)}
                    >
                        {!isMe && (
                            <img
                                src={msg.sender?.avatar_url}
                                alt={msg.sender?.full_name}
                                className="w-10 h-10 rounded-full mr-2 self-end"
                            />
                        )}
                        <div className="grid grid-cols-2 gap-2 max-w-lg rounded-lg p-2 relative">
                            {msg.attachments.map((img) => (
                                <div key={img._id} className="p-1 rounded-md shadow-sm">
                                    <img
                                        src={img.file_path}
                                        alt={img.file_name}
                                        className="rounded-md object-cover max-h-[150px] w-full cursor-pointer"
                                        onClick={() => onImageClick(img.file_path)}
                                    />
                                </div>
                            ))}
                            <div className="col-span-2 text-right text-xs text-gray-500 mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {hoveredMessageId === msg._id && (
                                <div className={`message-actions absolute top-1/2 transform -translate-y-1/2 z-10
                                flex items-center justify-center gap-1 p-1 bg-white shadow-md rounded-full
                                transition-opacity duration-200
                                opacity-100 group-hover:opacity-100
                                ${isMe ? 'left-[-150px]' : "right-[-150px]"}`}>
                                    <button
                                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                                        title="Trả lời">
                                        <FaReplyAll className='text-gray-600' />
                                    </button>
                                    <button
                                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                                        title="Chia sẻ"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShareModalOpen(true);
                                        }}>
                                        <FaShare className='text-gray-600' />
                                    </button>
                                    <button
                                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                                        title="Tùy chọn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuMessageId(activeMenuMessageId === msg._id ? null : msg._id);
                                        }}>
                                        <MdOutlineMoreHoriz className='text-gray-600' />
                                    </button>
                                </div>
                            )}
                            {
                                (hoveredReactions || msg.reactions?.length > 0) && (
                                    <button
                                        className="absolute w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                                        title="Biểu cảm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowReactions(!showReactions);
                                        }}>
                                        {msg.reactions?.length > 0 ?
                                            < div className="flex items-center">
                                                {msg.reactions.slice(-3).map((reaction, index) => {
                                                    return <span key={reaction._id}>{convertTextToEmoji(reaction.emoji)}</span>
                                                })}
                                                {msg.reactions.length > 3 &&
                                                    <span className="text-xs ml-1">+{msg.reactions.length - 3}</span>
                                                }
                                            </div>
                                            : (<SlLike className='text-gray-600' />)}
                                    </button>
                                )
                            }

                            {/* Reaction panel popup */}
                            {showReactions && (
                                <div
                                    ref={reactionRef}
                                    className="absolute z-20 bg-white rounded-full shadow-lg p-2 flex items-center gap-2"
                                    style={{
                                        top: '-50px',
                                        left: isMe ? '-80%' : '0',
                                        transform: isMe ? 'translateX(-50%)' : 'none'
                                    }}
                                >
                                    {['👍', '❤️', '🤣', '😮', '😭', '😡'].map((emoji) => (
                                        <button
                                            key={emoji}
                                            className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded-full transition-transform hover:scale-125"
                                            onClick={() => handleReaction(emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Message menu popup */}
                            {activeMenuMessageId === msg._id && (
                                <MessageMenu
                                    isMe={isMe}
                                    currentYScroll={currentYScroll}
                                    onClose={() => setActiveMenuMessageId(null)}
                                    otherUser={otherUser}
                                    msg={msg}
                                    handleDeleteMessage={handleDeleteMessage}
                                    handleRevokeMessage={handleRevokeMessage}
                                />
                            )}
                        </div>
                    </div>
                    <ShareModal
                        isOpen={shareModalOpen}
                        onClose={() => setShareModalOpen(false)}
                        message={msg}
                        conversations={conversations}
                        onShare={handleFowardMessage}
                    />
                </>
            );
        }

        return (
            <>
                <div
                    className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'} relative group`}
                    onMouseEnter={(e) => handleMouseEnter(msg, e)}
                    onMouseLeave={() => handleMouseLeave()}
                    ref={(el) => (messageRefs.current[msg._id] = el)}
                >
                    {!isMe && (
                        <img
                            src={msg.sender?.avatar_url}
                            alt={msg.sender?.full_name}
                            className="w-10 h-10 rounded-full mr-2 self-end"
                        />
                    )}
                    <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${isMe ? 'bg-blue-100 text-blue-900' : 'bg-white text-gray-800'} relative`}>
                        {/* File attachments */}
                        {msg.attachments?.length > 0 && (
                            <div className={`${msg.attachments.length > 1 ? 'grid grid-cols-2 gap-2' : ''} mb-2`}>
                                {msg.attachments.map((file) => (
                                    <FileAttachment
                                        key={file._id}
                                        file={file}
                                        onImageClick={onImageClick}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Message content */}
                        {msg.content && (
                            <div className="text-sm">{msg.content}</div>
                        )}

                        {/* Timestamp */}
                        <div className="text-right mt-1 text-xs text-gray-500">
                            {msg.timestamp || new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>

                        {/* Message Actions - Visible on hover */}
                        {hoveredMessageId === msg._id && (
                            <div className={`message-actions absolute top-1/2 transform -translate-y-1/2 z-10
                                flex items-center justify-center gap-1 p-1 bg-white shadow-md rounded-full
                                transition-opacity duration-200
                                opacity-100 group-hover:opacity-100
                                ${isMe ? 'left-[-200px]' : "right-[-200px]"}`}>
                                <button
                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                                    title="Trả lời">
                                    <FaReplyAll className='text-gray-600' />
                                </button>
                                <button
                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                                    title="Chia sẻ"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShareModalOpen(true);
                                    }}>
                                    <FaShare className='text-gray-600' />
                                </button>
                                <button
                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                                    title="Tùy chọn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuMessageId(activeMenuMessageId === msg._id ? null : msg._id);
                                    }}>
                                    <MdOutlineMoreHoriz className='text-gray-600' />
                                </button>
                            </div>
                        )}
                        {
                            (hoveredReactions || msg.reactions.length > 0) && (
                                <button
                                    className="absolute w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                                    title="Biểu cảm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowReactions(!showReactions);
                                    }}>
                                    {msg.reactions?.length > 0 ?
                                        < div className="flex items-center">
                                            {msg.reactions.slice(-3).map((reaction, index) => (
                                                <span key={reaction._id}>{convertTextToEmoji(reaction.emoji)}</span>
                                            ))}
                                            {msg.reactions.length > 3 &&
                                                <span className="text-xs ml-1">+{msg.reactions.length - 3}</span>
                                            }
                                        </div>
                                        : (<SlLike className='text-gray-600' />)}
                                </button>
                            )
                        }
                        {/* Reaction panel popup */}
                        {showReactions && (
                            <div
                                ref={reactionRef}
                                className="absolute z-20 bg-white rounded-full shadow-lg p-2 flex items-center gap-2"
                                style={{
                                    top: '-50px',
                                    left: isMe ? '-80%' : '0',
                                    transform: isMe ? 'translateX(-50%)' : 'none'
                                }}
                            >
                                {['👍', '❤️', '🤣', '😮', '😭', '😡'].map((emoji) => (
                                    <button
                                        key={emoji}
                                        className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded-full transition-transform hover:scale-125"
                                        onClick={() => handleReaction(emoji)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Message menu popup */}
                        {activeMenuMessageId === msg._id && (
                            <MessageMenu
                                isMe={isMe}
                                currentYScroll={currentYScroll}
                                onClose={() => setActiveMenuMessageId(null)}
                                otherUser={otherUser}
                                msg={msg}
                                handleDeleteMessage={handleDeleteMessage}
                                handleRevokeMessage={handleRevokeMessage}
                            />
                        )}

                    </div>
                </div>
                <ShareModal
                    isOpen={shareModalOpen}
                    onClose={() => setShareModalOpen(false)}
                    message={msg}
                    conversations={conversations}
                    onShare={handleFowardMessage}
                />
            </>
        );
    }
}