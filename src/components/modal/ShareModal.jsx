import { useState } from 'react';
import Modal from 'react-modal';
import { IoMdClose } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';


Modal.setAppElement('#root'); // Thay thế '#root' bằng element id của app của bạn nếu cần

export default function ShareModal({ isOpen, onClose, message, onShare, conversations }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContacts, setSelectedContacts] = useState([]);


    const recentContacts = conversations.filter(chat => {
        return "last_message" in chat;
    })


    const filteredContacts = ( _ =>{
        if(searchTerm.length > 0){
            recentContacts.filter(chat => {
                if(chat.conversation_type === "group"){
                    return chat.group_name.toLowerCase().includes(searchTerm.toLowerCase())
                }else {          
                    return chat.other_user[0].full_name.toLowerCase().includes(searchTerm.toLowerCase())
                }
            })
        }
        return recentContacts;
    })()

    const toggleContactSelection = (contactId) => {
        if (selectedContacts.includes(contactId)) {
            setSelectedContacts(selectedContacts.filter(id => id !== contactId));
        } else {
            setSelectedContacts([...selectedContacts, contactId]);
        }
    };

    const handleShare = () => {
        if (selectedContacts.length > 0) {
            onShare({messageId: message._id, targetConversationId: selectedContacts});
            onClose();
        }
    };
    const RenderContactList = ({ chat }) => {
        if (chat && chat.conversation_type !== "group") {
            return (
                <div
                    key={chat.conversation_id}
                    className="flex items-center py-2"
                >
                    <input
                        type="checkbox"
                        id={`contact-${chat.conversation_id}`}
                        checked={selectedContacts.includes(chat.conversation_id)}
                        onChange={() => toggleContactSelection(chat.conversation_id)}
                        className="mr-3 h-5 w-5 cursor-pointer"
                    />
                    <img
                        src={chat.other_user[0].avatar_url}
                        alt={chat.other_user[0].full_name}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <label
                        htmlFor={`contact-${chat.conversation_id}`}
                        className="cursor-pointer flex-grow"
                    >
                        {chat.other_user[0].full_name}
                    </label>
                </div>
            )
        }else if(chat && chat.conversation_type === "group") {
            return (
                <div
                    key={chat.conversation_id}
                    className="flex items-center py-2"
                >
                    <input
                        type="checkbox"
                        id={`contact-${chat.conversation_id}`}
                        checked={selectedContacts.includes(chat.conversation_id)}
                        onChange={() => toggleContactSelection(chat.conversation_id)}
                        className="mr-3 h-5 w-5 cursor-pointer"
                    />
                    <img
                        src={chat.group_avatar}
                        alt={chat.group_name}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <label
                        htmlFor={`contact-${chat.conversation_id}`}
                        className="cursor-pointer flex-grow"
                    >
                        {chat.group_name}
                    </label>
                </div>
            )
        }

    }
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            maxWidth: '90%',
            padding: '0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: 'none',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Chia sẻ"
        >
            <div className="relative flex flex-col h-full">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <h2 className="text-xl font-medium">Chia sẻ</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-4 py-3">
                    <div className="relative">
                        <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border-b">
                    <div className="flex px-4">
                        <button className="py-3 px-4 border-b-2 border-blue-500 text-blue-500 font-medium">
                            Gần đây
                        </button>
                    </div>
                </div>

                {/* Contact List */}
                <div className="px-4 py-2 overflow-y-auto flex-grow max-h-60">
                    {filteredContacts.map(chat => <RenderContactList key={chat.conversation_id} chat={chat} />)}
                </div>

                {/* Message Preview */}
                <div className="bg-gray-100 p-4 mx-4 my-3 rounded-lg">
                    <div className="text-gray-700 font-medium mb-1">Chia sẻ tin nhắn</div>
                    <div className="text-gray-600 text-sm">
                        {message?.content || ""}
                        {message?.attachments?.length > 0 &&
                            <div className="mt-1 text-xs text-gray-500">
                                {message.attachments.length} tệp đính kèm
                            </div>
                        }
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-4 py-3 flex justify-end border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleShare}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md ${selectedContacts.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                            }`}
                        disabled={selectedContacts.length === 0}
                    >
                        Chia sẻ
                    </button>
                </div>
            </div>
        </Modal>
    );
}