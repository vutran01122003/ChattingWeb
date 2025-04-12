import { IoCameraOutline } from "react-icons/io5";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineClose } from "react-icons/md";
import Modal from "../modal/Modal";
import defaultBanner from "../../assets/images/user/default-banner.jpg";
import { Fragment, useState } from "react";
import EditProfile from "./EditProfile";
import { formatDate } from "../../utils";
import { FaAngleLeft } from "react-icons/fa6";

function Profile({ hideProfileModal, user }) {
    const [visibleEditModal, setVisibleEditModal] = useState(false);
    const [file, setFile] = useState("");

    const onToggleVisibleEditModal = () => {
        setVisibleEditModal((prev) => !prev);
    };

    return (
        <Modal hideModal={hideProfileModal}>
            <div className="w-sm h-80">
                <div className="w-sm bg-white rounded-lg overflow-hidden shadow-md border border-gray-300">
                    <div className="w-full h-12 p-3 flex items-center justify-between">
                        {visibleEditModal ? (
                            <div className="flex gap-2 items-center">
                                <button className="cursor-pointer" onClick={onToggleVisibleEditModal}>
                                    <FaAngleLeft />
                                </button>
                                <h3 className="font-semibold">Cập nhật thông tin cá nhân</h3>
                            </div>
                        ) : (
                            <h3 className="font-semibold">Thông tin tài khoản</h3>
                        )}
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
                            <img
                                src={file ? URL.createObjectURL(file) : user?.avatar_url}
                                alt="Avatar"
                                className="w-full h-full object-cover rounded-full"
                            />
                            {visibleEditModal && (
                                <Fragment>
                                    <input
                                        type="file"
                                        accept="image/png, image/gif, image/jpeg"
                                        hidden
                                        multiple={false}
                                        id="avatar_input"
                                        onInput={(e) => {
                                            setFile(e.target.files[0]);
                                        }}
                                    />

                                    <label
                                        htmlFor="avatar_input"
                                        className="block absolute bottom-0 right-0 bg-gray-100 p-1 rounded-full cursor-pointer hover:bg-gray-200"
                                    >
                                        <IoCameraOutline />
                                    </label>
                                </Fragment>
                            )}
                        </div>
                    </div>
                    {visibleEditModal ? (
                        <EditProfile
                            user={user}
                            file={file}
                            setFile={setFile}
                            onToggleVisibleEditModal={onToggleVisibleEditModal}
                        />
                    ) : (
                        <div className="w-full h-full">
                            <div className="flex items-center pb-2 pl-2">
                                <h2 className="font-semibold text-lg">{user?.full_name}</h2>
                            </div>
                            <div className="px-4 py-4 border-t border-gray-300">
                                <h3 className="font-semibold mb-3 text-md">Thông tin cá nhân</h3>
                                <div className="text-sm text-gray-800 space-y-2">
                                    <div className="flex gap-5">
                                        <span className="text-gray-500 min-w-24">Giới tính</span>
                                        <span>
                                            {user?.gender ? (user?.gender === "male" ? "Nam" : "Nữ") : "Chưa cập nhật"}
                                        </span>
                                    </div>
                                    <div className="flex gap-5">
                                        <span className="text-gray-500 min-w-24">Ngày sinh</span>
                                        <span>{formatDate(user?.date_of_birth)}</span>
                                    </div>
                                    <div className="flex gap-5">
                                        <span className="text-gray-500 min-w-24">Điện thoại</span>
                                        <span>{user?.phone}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 min-w-24 mt-2">
                                        Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này
                                    </p>
                                </div>
                            </div>

                            <div className="px-4 py-3 border-t flex justify-center border-gray-300">
                                <button
                                    onClick={onToggleVisibleEditModal}
                                    className="cursor-pointer active:text-blue-700 flex items-center gap-2 px-4 py-2 text-md font-medium text-blue-600 hover:bg-gray-100 rounded-lg"
                                >
                                    <LuPencilLine />
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default Profile;
