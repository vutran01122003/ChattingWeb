import { BsCameraVideo, BsLayoutSidebarReverse } from "react-icons/bs";
import { Phone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  authSelector,
  peerSelector,
  socketSelector,
} from "../../redux/selector";
import { callUser } from "../../redux/slices/callSlice";
import { FiUserPlus, FiUserMinus } from "react-icons/fi";
import { MdBlock, MdBlockFlipped } from "react-icons/md";
import { getUserCredentials } from "../../utils";
import { Fragment, useEffect } from "react";
import {
  checkBlockedUser,
  checkFriendShip,
  checkIsBlockedUser,
  checkReceiveFriendRequest,
  checkSendFriendRequest,
  resetFriendshipState,
} from "../../redux/slices/friendSlice";

export default function ChatHeader({
  otherUser,
  handleSendFriendRequest,
  handleUnfriendUser,
  isFriend,
  isBlockedUser,
  isBlocked,
  isSentRequest,
  isReceiveRequest,
  handleAcceptFriendRequest,
  conversation,
  handleToggleVisibleGroupInfo,
  handleBlockUser,
  handleUnblockUser,
}) {
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);
  const peer = useSelector(peerSelector);
  const socket = useSelector(socketSelector);
  const credentials = getUserCredentials();
  const clientId = credentials.clientId;

