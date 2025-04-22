import { useDispatch } from "react-redux";
import { sendMessage, sendMessageWithFiles } from "../redux/thunks/chatThunks";

export default function useChat(conversationId, setMessages) {
    const dispatch = useDispatch();

    const handleSendMessage = (messageContent) => {
        if (messageContent.trim() && conversationId) {
            try {
                dispatch(sendMessage({ 
                    conversationId, 
                    content: messageContent 
                }))
                .then((action) => {
                    if (action.payload) {
                        setMessages(prev => [...prev, action.payload]);
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

        files.forEach(file => {
            formData.append("files", file);
        });
        
        try {
            const result = await dispatch(sendMessageWithFiles(formData));
            if (result.payload) {
                setMessages(prev => [...prev, result.payload]);
            }
            e.target.value = ''; // Reset input
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

        files.forEach(file => {
            formData.append("files", file);
        });
        
        try {
            const result = await dispatch(sendMessageWithFiles(formData));
            if (result.payload) {
                setMessages(prev => [...prev, result.payload]);
            }
            e.target.value = ''; 
        } catch (error) {
            console.error("Lỗi khi gửi file:", error);
            alert("Gửi file thất bại. Vui lòng thử lại.");
        }
    };

    return {
        handleSendMessage,
        handleImageUpload,
        handleFileUpload
    };
}