import { MdContentCopy, MdInfoOutline } from "react-icons/md";
import { BsPinAngle } from "react-icons/bs";
import { CiStar, CiUndo } from "react-icons/ci";
import { FaListCheck } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { useEffect } from "react";

export default function MessageMenu({ isMe, currentYScroll, onClose }) {
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".message-menu")) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div className={`message-menu absolute 
            ${currentYScroll < 350 ? 'bottom-full mb-2' : 'top-full mt-2'}
            ${isMe ? 'right-0' : 'left-0'} 
            w-60 bg-white border shadow-lg rounded-lg z-50`}>
            <ul className="text-sm py-1">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                    <MdContentCopy className="w-5 h-5 mr-3 text-gray-600" />
                    Sao chép tin nhắn
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                    <BsPinAngle className="w-5 h-5 mr-3 text-gray-600" />
                    Ghim tin nhắn
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                    <CiStar className="w-5 h-5 mr-3 text-gray-600" />
                    Đánh dấu tin nhắn
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                    <FaListCheck className="w-5 h-5 mr-3 text-gray-600" />
                    Chọn nhiều
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                    <MdInfoOutline className="w-5 h-5 mr-3 text-gray-600" />
                    Xem chi tiết
                </li>
                <hr className="my-1" />
                {isMe && (
                    <>
                        <li className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center">
                            <CiUndo className="w-5 h-5 mr-3 text-red-600" />
                            Thu hồi
                        </li>
                        <li className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center">
                            <AiOutlineDelete className="w-5 h-5 mr-3 text-red-600" />
                            Xóa chỉ ở phía tôi
                        </li>
                    </>
                )}
                {!isMe && (
                    <li className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center">
                       <AiOutlineDelete className="w-5 h-5 mr-3 text-red-600" />
                        Xóa ở phía tôi
                    </li>
                )}
            </ul>
        </div>
    );
}