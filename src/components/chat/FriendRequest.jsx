import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkFriendShip, checkSendFriendRequest, checkReceiveFriendRequest } from "../../redux/slices/friendSlice";

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

    useEffect(() => {
        if (selectedUser && conversation) {
            const conversationType = conversation.conversation_type;
            if (conversationType !== "group") {
                const user = selectedUser[0];
                dispatch(checkFriendShip({ friendId: user._id }));
                dispatch(checkSendFriendRequest({ friendId: user._id }));
                dispatch(checkReceiveFriendRequest({ friendId: user._id }));
            }
        }
    }, [selectedUser, conversation, dispatch]);

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
