import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSentFriendRequests,
  getReceivedFriendRequests,
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest
} from "../redux/slices/friendSlice";
import { MessageCircle, UserPlus } from "lucide-react";

export default function FriendRequestsPage() {
  const dispatch = useDispatch();

  const { receivedRequests, sentRequests } = useSelector(
    (state) => state.friendship
  );

  useEffect(() => {
    dispatch(getReceivedFriendRequests());
    dispatch(getSentFriendRequests());
  }, [dispatch]);

  const handleAccept = (id) => {
    dispatch(acceptFriendRequest({ receiverId: id })).then(() => {
      dispatch(getReceivedFriendRequests());
    });
  };

  const handleCancel = (id) => {
    dispatch(cancelFriendRequest({ friendId: id })).then(() => {
      dispatch(getSentFriendRequests());
    });
  };

  const handleDecline = (id) => {
    dispatch(declineFriendRequest({ friendId: id })).then(() => {
      dispatch(getReceivedFriendRequests());
    });
  }

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center">
          <UserPlus className="w-5 h-5 text-gray-600 mr-2" />
          <h1 className="text-lg font-medium text-gray-800">Lời mời kết bạn</h1>
        </div>
      </div>

      {/* Received Requests */}
      <div className="mt-4">
        <div className="px-4 py-2 text-sm font-medium text-gray-600">
          Lời mời đã nhận ({receivedRequests?.length || 0})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
          {receivedRequests?.map((request) => (
            <div key={request.id} className="bg-white shadow-sm rounded-md">
              <div className="p-4">
                <div className="flex items-start">
                  <img
                    src={request.avatar_url || "/default-avatar_url.png"}
                    alt={request.full_name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{request.full_name}</h3>
                      </div>
                      <button className="text-gray-500">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300"
                    onClick={() => handleDecline(request._id)}
                  >
                    Từ chối
                  </button>
                  <button
                    className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-md font-medium hover:bg-blue-200"
                    onClick={() => handleAccept(request._id)}
                  >
                    Đồng ý
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sent Requests */}
      <div className="mt-6">
        <div className="px-4 py-2 text-sm font-medium text-gray-600">
          Lời mời đã gửi ({sentRequests?.length || 0})
        </div>

        <div className="px-4">
          {sentRequests?.map((request) => (
            <div key={request.id} className="bg-white shadow-sm rounded-md mb-4">
              <div className="p-4">
                <div className="flex items-center">
                  {request.avatar_url ? (
                    <img
                      src={request.avatar_url}
                      alt={request.full_name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center mr-3">
                      <span className="font-bold text-lg">
                        {request.initial || request.full_name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{request.full_name}</h3>
                    <p className="text-xs text-gray-500">{request.timeAgo}</p>
                  </div>
                  <button className="text-gray-500">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>

                <button
                  className="w-full mt-3 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300"
                  onClick={() => handleCancel(request._id)}
                >
                  Thu hồi lời mời
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
