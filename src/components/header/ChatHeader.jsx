import { BsCameraVideo, BsLayoutSidebarReverse } from "react-icons/bs";
import { Phone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, peerSelector, socketSelector } from "../../redux/selector";
import { callUser } from "../../redux/slices/callSlice";
import { FiUserPlus, FiUserMinus } from "react-icons/fi";

import { Fragment } from "react";

export default function ChatHeader({
    otherUser,
    handleSendFriendRequest,
    handleUnfriendUser,
    isFriend,
    isSentRequest,
    isReceiveRequest,
    handleAcceptFriendRequest,
    conversation
}) {
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const peer = useSelector(peerSelector);
    const socket = useSelector(socketSelector);

    const handleCallUser = async ({ video }) => {
        Promise.all([
            navigator.permissions.query({ name: "camera" }),
            navigator.permissions.query({ name: "microphone" })
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
                        avatar: auth.user.avatar_url
                    },
                    receiver: otherUser[0],
                    video
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
                        {conversation?.conversation_type === "stranger" ? (
                            <div className="text-white w-20 h-3 rounded-md bg-gray-300 p-3 flex items-center text-xs justify-center">
                                NGƯỜI LẠ
                            </div>
                        ) : (
                            <p className={`text-xs text-gray-500`}>{otherUser[0].is_online ? "" : "Vừa truy cập"}</p>
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
                        <h2 className="font-semibold text-lg">{conversation?.group_name}</h2>
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
                        <button className="p-2">
                            {isFriend ? (
                                <FiUserMinus
                                    className="h-6 w-6 text-gray-500 cursor-pointer"
                                    onClick={handleUnfriendUser}
                                />
                            ) : (
                                <Fragment>
                                    {!isSentRequest && (
                                        <FiUserPlus
                                            className="h-6 w-6 text-gray-500 cursor-pointer"
                                            onClick={
                                                isReceiveRequest ? handleAcceptFriendRequest : handleSendFriendRequest
                                            }
                                        />
                                    )}
                                </Fragment>
                            )}
                        </button>

                        <button className="p-2" onClick={handleCallAudioUser}>
                            <Phone className="h-6 w-6 text-gray-500 cursor-pointer" />
                        </button>
                        <button className="p-2">
                            <BsCameraVideo
                                className="h-6 w-6 text-gray-500 cursor-pointer"
                                onClick={handleCallVideoUser}
                            />
                        </button>
                    </Fragment>
                )}

                <button className="p-2">
                    <BsLayoutSidebarReverse className="h-6 w-6 text-gray-500 cursor-pointer" />
                </button>
            </div>
        </div>
    );
}