//   console.log("ChatHeader >>>>>", otherUser[0])

  const loadFriendshipStatus = () => {
    
    if (!otherUser[0]) {
      console.warn(`otherUser không hợp lệ:`, otherUser);
      return;
    }
    if (!clientId) {
      console.error(`clientId không hợp lệ khi tải trạng thái:`, credentials);
      return;
    }
    dispatch(checkFriendShip({ friendId: otherUser._id }));
    dispatch(checkSendFriendRequest({ friendId: otherUser._id }));
    dispatch(checkReceiveFriendRequest({ friendId: otherUser._id }));
    dispatch(checkBlockedUser({ userId: otherUser._id }));
    dispatch(checkIsBlockedUser({ userId: otherUser._id }));
  };

  useEffect(() => {
    if (otherUser && conversation) {
      const conversationType = conversation.conversation_type;
      if (conversationType !== "group") {
        if (!socket || !clientId) {
          console.warn(
            `Socket hoặc clientId không hợp lệ: socket=${!!socket}, clientId=${clientId}`
          );
          return;
        }

        const handleReceiveFriendRequest = (data) => {
          if (!data.fromUserId || !data.toUserId) {
            console.error(`Dữ liệu receive_friend_request không hợp lệ:`, data);
            return;
          }
          if (data.toUserId === clientId) {
            dispatch(checkReceiveFriendRequest({ friendId: data.fromUserId }));
          } else {
            console.warn(
              `Yêu cầu kết bạn không dành cho user ${clientId}: toUserId=${data.toUserId}`
            );
          }
        };

        const handleReceiveBlockUser = (data) => {
            console.log("handleReceiveBlockUser >>>>>>>>>>");
          if (!data.fromUserId || !data.toUserId) {
            console.error(`Dữ liệu receive_user_blocked không hợp lệ:`, data);
            return;
          }
          if (data.toUserId === clientId) {
            dispatch(checkIsBlockedUser({ userId: data.fromUserId }));
          } else {
            console.warn(
              `Yêu cầu bỏ chặn không dành cho user ${clientId}: toUserId=${data.toUserId}`
            );
          }
        };

        const handleSocketRefresh = (data) => {
            console.log(">>>>>>>>>>>>>>", otherUser)
          if (!otherUser) {
            console.warn(`Không có otherUser để xử lý socket refresh`);
            return;
          }
          if (
            data.fromUserId === otherUser._id ||
            data.toUserId === otherUser._id
          ) {
            console.log("Refreshing friendship status due to socket event");
            loadFriendshipStatus();
          }
        };

        socket.on("connect", () => {
          socket.emit("connected_user", clientId);
        });

        socket.on("connect_error", (error) => {
          console.error(`Lỗi kết nối socket:`, error);
        });

        // socket.on("receive_friend_request", handleReceiveFriendRequest);
        // socket.on("friend_request_canceled", handleSocketRefresh);
        // socket.on("friend_request_declined", handleSocketRefresh);
        // socket.on("friend_request_accepted", handleSocketRefresh);
        // socket.on("friend_request_accept_success", handleSocketRefresh);
        // socket.on("user_unfriended", handleSocketRefresh);
        socket.on("receive_user_blocked", handleReceiveBlockUser);
        socket.on("user_unblocked", handleSocketRefresh);

        return () => {
          socket.off("connect");
          socket.off("connect_error");
        //   socket.off("receive_friend_request", handleReceiveFriendRequest);
        //   socket.off("friend_request_canceled", handleSocketRefresh);
        //   socket.off("friend_request_declined", handleSocketRefresh);
        //   socket.off("friend_request_accepted", handleSocketRefresh);
        //   socket.off("friend_request_accept_success", handleSocketRefresh);
        //   socket.off("user_unfriended", handleSocketRefresh);
          socket.off("receive_user_blocked", handleReceiveBlockUser);
          socket.off("user_unblocked", handleSocketRefresh);
        };
      }
    }
  }, [otherUser, clientId, conversation, dispatch, socket]);

  useEffect(() => {
    if (!clientId) {
      console.error(`clientId không hợp lệ:`, credentials);
      return;
    }
    if (otherUser) {
      loadFriendshipStatus();
      if (socket?.connected) {
        if (!otherUser.conversationId) {
          console.warn(
            `conversationId không hợp lệ cho otherUser: ${otherUser._id}`
          );
        } else {
          socket.emit("join_conversation", otherUser.conversationId);
        }
      } else {
        console.warn(`Socket chưa kết nối cho user ${clientId}`);
      }
    } else {
      dispatch(resetFriendshipState());
    }
  }, [otherUser, dispatch, socket, clientId]);

  useEffect(() => {
    if (!socket || !clientId) {
      console.warn(
        `Socket hoặc clientId không hợp lệ: socket=${!!socket}, clientId=${clientId}`
      );
      return;
    }

    // const handleReceiveFriendRequest = (data) => {
    //   if (!data.fromUserId || !data.toUserId) {
    //     console.error(`Dữ liệu receive_friend_request không hợp lệ:`, data);
    //     return;
    //   }
    //   if (data.toUserId === clientId) {
    //     dispatch(checkReceiveFriendRequest({ friendId: data.fromUserId }));
    //   } else {
    //     console.warn(
    //       `Yêu cầu kết bạn không dành cho user ${clientId}: toUserId=${data.toUserId}`
    //     );
    //   }
    // };

    const handleReceiveBlockUser = (data) => {
      if (!data.fromUserId || !data.toUserId) {
        console.error(`Dữ liệu receive_user_blocked không hợp lệ:`, data);
        return;
      }
      if (data.toUserId === clientId) {
        dispatch(checkIsBlockedUser({ userId: data.fromUserId }));
      } else {
        console.warn(
          `Yêu cầu bỏ chặn không dành cho user ${clientId}: toUserId=${data.toUserId}`
        );
      }
    };

    const handleSocketRefresh = (data) => {
        console.log("handleSocketRefresh >>>>>>>>>>");
      if (!otherUser) {
        console.warn(`Không có otherUser để xử lý socket refresh`);
        return;
      }
      if (
        data.fromUserId === otherUser._id ||
        data.toUserId === otherUser._id
      ) {
        loadFriendshipStatus();
      }
    };

    socket.on("connect", () => {
      socket.emit("connected_user", clientId);
    });

    socket.on("connect_error", (error) => {
      console.error(`Lỗi kết nối socket:`, error);
    });

    // socket.on("receive_friend_request", handleReceiveFriendRequest);
    // socket.on("friend_request_canceled", handleSocketRefresh);
    // socket.on("friend_request_declined", handleSocketRefresh);
    // socket.on("friend_request_accepted", handleSocketRefresh);
    // socket.on("friend_request_accept_success", handleSocketRefresh);
    // socket.on("user_unfriended", handleSocketRefresh);
    socket.on("receive_user_blocked", handleReceiveBlockUser);
    socket.on("user_unblocked", handleSocketRefresh);

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    //   socket.off("receive_friend_request", handleReceiveFriendRequest);
    //   socket.off("friend_request_canceled", handleSocketRefresh);
    //   socket.off("friend_request_declined", handleSocketRefresh);
    //   socket.off("friend_request_accepted", handleSocketRefresh);
    //   socket.off("friend_request_accept_success", handleSocketRefresh);
    //   socket.off("user_unfriended", handleSocketRefresh);
      socket.off("receive_user_blocked", handleReceiveBlockUser);
      socket.off("user_unblocked", handleSocketRefresh);
    };
  }, [socket, clientId, otherUser, dispatch]);

  const handleCallUser = async ({ video }) => {
    Promise.all([
      navigator.permissions.query({ name: "camera" }),
      navigator.permissions.query({ name: "microphone" }),
    ]).then(function (permissionStatuses) {
      const cameraPermissionStatus = permissionStatuses[0].state;
      const microphonePermissionStatus = permissionStatuses[1].state;
      if (cameraPermissionStatus === "denied") {
        alert("You must allow your browser to access the camera");
        // socket.emit("end_call", { restUserId: otherUser._id });
      } else if (microphonePermissionStatus === "denied") {
        alert("You must allow your browser to access the microphone");
        socket.emit("end_call", { restUserId: otherUser._id });
      } else {
        const data = {
          peerId: peer._id,
          sender: {
            _id: auth.user._id,
            full_name: auth.user.full_name,
            avatar: auth.user.avatar_url,
          },
          receiver: otherUser[0],
          video,
        };
        dispatch(callUser(data));
        socket.emit("call_user", data);
      }
    });
  };

  const Header = ({ otherUser, conversation }) => {
    if (otherUser && otherUser.length === 1) {
      return (
        <div className="relative flex items-center">
          <img
            src={otherUser[0]?.avatar_url}
            alt={otherUser[0]?.full_name}
            className="w-12 h-12 rounded-full mr-2 self-end"
          />
          <div className="ml-3">
            <h2 className="font-semibold text-lg">{otherUser[0].full_name}</h2>
            {isBlockedUser ? (
              <p className="text-xs text-gray-500">Đã chặn người dùng này</p>
            ) : isBlocked ? (
              <p className="text-xs text-gray-500">Đã bị chặn</p>
            ) : conversation?.conversation_type === "stranger" ? (
              !isFriend ? (
                <div className="w-20 h-8 rounded-md bg-gray-300 p-3 flex items-center justify-center text-xs text-white">
                  NGƯỜI LẠ
                </div>
              ) : null
            ) : (
              <p className="text-xs text-gray-500">
                {otherUser?.[0]?.is_online ? "Đang trực tuyến" : "Vừa truy cập"}
              </p>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative flex items-center">
          <img
            src={conversation?.group_avatar}
            alt={conversation?.group_name}
            className="w-12 h-12 rounded-full mr-2 self-end"
          />
          <div className="ml-3">
            <h2 className="font-semibold text-lg">
              {conversation?.group_name}
            </h2>
          </div>
        </div>
      );
    }
  };

  const handleCallAudioUser = async () => {
    handleCallUser({ video: false });
  };

  const handleCallVideoUser = async () => {
    handleCallUser({ video: true });
  };

  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-300">
      <div className="flex items-center">
        <Header otherUser={otherUser} conversation={conversation} />
      </div>
      <div className="ml-auto flex">
        {conversation?.conversation_type !== "group" && (
          <Fragment>
            {/* Nút quản lý bạn bè */}
            {!isBlockedUser && !isBlocked && (
              <button className="p-2">
                {isFriend ? (
                  <FiUserMinus
                    className="h-6 w-6 text-gray-500 cursor-pointer"
                    onClick={handleUnfriendUser}
                    title="Hủy kết bạn"
                  />
                ) : (
                  <Fragment>
                    {!isSentRequest && (
                      <FiUserPlus
                        className="h-6 w-6 text-gray-500 cursor-pointer"
                        onClick={
                          isReceiveRequest
                            ? handleAcceptFriendRequest
                            : handleSendFriendRequest
                        }
                        title={
                          isReceiveRequest
                            ? "Chấp nhận kết bạn"
                            : "Gửi lời mời kết bạn"
                        }
                      />
                    )}
                  </Fragment>
                )}
              </button>
            )}

            {/* Nút chặn/bỏ chặn user */}
            {!isBlocked && (
              <button className="p-2">
                {isBlockedUser ? (
                  <MdBlockFlipped
                    className="h-6 w-6 text-red-500 cursor-pointer"
                    onClick={handleUnblockUser}
                    title="Bỏ chặn người dùng"
                  />
                ) : (
                  <MdBlock
                    className="h-6 w-6 text-gray-500 cursor-pointer hover:text-red-500"
                    onClick={handleBlockUser}
                    title="Chặn người dùng"
                  />
                )}
              </button>
            )}

            {/* Nút gọi điện - ẩn khi bị chặn */}
            {!isBlockedUser && !isBlocked && (
              <Fragment>
                <button className="p-2" onClick={handleCallAudioUser}>
                  <Phone
                    className="h-6 w-6 text-gray-500 cursor-pointer"
                    title="Gọi thoại"
                  />
                </button>
                <button className="p-2">
                  <BsCameraVideo
                    className="h-6 w-6 text-gray-500 cursor-pointer"
                    onClick={handleCallVideoUser}
                    title="Gọi video"
                  />
                </button>
              </Fragment>
            )}
          </Fragment>
        )}

        <button className="p-2" onClick={handleToggleVisibleGroupInfo}>
          <BsLayoutSidebarReverse
            className="h-6 w-6 text-gray-500 cursor-pointer"
            title="Thông tin hội thoại"
          />
        </button>
      </div>
    </div>
  );
}
