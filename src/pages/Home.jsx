import React, { useState } from 'react';
import { Heart, Phone, Video, Search, ChevronLeft, Smile, Paperclip, Image as ImageIcon, Send } from 'lucide-react';
import { useOutletContext } from 'react-router';

function HomePage() {
    const selectedUser = useOutletContext();
  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <ChatInterface selectedUser={selectedUser} />
    </div>
  );
}

function ChatInterface({ selectedUser }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    console.log("Sending message:", newMessage);
    setNewMessage('');
  };

  return (
    <>
      <header className="bg-white shadow-sm flex items-center p-3 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img 
            src={selectedUser?.avatar_url || "https://randomuser.me/api/portraits/men/32.jpg"} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg">{selectedUser?.full_name || "User"}</h2>
          <p className="text-gray-500 text-xs">Đang hoạt động</p>
        </div>
        <button className="p-2 mx-1 rounded-full hover:bg-gray-100">
          <Phone size={20} />
        </button>
        <button className="p-2 mx-1 rounded-full hover:bg-gray-100">
          <Video size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
      </main>

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
    </>
  );
}

export default HomePage;
