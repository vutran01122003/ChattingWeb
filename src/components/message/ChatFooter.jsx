import { Smile, Send } from "lucide-react";
import { useState } from "react";

function ChatFooter() {
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;

        console.log("Sending message:", newMessage);
        setNewMessage("");
    };

    return (
        <footer className="bg-white border-t border-gray-200 p-3">
            <form onSubmit={handleSendMessage} className="flex items-center">
                <button type="button" className="p-2 rounded-full hover:bg-gray-100">
                    <Smile size={24} color="#666" />
                </button>

                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Nhập tin nhắn"
                />

                <button type="submit" className="p-2 rounded-full hover:bg-gray-100" disabled={!newMessage.trim()}>
                    <Send size={22} color={newMessage.trim() ? "#1e88e5" : "#666"} />
                </button>
            </form>
        </footer>
    );
}

export default ChatFooter;
