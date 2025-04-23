import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkFriendShip,
  sendFriendRequest,
  checkSendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  checkReceiveFriendRequest,
  unfriendUser,
} from "../redux/slices/friendSlice";
import { useOutletContext } from "react-router";
import { Phone, Video, Smile, Send } from "lucide-react";

function HomePage() {
  const selectedUser = useOutletContext();
  const dispatch = useDispatch();
  const { isFriend, loading, error, isSentRequest, isReceiveRequest } =
    useSelector((state) => state.friendship);

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (selectedUser) {
      dispatch(checkFriendShip({ friendId: selectedUser._id }));
      dispatch(checkSendFriendRequest({ friendId: selectedUser._id }));
      dispatch(checkReceiveFriendRequest({ friendId: selectedUser._id }));
    }
  }, [selectedUser, dispatch]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log("Sending message...");
  };

  const handleSendFriendRequest = (event) => {
    event.preventDefault();
    dispatch(sendFriendRequest({ friendId: selectedUser._id }));

    setTimeout(() => {
      dispatch(checkSendFriendRequest({ friendId: selectedUser._id }));
    }, 1000);
  };

  const handleCancelFriendRequest = (event) => {
    event.preventDefault();
    dispatch(cancelFriendRequest({ friendId: selectedUser._id }));

    setTimeout(() => {
      dispatch(checkSendFriendRequest({ friendId: selectedUser._id }));
    }, 1000);
  };

  const handleAcceptFriendRequest = (event) => {
    event.preventDefault();
    dispatch(acceptFriendRequest({ receiverId: selectedUser._id }));
  };

  const handleUnfriendUser = (event) => {
    event.preventDefault();
    dispatch(unfriendUser({ friendId: selectedUser._id }));

    setTimeout(() => {
      dispatch(checkFriendShip({ friendId: selectedUser._id }));
    }, 1000);
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <header className="bg-white shadow-sm flex items-center p-3 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img
            src={
              selectedUser?.avatar_url ||
              "https://randomuser.me/api/portraits/men/32.jpg"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg">
            {selectedUser?.full_name || "User"}
          </h2>
          <p className="text-gray-500 text-xs">Đang hoạt động</p>
        </div>
        <button className="p-2 mx-1 rounded-full hover:bg-gray-100">
          <Phone size={20} />
        </button>
        <button className="p-2 mx-1 rounded-full hover:bg-gray-100">
          <Video size={20} />
        </button>
      </header>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

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
                onClick={
                  isSentRequest
                    ? handleCancelFriendRequest
                    : handleSendFriendRequest
                }
              >
                {isSentRequest ? "Hủy yêu cầu" : "Gửi kết bạn"}
              </button>
            )}
            {isReceiveRequest && (
              <button
                className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-400 ml-2"
                onClick={handleAcceptFriendRequest}
              >
                Đồng ý kết bạn
              </button>
            )}
          </div>
        </div>
      )}

      {isFriend === true && (
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <div className="text-green-500 mt-4 self-center">
            Hai bạn đã là bạn bè!
          </div>
          <button
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-400"
            onClick={handleUnfriendUser}
          >
            Xóa kết bạn
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4"></main>

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
          <button
            type="submit"
            className="p-2 rounded-full hover:bg-gray-100"
            disabled={!newMessage.trim()}
          >
            <Send size={22} color={newMessage.trim() ? "#1e88e5" : "#666"} />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default HomePage;
