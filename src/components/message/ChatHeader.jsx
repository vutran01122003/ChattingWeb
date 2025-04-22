import { Phone, Video } from "lucide-react";
import { callUser } from "../../redux/slices/callSlice";
import { useDispatch } from "react-redux";

function ChatHeader({ selectedUser, auth, peer, socket }) {
    const dispatch = useDispatch();

    const handleCallUser = async ({ video }) => {
        Promise.all([
            navigator.permissions.query({ name: "camera" }),
            navigator.permissions.query({ name: "microphone" })
        ]).then(function (permissionStatuses) {
            const cameraPermissionStatus = permissionStatuses[0].state;
            const microphonePermissionStatus = permissionStatuses[1].state;
            if (cameraPermissionStatus === "denied") {
                alert("You must allow your browser to access the camera");
            } else if (microphonePermissionStatus === "denied") {
                alert("You must allow your browser to access the microphone");
            } else {
                const data = {
                    peerId: peer._id,
                    sender: {
                        _id: auth.user._id,
                        full_name: auth.user.full_name,
                        avatar: auth.user.avatar_url
                    },
                    receiver: selectedUser,
                    video
                };
                dispatch(callUser(data));
                socket.emit("call_user", data);
            }
        });
    };

    const handleCallAudioUser = async () => {
        handleCallUser({ video: false });
    };

    const handleCallVideoUser = async () => {
        handleCallUser({ video: true });
    };

    return (
        <header className="bg-white shadow-sm flex items-center p-3 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img
                    src={selectedUser?.avatar_url || "https://randomuser.me/api/portraits/men/32.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1">
                <h2 className="font-bold text-lg">{selectedUser?.full_name || "User"}</h2>
                <p className="text-gray-500 text-xs">Đang hoạt động</p>
            </div>
            <button className="p-2 mx-1 rounded-full hover:bg-gray-100" onClick={handleCallAudioUser}>
                <Phone size={20} />
            </button>
            <button className="p-2 mx-1 rounded-full hover:bg-gray-100" onClick={handleCallVideoUser}>
                <Video size={20} />
            </button>
        </header>
    );
}

export default ChatHeader;
