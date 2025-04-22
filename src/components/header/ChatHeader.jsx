import { FaUserPlus } from "react-icons/fa6";
import { BsCameraVideo, BsLayoutSidebarReverse } from "react-icons/bs";

export default function ChatHeader({ otherUser }) {
    return (
        <div className="flex items-center px-4 py-3 border-b">
            <div className="flex items-center">
                {otherUser ? (
                    <>
                        <img
                            src={otherUser?.avatar_url}
                            alt={otherUser?.full_name}
                            className="w-12 h-12 rounded-full mr-2 self-end"
                        />
                        <div className="ml-3">
                            <h2 className="font-semibold text-lg">{otherUser.full_name}</h2>
                            <p className="text-xs text-gray-500">Truy cập 13 phút trước</p>
                        </div>
                    </>
                ) : (
                    <div className="animate-pulse h-6 bg-gray-300 w-32 rounded"></div>
                )}
            </div>
            <div className="ml-auto flex">
                <button className="p-2">
                    <FaUserPlus className="h-6 w-6 text-gray-500" />
                </button>
                <button className="p-2">
                    <BsCameraVideo className="h-6 w-6 text-gray-500" />
                </button>
                <button className="p-2">
                    <BsLayoutSidebarReverse className="h-6 w-6 text-gray-500" />
                </button>
            </div>
        </div>
    );
}