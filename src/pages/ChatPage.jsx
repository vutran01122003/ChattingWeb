import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from 'react-spinners'

import { authSelector } from "../redux/selector";
import { createOrGetConversation, getConversationMessages } from '../redux/thunks/chatThunks';
import ChatHeader from '../components/header/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import useChat from '../hooks/useChat';

export default function ChatPage() {
    const dispatch = useDispatch();
    const { otherId } = useParams();
    const [isHidden, setIsHidden] = useState(false);
    const conversationId = useSelector(state => state.chat.friendConversations[0]?.conversation_id);
    const fetchMessages = useSelector(state => state.chat.messages);
    const { user } = useSelector(authSelector);
    const [messages, setMessages] = useState(fetchMessages);
    const [otherUser, setOtherUser] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [previousScrollHeightArr, setPreviousScrollHeightArr] = useState([]);
    const containerRef = useRef(null);
    const messagesEndRef = useRef(null);

    const {
        handleSendMessage,
        handleImageUpload,
        handleFileUpload
    } = useChat(conversationId, setMessages);

    useEffect(() => {
        if (conversationId) {
            dispatch(getConversationMessages({ conversationId })).then((res) => {
                setMessages(res.payload.messages);
            });
        }
    }, [conversationId, dispatch]);

    useEffect(() => {
        const initConversation = async () => {
            try {
                const res = await dispatch(createOrGetConversation({ otherUserId: otherId }));
                if (res?.payload?.other_user) {
                    setOtherUser(res.payload.other_user);
                }
            } catch (err) {
                console.error("Lỗi khi khởi tạo cuộc trò chuyện:", err);
            }
        };

        initConversation();
        setTimeout(() => setLoading(false), 2000);
    }, [otherId, dispatch]);

    useEffect(() => {
        setPreviousScrollHeightArr(prev => [...prev, containerRef.current.scrollHeight]);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (previousScrollHeightArr.length > 1) {
            containerRef.current.scrollTop = previousScrollHeightArr[previousScrollHeightArr.length - 1] - previousScrollHeightArr[previousScrollHeightArr.length - 2];
        }
    }, [previousScrollHeightArr])


    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type === 1) {
                setIsHidden(true);
                window.location.href = "/";
            }
        }
    }, []);

    if (isHidden) return null;

    const loadMoreMessages = async () => {
        if (!conversationId || !hasMore) return;
        const res = await dispatch(getConversationMessages({ conversationId, page: page + 1 }));
        const newMessages = res.payload?.messages || [];

        if (newMessages.length === 0) {
            setHasMore(false);
        } else {
            setMessages(prev => [...prev, ...newMessages]);
            setPage(prev => prev + 1);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white relative">
            <div className='mt-[50px] z-50 absolute right-[50%] top-4'>
                <ClipLoader color="#36d7b7" loading={loading} size={50} />
            </div>
            <ChatHeader otherUser={otherUser} />
            <MessageList
                messages={messages}
                user={user}
                containerRef={containerRef}
                messagesEndRef={messagesEndRef}
                loadMoreMessages={loadMoreMessages}
            />

            <MessageInput
                onSendMessage={handleSendMessage}
                onImageUpload={handleImageUpload}
                onFileUpload={handleFileUpload}
            />
        </div>
    );
}