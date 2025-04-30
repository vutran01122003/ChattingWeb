import { useDispatch, useSelector } from "react-redux";
import {
    sendMessage,
    sendMessageWithFiles,
    markAsReadMessage,
    deleteMessage,
    revokeMessage,
    forwardMessage,
    addReaction,
    unReactionMessage
} from "../redux/thunks/chatThunks";
import { getConversationMessages } from "../redux/thunks/chatThunks";

import { socketSelector } from "../redux/selector";

export default function useChat(conversationId, setMessages) {
    const dispatch = useDispatch();
    const socket = useSelector(socketSelector);

    const handleSendMessage = (messageContent) => {
        if (messageContent.trim() && conversationId && socket) {
            try {
                dispatch(
                    sendMessage({
                        conversationId,
                        content: messageContent
                    })
                ).then((action) => {
                    if (action.payload) {
                        dispatch(getConversationMessages({ conversationId })).then((res) => {
                            setMessages(res.payload.messages);
                        });
                        socket.emit("send_message", action.payload);
                    }
                });
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
                alert("Gửi tin nhắn thất bại. Vui lòng thử lại.");
            }
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0 || !conversationId) return;

        const formData = new FormData();
        formData.append("conversation_id", conversationId);

        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const result = await dispatch(sendMessageWithFiles(formData));
            if (result.payload) {
                dispatch(getConversationMessages({ conversationId })).then((res) => {
                    setMessages(res.payload.messages);
                });
                socket.emit("send_message", result.payload);
            }
            e.target.value = ""; // Reset input
        } catch (error) {
            console.error("Lỗi khi gửi ảnh:", error);
            alert("Gửi ảnh thất bại. Vui lòng thử lại.");
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0 || !conversationId) return;

        const formData = new FormData();
        formData.append("conversation_id", conversationId);

        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const result = await dispatch(sendMessageWithFiles(formData));
            if (result.payload) {
                dispatch(getConversationMessages({ conversationId })).then((res) => {
                    setMessages(res.payload.messages);
                });
                socket.emit("send_message", result.payload);
            }
            e.target.value = "";
        } catch (error) {
            console.error("Lỗi khi gửi file:", error);
            alert("Gửi file thất bại. Vui lòng thử lại.");
        }
    };

    const handleMarkAsRead = async () => {
        try {
            if (conversationId) {
                const result = await dispatch(markAsReadMessage({ conversationId }));
                if (result) {
                    socket.emit("mark_read", { conversation_id: conversationId, success: result.payload.success });
                }
            }
        } catch (error) {}
    };

    const handleDeleteMessage = async ({ messageId }) => {
        dispatch(deleteMessage({ messageId }));
        socket.emit("delete_message", { conversation_id: conversationId, messageId });
    };

    const handleRevokeMessage = async ({ messageId }) => {
        dispatch(revokeMessage({ messageId }));
        socket.emit("revoke_message", { conversation_id: conversationId, messageId });
    };

    const handleFowardMessage = async ({ messageId, targetConversationId }) => {
        for (const conversation of targetConversationId) {
            dispatch(forwardMessage({ messageId, targetConversationId: conversation })).then((_) => {
                socket.emit("forward_message", { conversation_id: conversationId });
            });
        }
    };

    const handleAddReaction = async ({ messageId, reaction }) => {
        dispatch(addReaction({ messageId, reaction })).then((_) => {
            socket.emit("add_reaction", { conversation_id: conversationId });
        });
    };
    const handleUnreaction = ({ messageId }) => {
        dispatch(unReactionMessage(messageId)).then((_) => {
            socket.emit("remove_reaction", { conversation_id: conversationId });
        });
    };

    return {
        handleSendMessage,
        handleImageUpload,
        handleFileUpload,
        handleMarkAsRead,
        handleDeleteMessage,
        handleRevokeMessage,
        handleFowardMessage,
        handleAddReaction,
        handleUnreaction
    };
}
