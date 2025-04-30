import { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

import ChatHeader from "../components/header/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import useChat from "../hooks/useChat";
import FriendRequest from "../components/chat/FriendRequest";
import {
    sendFriendRequest,
    checkSendFriendRequest,
    cancelFriendRequest,
    checkFriendShip,
    unfriendUser,
    acceptFriendRequest
} from "../redux/slices/friendSlice";
import { authSelector, socketSelector } from "../redux/selector";
import { getConversation, getConversationMessages, fetchConversations } from "../redux/thunks/chatThunks";

export default function ChatPage() {
    const dispatch = useDispatch();
    const socket = useSelector(socketSelector);
    const [isHidden, setIsHidden] = useState(false);
    const { isFriend, isSentRequest, isReceiveRequest } = useSelector((state) => state.friendship);
    const { conversationId } = useParams();
    const a = useParams();

    const fetchMessages = useSelector((state) => state.chat.messages);
    const { user } = useSelector(authSelector);
    const [messages, setMessages] = useState(fetchMessages);
    const [otherUser, setOtherUser] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [isReactionUpdating, setIsReactionUpdating] = useState(false);
    const [previousScrollHeightArr, setPreviousScrollHeightArr] = useState([]);
    const [userTyping, setUserTyping] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const [conversation, setConversation] = useState(null);
    const typingTimeoutRef = useRef(null);
    const containerRef = useRef(null);
    const messagesEndRef = useRef(null);

    const handleSendFriendRequest = (event) => {
        event.preventDefault();
        dispatch(sendFriendRequest({ friendId: otherUser[0]._id }));

        setTimeout(() => {
            dispatch(checkSendFriendRequest({ friendId: otherUser[0]._id }));
        }, 1000);
    };

    const handleAcceptFriendRequest = (event) => {
        event.preventDefault();
        dispatch(acceptFriendRequest({ receiverId: otherUser[0]._id }));
    };

    const handleCancelFriendRequest = (event) => {
        event.preventDefault();
        dispatch(cancelFriendRequest({ friendId: otherUser[0]._id }));

        setTimeout(() => {
            dispatch(checkSendFriendRequest({ friendId: otherUser[0]._id }));
        }, 1000);
    };

    const handleUnfriendUser = (event) => {
        event.preventDefault();
        dispatch(unfriendUser({ friendId: otherUser[0]._id }));

        setTimeout(() => {
            dispatch(checkFriendShip({ friendId: otherUser[0]._id }));
        }, 1000);
    };

    const pageRef = useRef(page);
    const scrollRef = useRef(0);
    const location = useLocation();
    const {
        handleSendMessage,
        handleImageUpload,
        handleFileUpload,
        handleMarkAsRead,
        handleDeleteMessage,
        handleRevokeMessage,
        handleFowardMessage,
        handleAddReaction,
        handleUnreaction
    } = useChat(conversationId, setMessages);

    useEffect(() => {
        setConversation(location.state?.chat);
        if (conversationId && socket) {
            dispatch(getConversationMessages({ conversationId })).then((res) => {
                setMessages(res.payload.messages);
                setIsReactionUpdating(false);
                socket.emit("focus_chat_page", { conversation_id: conversationId });
                dispatch(fetchConversations());
            });
        }
    }, [socket, conversationId, dispatch]);

    useEffect(() => {
        if (socket && conversationId) {
            socket.emit("join_conversation", conversationId);
            socket.on("message_read", (data) => {
                if (data) {
                    dispatch(getConversationMessages({ conversationId })).then((res) => {
                        setMessages(res.payload.messages);
                    });
                }
            });
            socket.on("receive_message", (message) => {
                if (message.conversation_id === conversationId) {
                    dispatch(getConversationMessages({ conversationId })).then((res) => {
                        setMessages(res.payload.messages);
                    });
                    if (message.sender._id !== user._id) {
                        handleMarkAsRead();
                    }
                }
            });
            socket.on("conversation_updated", (message) => {
                console.log("ok");
                if (message) {
                    dispatch(fetchConversations());
                    dispatch(getConversationMessages({ conversationId })).then((res) => {
                        setMessages(res.payload.messages);
                    });
                }
            });
            socket.on("user_typing", (data) => {
                if (data.conversation_id === conversationId && data.user._id !== user._id) {
                    setIsTyping(true);
                    setUserTyping(data.user);
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
                }
            });
            socket.on("reaction_addded", (data) => {
                const prevScrollHeight = containerRef.current.scrollHeight;
                const prevScrollTop = containerRef.current.scrollTop;

                if (data && containerRef.current) {
                    const limit = 20 * pageRef.current;
                    setIsReactionUpdating(true);
                    dispatch(getConversationMessages({ conversationId, limit })).then((res) => {
                        setMessages((prev) => {
                            const newMsgIds = new Set(res.payload.messages.map((msg) => msg._id));
                            const merged = [...res.payload.messages, ...prev.filter((msg) => !newMsgIds.has(msg._id))];
                            return merged;
                        });
                        const newScrollHeight = containerRef.current.scrollHeight;
                        containerRef.current.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
                    });
                }
            });
            socket.on("reaction_removed", (data) => {
                const prevScrollHeight = containerRef.current.scrollHeight;
                const prevScrollTop = containerRef.current.scrollTop;

                if (data && containerRef.current) {
                    const limit = 20 * pageRef.current;
                    setIsReactionUpdating(true);
                    dispatch(getConversationMessages({ conversationId, limit })).then((res) => {
                        setMessages(res.payload.messages);
                        const newScrollHeight = containerRef.current.scrollHeight;
                        containerRef.current.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
                    });
                }
            });
            socket.on("user_stop_typing", () => {
                setIsTyping(false);
            });

            socket.on("message_deleted", (data) => {
                if (data) {
                    dispatch(getConversationMessages({ conversationId })).then((res) => {
                        setMessages(res.payload.messages);
                        dispatch(fetchConversations());
                    });
                }
            });

            socket.on("message_revoked", (data) => {
                if (data) {
                    dispatch(getConversationMessages({ conversationId })).then((res) => {
                        setMessages(res.payload.messages);
                        dispatch(fetchConversations());
                    });
                }
            });

            socket.on("message_forwarded", (data) => {
                if (data) {
                    dispatch(getConversationMessages({ conversationId })).then((res) => {
                        setMessages(res.payload.messages);
                    });
                }
            });

            socket.on("focused_on_page", (data) => {
                if (data) {
                    dispatch(getConversationMessages({ conversationId })).then((res) => {
                        setMessages(res.payload.messages);
                    });
                }
            });

            return () => {
                socket.off("receive_message");
                socket.off("user_typing");
                socket.off("user_stop_typing");
                socket.off("message_read");
                socket.off("focused_on_page");
                socket.off("message_deleted");
                socket.off("message_revoked");
                socket.off("message_forwarded");
                socket.off("reaction_addded");
                socket.off("reaction_removed");
            };
        }
    }, [socket, conversationId, user._id]);

    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    useEffect(() => {
        const initConversation = async () => {
            try {
                const res = await dispatch(getConversation(conversationId));
                if (res?.payload?.other_user) {
                    setOtherUser(res.payload.other_user);
                }
            } catch (err) {
                console.error("Lỗi khi khởi tạo cuộc trò chuyện:", err);
            }
        };

        initConversation();
        setTimeout(() => setLoading(false), 2000);
    }, [conversationId, dispatch]);

    useEffect(() => {
        setPreviousScrollHeightArr((prev) => [...prev, containerRef.current.scrollHeight]);
    }, []);

    useEffect(() => {
        if (!isReactionUpdating) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (previousScrollHeightArr.length > 1) {
            containerRef.current.scrollTop =
                previousScrollHeightArr[previousScrollHeightArr.length - 1] -
                previousScrollHeightArr[previousScrollHeightArr.length - 2];
        }
    }, [previousScrollHeightArr.length]);

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
        scrollRef.current = containerRef.current.scrollTop;
        if (newMessages.length === 0) {
            setHasMore(false);
        } else {
            setMessages((prev) => [...prev, ...newMessages]);
            setPage((prev) => {
                const newPage = prev + 1;
                pageRef.current = newPage;
                return newPage;
            });
            setPreviousScrollHeightArr((prev) => [...prev, containerRef.current.scrollHeight]);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white relative">
            <div className="mt-[50px] z-50 absolute right-[50%] top-4">
                <ClipLoader color="#36d7b7" loading={loading} size={50} />
            </div>

            <ChatHeader
                otherUser={otherUser}
                handleSendFriendRequest={handleSendFriendRequest}
                handleUnfriendUser={handleUnfriendUser}
                isSentRequest={isSentRequest}
                isReceiveRequest={isReceiveRequest}
                isFriend={isFriend}
                handleAcceptFriendRequest={handleAcceptFriendRequest}
                conversation={conversation}
            />

            <FriendRequest
                selectedUser={otherUser}
                handleSendFriendRequest={handleSendFriendRequest}
                handleCancelFriendRequest={handleCancelFriendRequest}
                isFriend={isFriend}
                isSentRequest={isSentRequest}
                isReceiveRequest={isReceiveRequest}
                handleAcceptFriendRequest={handleAcceptFriendRequest}
                conversation={conversation}
            />

            <MessageList
                messages={messages}
                user={user}
                containerRef={containerRef}
                messagesEndRef={messagesEndRef}
                loadMoreMessages={loadMoreMessages}
                otherUser={otherUser}
                conversation={conversation}
                handleDeleteMessage={handleDeleteMessage}
                handleRevokeMessage={handleRevokeMessage}
                handleFowardMessage={handleFowardMessage}
                handleAddReaction={handleAddReaction}
                handleUnreaction={handleUnreaction}
            />
            {isTyping && userTyping._id !== user?._id && (
                <div className="italic text-sm text-gray-500 px-2 py-1 z-50">
                    {userTyping.full_name} đang nhập tin nhắn ...
                </div>
            )}
            <MessageInput
                onSendMessage={handleSendMessage}
                onImageUpload={handleImageUpload}
                onFileUpload={handleFileUpload}
                socket={socket}
                user={user}
                conversationId={conversationId}
            />
        </div>
    );
}
