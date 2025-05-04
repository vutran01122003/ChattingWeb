import { useState, useEffect, useRef } from "react";
import { BsCheckAll } from "react-icons/bs";
import Message from "./Message";
import DateHeader from "../header/DateHeader";

export default function MessageList({
    messages,
    user,
    containerRef,
    messagesEndRef,
    loadMoreMessages,
    otherUser,
    conversation,
    handleDeleteMessage,
    handleRevokeMessage,
    handleFowardMessage,
    handleAddReaction,
    handleUnreaction
}) {
    const [selectedImagePreview, setSelectedImagePreview] = useState(null);

    const reversedMessages = [...messages].slice().reverse();

    let lastDate = null;
    const MessageListComponent = ({ keyRender, conversation, showDateHeader, messageDate, msg, otherUser, index }) => {
        if (!conversation?.is_group && !msg.deleted_by.includes(user?._id)) {
            return (
                <div key={keyRender}>
                    {showDateHeader && <DateHeader date={messageDate} />}
                    <Message
                        message={msg}
                        isMe={msg.sender?._id === user?._id}
                        onImageClick={setSelectedImagePreview}
                        containerRef={containerRef}
                        otherUser={otherUser}
                        handleDeleteMessage={handleDeleteMessage}
                        handleRevokeMessage={handleRevokeMessage}
                        handleFowardMessage={handleFowardMessage}
                        handleAddReaction={handleAddReaction}
                        handleUnreaction={handleUnreaction}
                        isRevoked={msg.is_revoked}
                    />
                    {otherUser && !msg.read_by.includes(otherUser[0]._id) ? (
                        <div className="z-50 flex justify-end items-center mb-2">
                            <div className="text-xs text-white bg-gray-300 px-2 py-1 opacity-80 flex items-center rounded-lg gap-1">
                                <BsCheckAll className="text-white" />
                                Đã nhận
                            </div>
                        </div>
                    ) : (
                        index === reversedMessages.length - 1 && (
                            <div className="z-50 flex justify-end items-center mb-2">
                                <img
                                    src={otherUser ? otherUser[0].avatar_url : null}
                                    alt="Avatar"
                                    className="w-4 h-4 rounded-full"
                                    title="Đã xem"
                                />
                            </div>
                        )
                    )}
                </div>
            );
        }
        if (conversation?.is_group && !msg.deleted_by.includes(user?._id)) {
            return (
                <div key={keyRender}>
                    {showDateHeader && <DateHeader date={messageDate} />}
                    <Message
                        message={msg}
                        isMe={msg.sender?._id === user?._id}
                        onImageClick={setSelectedImagePreview}
                        containerRef={containerRef}
                        otherUser={otherUser}
                        handleDeleteMessage={handleDeleteMessage}
                        handleRevokeMessage={handleRevokeMessage}
                        handleFowardMessage={handleFowardMessage}
                        handleAddReaction={handleAddReaction}
                        handleUnreaction={handleUnreaction}
                        isRevoked={msg.isRevoked}
                    />
                </div>
            );
        }
    };

    return (
        <>
            {selectedImagePreview && (
                <div
                    className="fixed inset-0 bg-black opacity-30 flex items-center justify-center z-50"
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
                onScroll={(e) => {
                    if (containerRef.current.scrollTop === 0) {
                        loadMoreMessages();
                    }
                }}
            >
                {reversedMessages.map((msg, idx) => {
                    const messageDate = new Date(msg.createdAt || Date.now());
                    const currentDateStr = messageDate.toDateString();
                    const showDateHeader = currentDateStr !== lastDate;

                    if (showDateHeader) lastDate = currentDateStr;

                    const key = msg._id || msg.id || `msg-${idx}-${Date.now()}`;

                    return (
                        <MessageListComponent
                            key={key}
                            keyRender={key}
                            conversation={conversation}
                            showDateHeader={showDateHeader}
                            messageDate={messageDate}
                            msg={msg}
                            otherUser={otherUser}
                            index={idx}
                        />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </>
    );
}
