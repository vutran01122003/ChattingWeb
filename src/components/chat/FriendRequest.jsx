import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkFriendShip, checkSendFriendRequest, checkReceiveFriendRequest, resetFriendshipState } from "../../redux/slices/friendSlice";
import { getUserCredentials } from "../../utils";
import { socketSelector } from "../../redux/selector";

function FriendRequest({
    selectedUser,
    handleSendFriendRequest,
    handleCancelFriendRequest,
    isFriend,
    isSentRequest,
    isReceiveRequest,
    handleAcceptFriendRequest,
    conversation
}) {
    const dispatch = useDispatch();
    const credentials = getUserCredentials();
    const clientId = credentials.clientId;
    const socket = useSelector(socketSelector);


    const loadFriendshipStatus = () => {
        if (!selectedUser[0]._id) {
            console.warn(`selectedUser không hợp lệ:`, selectedUser);
            return;
        }
        if (!clientId) {
            console.error(`clientId không hợp lệ khi tải trạng thái:`, credentials);
            return;
        }
        dispatch(checkFriendShip({ friendId: selectedUser[0]._id }));
        dispatch(checkSendFriendRequest({ friendId: selectedUser[0]._id }));
        dispatch(checkReceiveFriendRequest({ friendId: selectedUser[0]._id }));
    };

    useEffect(() => {
        if (selectedUser && conversation) {
            const conversationType = conversation.conversation_type;
            if (conversationType !== "group") {
                if (!socket || !clientId) {
                    console.warn(`Socket hoặc clientId không hợp lệ: socket=${!!socket}, clientId=${clientId}`);
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
                        console.warn(`Yêu cầu kết bạn không dành cho user ${clientId}: toUserId=${data.toUserId}`);
                    }
                };
        
                const handleSocketRefresh = (data) => {
                    if (!selectedUser) {
                        console.warn(`Không có selectedUser để xử lý socket refresh`);
                        return;
                    }
                    if (
                        (data.fromUserId === selectedUser[0]._id || data.toUserId === selectedUser[0]._id)
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
        
                socket.on("receive_friend_request", handleReceiveFriendRequest);
                socket.on("friend_request_canceled", handleSocketRefresh);
                socket.on("friend_request_declined", handleSocketRefresh);
                socket.on("friend_request_accepted", handleSocketRefresh);
                socket.on("friend_request_accept_success", handleSocketRefresh);
                socket.on("user_unfriended", handleSocketRefresh);
        
        
                return () => {
                    socket.off("connect");
                    socket.off("connect_error");
                    socket.off("receive_friend_request", handleReceiveFriendRequest);
                    socket.off("friend_request_canceled", handleSocketRefresh);
                    socket.off("friend_request_declined", handleSocketRefresh);
                    socket.off("friend_request_accepted", handleSocketRefresh);
                    socket.off("friend_request_accept_success", handleSocketRefresh);
                    socket.off("user_unfriended", handleSocketRefresh);
                };
            }
        }
    }, [selectedUser,clientId, conversation, dispatch,socket]);

    useEffect(() => {
        if (!clientId) {
            console.error(`clientId không hợp lệ:`, credentials);
            return;
        }
        if (selectedUser) {
            loadFriendshipStatus();
            if (socket?.connected) {
                if (!selectedUser[0].conversationId) {
                    console.warn(`conversationId không hợp lệ cho selectedUser: ${selectedUser._id}`);
                } else {
                    socket.emit("join_conversation", selectedUser[0].conversationId);
                }
            } else {
                console.warn(`Socket chưa kết nối cho user ${clientId}`);
            }
        } else {
            dispatch(resetFriendshipState());
        }
    }, [selectedUser, dispatch, socket, clientId]);

    useEffect(() => {
        if (!socket || !clientId) {
            console.warn(`Socket hoặc clientId không hợp lệ: socket=${!!socket}, clientId=${clientId}`);
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
                console.warn(`Yêu cầu kết bạn không dành cho user ${clientId}: toUserId=${data.toUserId}`);
            }
        };

        const handleSocketRefresh = (data) => {
            if (!selectedUser) {
                console.warn(`Không có selectedUser để xử lý socket refresh`);
                return;
            }
            if (
                (data.fromUserId === selectedUser[0]._id || data.toUserId === selectedUser[0]._id)
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

        socket.on("receive_friend_request", handleReceiveFriendRequest);
        socket.on("friend_request_canceled", handleSocketRefresh);
        socket.on("friend_request_declined", handleSocketRefresh);
        socket.on("friend_request_accepted", handleSocketRefresh);
        socket.on("friend_request_accept_success", handleSocketRefresh);
        socket.on("user_unfriended", handleSocketRefresh);


        return () => {
            socket.off("connect");
            socket.off("connect_error");
            socket.off("receive_friend_request", handleReceiveFriendRequest);
            socket.off("friend_request_canceled", handleSocketRefresh);
            socket.off("friend_request_declined", handleSocketRefresh);
            socket.off("friend_request_accepted", handleSocketRefresh);
            socket.off("friend_request_accept_success", handleSocketRefresh);
            socket.off("user_unfriended", handleSocketRefresh);
        };
    }, [socket, clientId, selectedUser, dispatch]);


    return (
        <Fragment>
            {isFriend === false && (
                <div className="flex items-center px-4 py-2 bg-white">
                    <div className="flex items-center">
                        <span className="text-gray-600 text-sm">
                            {isSentRequest
                                ? "Bạn đã gửi yêu cầu và đang chờ người này đồng ý"
                                : isReceiveRequest
                                ? "Bạn đã nhận yêu cầu kết bạn"
                                : "Gửi yêu cầu kết bạn tới người này"}
                        </span>
                    </div>
                    <div className="ml-auto">
                        {!isReceiveRequest && (
                            <button
                                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200"
                                onClick={isSentRequest ? handleCancelFriendRequest : handleSendFriendRequest}
                            >
                                {isSentRequest ? "Hủy yêu cầu" : "Gửi kết bạn"}
                            </button>
                        )}
                        {isReceiveRequest && (
                            <button
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 ml-2"
                                onClick={handleAcceptFriendRequest}
                            >
                                Đồng ý kết bạn
                            </button>
                        )}
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default FriendRequest;
