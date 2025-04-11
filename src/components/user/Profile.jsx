import { IoCameraOutline } from "react-icons/io5";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineClose } from "react-icons/md";
import Modal from "../modal/Modal";
import defaultBanner from "../../assets/images/user/default-banner.jpg";
import defaultAvatar from "../../assets/images/user/default-avatar.jpg";

function Profile({ hideProfileModal }) {
    return (
        <Modal hideModal={hideProfileModal}>
            <div className="w-sm h-80">
                <div className="w-sm bg-white rounded-lg overflow-hidden shadow-md border border-gray-300">
                    <div className="w-full h-12 p-3 flex items-center justify-between">
                        <h3 className="font-semibold">Thông tin tài khoản</h3>
                        <button
                            onClick={hideProfileModal}
                            className="hover:text-red-500 relative top-0.5 cursor-pointer"
                        >
                            <MdOutlineClose size={20} />
                        </button>
                    </div>
                    <div className="h-32 w-full">
                        <img src={defaultBanner} className="h-full w-full object-cover" />
                    </div>

                    <div className="relative -mt-10 px-4">
                        <div className="w-20 h-20 rounded-full border-4 border-white relative">
                            <img src={defaultAvatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                            <div className="absolute bottom-0 right-0 bg-gray-100 p-1 rounded-full cursor-pointer hover:bg-gray-200">
                                <IoCameraOutline />
                            </div>
                        </div>
                        <div className="flex items-center mt-2 gap-2">
                            <h2 className="font-semibold text-lg">Trần Đức Vũ</h2>
                            <span className="cursor-pointer relative top-0.5">
                                <LuPencilLine />
                            </span>
                        </div>
                    </div>

                    <div className="px-4 py-4 border-t border-gray-300">
                        <h3 className="font-semibold mb-3 text-md">Thông tin cá nhân</h3>
                        <div className="text-sm text-gray-800 space-y-2">
                            <div className="flex gap-5">
                                <span className="text-gray-500 min-w-24">Giới tính</span>
                                <span>Nam</span>
                            </div>
                            <div className="flex gap-5">
                                <span className="text-gray-500 min-w-24">Ngày sinh</span>
                                <span>01 tháng 12, 1960</span>
                            </div>
                            <div className="flex gap-5">
                                <span className="text-gray-500 min-w-24">Điện thoại</span>
                                <span>+84 943 608 225</span>
                            </div>
                            <p className="text-xs text-gray-500 min-w-24 mt-2">
                                Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này
                            </p>
                        </div>
                    </div>

                    <div className="px-4 py-3 border-t flex justify-center border-gray-300">
                        <button className="flex items-center gap-2 px-4 py-2 text-md font-medium text-blue-600 hover:bg-gray-100 rounded-lg">
                            <LuPencilLine />
                            Cập nhật
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default Profile;
