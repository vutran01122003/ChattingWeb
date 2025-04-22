import { MdOutlinePhoneEnabled, MdOutlinePhoneDisabled } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { calling, callUser } from "../../redux/slices/callSlice";
import Avatar from "../user/Avatar";
import messengerCall from "../../assets/audio/messengerCall.mp3";
import messengerDialTone from "../../assets/audio/messengerDialTone.mp3";

function CallModal({ auth, call, socket, peer }) {
    const dispatch = useDispatch();

    const handleEndCall = () => {
        dispatch(callUser({}));

        const restUserId = call?.sender._id === auth.user._id ? call?.receiver._id : call?.sender._id;
        socket.emit("end_call", { restUserId });
    };

    const handleAnswerCall = ({ receiverId, senderId, peerId, isVideo }) => {
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
                dispatch(calling(true));
                socket.emit("answer_call", { receiverId, senderId, peerId, isVideo });
            }
        });
    };

    return (
        <>
            {call?.receiver && (
                <div className="fixed inset-0 flex justify-center items-center bg-overlap z-[9000] overflow-auto">
                    <audio autoPlay loop hidden>
                        <source
                            src={call.receiver?._id === auth.user?._id ? messengerCall : messengerDialTone}
                            type="audio/mp3"
                        />
                    </audio>
                    <div className="flex flex-col w-[450px] h-[600px] max-w-full max-h-full p-2.5 rounded-[10px] bg-blue-600 text-white shadow-box-gray z-[9900]">
                        <div className="text-center text-lg font-semibold px-4 pt-1 pb-4 uppercase">
                            {call?.video ? "Video Call" : "Audio Call"}
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center">
                            <div className="mt-5">
                                <Avatar
                                    avatar={
                                        auth?.user._id === call?.receiver._id
                                            ? call?.sender.avatar_url
                                            : call?.receiver.avatar_url
                                    }
                                    size="160"
                                />
                            </div>
                            <div className="text-center mt-5">
                                <h1 className="text-2xl font-semibold">
                                    {auth?.user._id === call?.receiver._id
                                        ? call.sender.full_name
                                        : call.receiver.full_name}
                                </h1>
                                <div className="text-xs font-light mt-2">
                                    {auth?.user._id === call?.receiver._id
                                        ? "Calling you..."
                                        : call.video
                                        ? "Calling video..."
                                        : "Calling audio..."}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-around gap-2.5 my-5">
                            <div
                                onClick={handleEndCall}
                                className="flex justify-center items-center w-10 h-10 rounded-full cursor-pointer bg-white text-red-500 transition-transform duration-100 ease-linear hover:scale-110"
                            >
                                <MdOutlinePhoneDisabled />
                            </div>
                            {auth.user._id === call?.receiver._id && !call.calling && (
                                <div
                                    onClick={() => {
                                        handleAnswerCall({
                                            senderId: call.sender._id,
                                            receiverId: call?.receiver._id,
                                            peerId: peer._id,
                                            isVideo: call?.video
                                        });
                                    }}
                                    className="flex justify-center items-center w-10 h-10 rounded-full cursor-pointer bg-white text-green-500 transition-transform duration-100 ease-linear hover:scale-110"
                                >
                                    {call.video ? <IoVideocam /> : <MdOutlinePhoneEnabled />}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CallModal;
