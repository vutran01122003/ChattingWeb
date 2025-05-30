import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

import ChatHeader from "../components/header/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import useChat from "../hooks/useChat";
import FriendRequest from "../components/chat/FriendRequest";
import {
  checkFriendShip,
  sendFriendRequest,
  checkSendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  checkReceiveFriendRequest,
  unfriendUser,
  resetFriendshipState,
  checkBlockedUser,
  checkIsBlockedUser,
  blockUser,
  unblockUser,
} from "../redux/slices/friendSlice";
import { authSelector, socketSelector } from "../redux/selector";
import {
  getConversation,
  getConversationMessages,
  fetchConversations,
} from "../redux/thunks/chatThunks";
import GroupInfo from "../components/chat/GroupInfo";

export default function ChatPage() {
  const dispatch = useDispatch();
  const socket = useSelector(socketSelector);
  const [isHidden, setIsHidden] = useState(false);
  const {
    isFriend,
    isSentRequest,
    isReceiveRequest,
    isBlockedUser,
    isBlocked,
  } = useSelector((state) => state.friendship);
  const { conversationId } = useParams();

  const fetchMessages = useSelector((state) => state.chat.messages);
  const { user } = useSelector(authSelector);
  const [messages, setMessages] = useState(fetchMessages);
  const [visibleGroupInfo, setVisibleGroupInfo] = useState(true);
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
  const pageRef = useRef(page);
  const scrollRef = useRef(0);
  const {
    handleSendMessage,
    handleImageUpload,
    handleFileUpload,
    handleMarkAsRead,
    handleDeleteMessage,
    handleRevokeMessage,
    handleFowardMessage,
    handleAddReaction,
    handleUnreaction,
  } = useChat(conversationId, setMessages);
  const { friendConversations, strangerConversations, groupConversations } =
    useSelector((state) => state.chat);

  const loadFriendshipStatus = () => {
    if (!otherUser[0]?._id) {
      console.warn(`selectedUser không hợp lệ:`, otherUser);
      return;
    }
    if (!user?._id) {
      console.error(`clientId không hợp lệ khi tải trạng thái:`, user);
      return;
    }
    dispatch(checkFriendShip({ friendId: otherUser[0]._id }));
    dispatch(checkSendFriendRequest({ friendId: otherUser[0]._id }));
    dispatch(checkReceiveFriendRequest({ friendId: otherUser[0]._id }));
    dispatch(checkBlockedUser({ userId: otherUser[0]._id }));
    dispatch(checkIsBlockedUser({ userId: otherUser[0]._id }));
  };

  useEffect(() => {
    if (!user) {
      console.error(`clientId không hợp lệ:`, user);
      return;
    }
    if (otherUser) {
      loadFriendshipStatus();
      if (socket?.connected) {
        if (!otherUser.conversationId) {
          console.warn(
            `conversationId không hợp lệ cho selectedUser: ${otherUser[0]._id}`
          );
        } else {
          socket.emit("join_conversation", otherUser.conversationId);
        }
      } else {
        console.warn(`Socket chưa kết nối cho user ${user._id}`);
      }
    } else {
      dispatch(resetFriendshipState());
    }
  }, [otherUser, dispatch, socket, user]);

  useEffect(() => {
    if (!socket || !user) {
      console.warn(
        `Socket hoặc clientId không hợp lệ: socket=${!!socket}, clientId=${
          user?._id
        }`
      );
      return;
    }

    const handleReceiveFriendRequest = (data) => {
      if (!data.fromUserId || !data.toUserId) {
        console.error(`Dữ liệu receive_friend_request không hợp lệ:`, data);
        return;
      }
    };

    const handleSocketRefresh = (data) => {
      if (!otherUser[0]?._id) {
        console.warn(`Không có selectedUser để xử lý socket refresh`);
        return;
      }
      console.log("loadFriendshipStatus");
      loadFriendshipStatus();
    //   console.log("handleSocketRefresh", data);
    //   if (data.fromUserId === user._id || data.toUserId === otherUser[0]._id) {
    //     console.log("loadFriendshipStatus");
    //     loadFriendshipStatus();
    //   }
    };

    // Listener cho user_blocked
  const handleReceiveUserBlocked = (data) => {
    if (!data.fromUserId || !data.toUserId) {
        console.error(`Dữ liệu receive_user_blocked không hợp lệ:`, data);
        return;
      }
  };

  // Listener cho user_unblocked
//   const handleUserUnblocked = (data) => {
//     if (!otherUser[0]?._id) {
//       console.warn(`Không có selectedUser để xử lý user_unblocked`);
//       return;
//     }
//     if (
//       data.fromUserId === user._id || // Bạn bỏ chặn người khác
//       data.toUserId === otherUser[0]._id // Người khác bỏ chặn bạn
//     ) {
//       loadFriendshipStatus(); // Cập nhật trạng thái bạn bè
//     }
//   };

    socket.on("connect", () => {
      socket.emit("connected_user", user._id);
    });

    socket.on("connect_error", (error) => {
      console.error(`Lỗi kết nối socket:`, error);
    });

    socket.on("receive_friend_request", handleReceiveFriendRequest);
    socket.on("friend_request_canceled", handleSocketRefresh);
    socket.on("friend_request_declined", handleSocketRefresh);
    socket.on("friend_request_accepted", handleSocketRefresh);
    socket.on("friend_request_accept_success", handleSocketRefresh);
    socket.on("user_unfriended", handleSocketRefresh);
    socket.on("receive_user_blocked", handleReceiveUserBlocked); 
    socket.on("user_unblocked", handleSocketRefresh);

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("receive_friend_request", handleReceiveFriendRequest);
      socket.off("friend_request_canceled", handleSocketRefresh);
      socket.off("friend_request_declined", handleSocketRefresh);
      socket.off("friend_request_accepted", handleSocketRefresh);
      socket.off("friend_request_accept_success", handleSocketRefresh);
      socket.off("user_unfriended", handleSocketRefresh);
      socket.off("receive_user_blocked", handleReceiveUserBlocked); 
      socket.off("user_unblocked", handleSocketRefresh); 
    };
  }, [socket, user, otherUser, dispatch]);

  const handleSendFriendRequest = (e) => {
    e.preventDefault();
    if (!otherUser[0]._id) {
      console.error(`Không có ID người dùng để gửi yêu cầu kết bạn.`);
      return;
    }
    dispatch(sendFriendRequest({ friendId: otherUser[0]._id, socket }));
  };

  const handleToggleVisibleGroupInfo = () => {
    setVisibleGroupInfo((prev) => !prev);
  };

  const handleAcceptFriendRequest = (e) => {
    e.preventDefault();
    if (!otherUser[0]?._id || !user?._id) {
      console.error(
        `selectedUser._id hoặc clientId không hợp lệ để chấp nhận yêu cầu kết bạn: selectedUser=${otherUser}, clientId=${user._id}`
      );
      return;
    }
    dispatch(acceptFriendRequest({ receiverId: otherUser[0]._id, socket }));
  };

  const handleCancelFriendRequest = (e) => {
    e.preventDefault();
    if (!otherUser[0]?._id || !user?._id) {
      console.error(
        `selectedUser._id hoặc clientId không hợp lệ để hủy yêu cầu kết bạn: selectedUser=${otherUser[0]._id}, clientId=${user._id}`
      );
      return;
    }
    dispatch(cancelFriendRequest({ friendId: otherUser[0]._id, socket }));
  };

  const handleUnfriendUser = (e) => {
    e.preventDefault();
    if (!otherUser[0]?._id || !user?._id) {
      console.error(
        `selectedUser._id hoặc clientId không hợp lệ để hủy yêu cầu kết bạn: selectedUser=${otherUser[0]._id}, clientId=${user._id}`
      );
      return;
    }
    dispatch(unfriendUser({ friendId: otherUser[0]._id, socket }));
  };

  const handleBlockUser = (e) => {
    e.preventDefault();
    if (!otherUser[0]._id ) {
        console.error(`Không có ID người dùng để block.`);
      return;
    }
    dispatch(blockUser({ userId: otherUser[0]._id, socket }));
  };

  const handleUnblockUser = (e) => {
    e.preventDefault();
    if (!otherUser[0]?._id || !user?._id) {
      console.error(
        `selectedUser._id hoặc clientId không hợp lệ để bỏ chặn người dùng: selectedUser=${otherUser[0]._id}, clientId=${user._id}`
      );
      return;
    }
    dispatch(unblockUser({ userId: otherUser[0]._id, socket }));
  };

  const conversations = useMemo(() => {
    return [
      ...friendConversations,
      ...strangerConversations,
      ...groupConversations,
    ];
  }, [
    JSON.stringify(friendConversations),
    JSON.stringify(strangerConversations),
    JSON.stringify(groupConversations),
  ]);

  useEffect(() => {
    setConversation(
      conversations.find(
        (conversation) => conversation.conversation_id === conversationId
      )
    );
    if (conversationId && socket) {
      dispatch(getConversationMessages({ conversationId })).then((res) => {
        setMessages(res.payload.messages);
        setIsReactionUpdating(false);
        socket.emit("focus_chat_page", { conversation_id: conversationId });
        dispatch(fetchConversations());
      });
    }
  }, [socket, conversationId, dispatch, JSON.stringify(conversations)]);

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
        if (
          data.conversation_id === conversationId &&
          data.user._id !== user._id
        ) {
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
          dispatch(getConversationMessages({ conversationId, limit })).then(
            (res) => {
              setMessages((prev) => {
                const newMsgIds = new Set(
                  res.payload.messages.map((msg) => msg._id)
                );
                const merged = [
                  ...res.payload.messages,
                  ...prev.filter((msg) => !newMsgIds.has(msg._id)),
                ];
                return merged;
              });
              const newScrollHeight = containerRef.current.scrollHeight;
              containerRef.current.scrollTop =
                prevScrollTop + (newScrollHeight - prevScrollHeight);
            }
          );
        }
      });
      socket.on("reaction_removed", (data) => {
        const prevScrollHeight = containerRef.current.scrollHeight;
        const prevScrollTop = containerRef.current.scrollTop;

        if (data && containerRef.current) {
          const limit = 20 * pageRef.current;
          setIsReactionUpdating(true);
          dispatch(getConversationMessages({ conversationId, limit })).then(
            (res) => {
              setMessages(res.payload.messages);
              const newScrollHeight = containerRef.current.scrollHeight;
              containerRef.current.scrollTop =
                prevScrollTop + (newScrollHeight - prevScrollHeight);
            }
          );
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
    setPreviousScrollHeightArr((prev) => [
      ...prev,
      containerRef.current.scrollHeight,
    ]);
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
    const res = await dispatch(
      getConversationMessages({ conversationId, page: page + 1 })
    );
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
      setPreviousScrollHeightArr((prev) => [
        ...prev,
        containerRef.current.scrollHeight,
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white relative">
      <div className="mt-[70px] z-50 absolute right-[50%] top-4">
        <ClipLoader color="#36d7b7" loading={loading} size={50} />
      </div>

      <div className="flex h-screen">
        <div className="flex flex-col h-screen flex-1">
          <ChatHeader
            otherUser={otherUser}
            handleSendFriendRequest={handleSendFriendRequest}
            handleUnfriendUser={handleUnfriendUser}
            isSentRequest={isSentRequest}
            isReceiveRequest={isReceiveRequest}
            isFriend={isFriend}
            isBlockedUser={isBlockedUser}
            isBlocked={isBlocked}
            handleAcceptFriendRequest={handleAcceptFriendRequest}
            conversation={conversation}
            handleToggleVisibleGroupInfo={handleToggleVisibleGroupInfo}
            handleBlockUser={handleBlockUser}
            handleUnblockUser={handleUnblockUser}
          />

          <FriendRequest
            selectedUser={otherUser}
            handleSendFriendRequest={handleSendFriendRequest}
            handleCancelFriendRequest={handleCancelFriendRequest}
            isFriend={isFriend}
            isBlockedUser={isBlockedUser}
            isBlocked={isBlocked}
            isSentRequest={isSentRequest}
            isReceiveRequest={isReceiveRequest}
            handleAcceptFriendRequest={handleAcceptFriendRequest}
            conversation={conversation}
            handleBlockUser={handleBlockUser}
            handleUnblockUser={handleUnblockUser}
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
            isBlockedUser={isBlockedUser}
            isBlocked={isBlocked}
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
            conversation={conversation}
            isBlockedUser={isBlockedUser}
            isBlocked={isBlocked}
          />
        </div>

        {visibleGroupInfo &&
          conversation &&
          conversation.conversation_type === "group" && (
            <div>
              <GroupInfo conversation={conversation} authUser={user} />
            </div>
          )}
      </div>
    </div>
  );
}
