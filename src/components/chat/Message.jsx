import { useState, useRef } from 'react';
import { FaReplyAll, FaShare } from 'react-icons/fa';
import { MdOutlineMoreHoriz } from "react-icons/md";
import MessageMenu from './MessageMenu';
import FileAttachment from './FileAttachment';

export default function Message({ message: msg, isMe, onImageClick, containerRef }) {
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const [activeMenuMessageId, setActiveMenuMessageId] = useState(null);
    const [currentYScroll, setCurrentYScroll] = useState(0);
    const messageRefs = useRef({});

    const handleMouseEnter = (msg, e) => {
        setHoveredMessageId(msg._id);
        if (messageRefs.current && e.currentTarget) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const msgRect = e.currentTarget.getBoundingClientRect();
            const y = msgRect.top - containerRect.top;
            setCurrentYScroll(containerRect.height - y);
        }
    };

    // Handle multi-image display
    if (msg.attachments?.length > 1) {
        return (
            <div
                className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'}`}
                onMouseEnter={() => setHoveredMessageId(msg._id)}
                onMouseLeave={() => setHoveredMessageId(null)}
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
                                title="Biểu cảm">
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

                    {/* Message menu popup */}
                    {activeMenuMessageId === msg._id && (
                        <MessageMenu
                            isMe={isMe}
                            currentYScroll={currentYScroll}
                            onClose={() => setActiveMenuMessageId(null)}
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'} relative group`}
            onMouseEnter={(e) => handleMouseEnter(msg, e)}
            onMouseLeave={() => setHoveredMessageId(null)}
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
                            ${isMe ? 'left-[-150px]' : "right-[-150px]"}`}>
                        <button
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                            title="Trả lời">
                            <FaReplyAll className='text-gray-600' />
                        </button>
                        <button
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                            title="Biểu cảm">
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

                {/* Message menu popup */}
                {activeMenuMessageId === msg._id && (
                    <MessageMenu
                        isMe={isMe}
                        currentYScroll={currentYScroll}
                        onClose={() => setActiveMenuMessageId(null)}
                    />
                )}
            </div>
        </div>
    );
}