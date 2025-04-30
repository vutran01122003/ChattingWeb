import { MdOutlinePhoneDisabled } from "react-icons/md";
import Avatar from "../user/Avatar";
import { useEffect, useState } from "react";

function CallUserModal({ call, localVideo, remoteVideo, remoteAudio, handleEndCall }) {
    const [second, setSecond] = useState(0);

    useEffect(() => {
        const timeId = setInterval(() => {
            setSecond((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timeId);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 overflow-auto">
            <div className="flex flex-col items-center p-3 rounded-[10px] w-[500px] h-[650px] max-w-full max-h-full bg-blue-600 text-white">
                <div className="text-base uppercase font-semibold py-4">{`Calling ${
                    call.video ? "video" : "audio"
                }`}</div>

                {!call?.video ? (
                    <div className="mt-5 flex flex-col items-center">
                        <Avatar src={call.sender.avatar} size={24} />
                        <h3 className="text-xl font-semibold mt-4 text-center">{call.sender.full_name}</h3>
                        <audio ref={remoteAudio} hidden autoPlay></audio>
                    </div>
                ) : (
                    <div className="relative w-full flex flex-col gap-2 overflow-hidden">
                        <video
                            className="absolute top-0 right-0 w-[20%] border border-gray-300 z-[99] transform scale-x-[-1]"
                            ref={localVideo}
                            muted
                        />
                        <video
                            className="w-full border border-gray-300 transform scale-x-[-1]"
                            ref={remoteVideo}
                            autoPlay
                        />
                    </div>
                )}

                <h4 className="text-center mt-4">
                    {`${Math.floor(second / 60)
                        .toString()
                        .padStart(2, "0")}:${(second % 60).toString().padStart(2, "0")}`}
                </h4>

                <div className="flex flex-1 items-center justify-center mt-4">
                    <div
                        onClick={handleEndCall}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-red-500 transition-transform duration-100 hover:scale-110 cursor-pointer"
                    >
                        <MdOutlinePhoneDisabled />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CallUserModal;
