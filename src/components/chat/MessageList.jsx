import { useState } from 'react';
import Message from './Message';
import DateHeader from '../header/DateHeader';

export default function MessageList({ messages, user, containerRef, messagesEndRef, loadMoreMessages }) {
    const [selectedImagePreview, setSelectedImagePreview] = useState(null);
    let lastDate = null;
    
    return (
        <>
            {selectedImagePreview && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" 
                    onClick={() => setSelectedImagePreview(null)}
                >
                    <img 
                        src={selectedImagePreview} 
                        alt="Preview" 
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded" 
                    />
                </div>
            )}
            
            <div 
                className="flex-1 overflow-y-auto px-4 py-2 bg-gray-100"
                ref={containerRef}
                onScroll={_ => {
                    if (containerRef.current.scrollTop === 0) {
                        loadMoreMessages();
                    }
                }}
            >
                {[...messages].reverse().map((msg) => {
                    const messageDate = new Date(msg.createdAt);
                    const currentDateStr = messageDate.toDateString();
                    const showDateHeader = currentDateStr !== lastDate;
                    
                    if (showDateHeader) lastDate = currentDateStr;
                    
                    return (
                        <div key={msg._id || msg.id}>
                            {showDateHeader && (
                                <DateHeader date={msg.createdAt} />
                            )}
                            <Message 
                                message={msg} 
                                isMe={msg.sender?._id === user?._id}
                                onImageClick={setSelectedImagePreview}
                                containerRef={containerRef}
                            />
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </>
    );
}