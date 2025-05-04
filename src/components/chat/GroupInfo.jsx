import React, { Fragment, useEffect, useRef, useState } from "react";
import { FiUsers } from "react-icons/fi";
import Avatar from "../user/Avatar";
import { FaRegEdit } from "react-icons/fa";
import { IoMdAddCircleOutline, IoMdClose } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import Account from "../user/Account";
import AddMemberModal from "../modal/AddMemberModal";
import { useDispatch, useSelector } from "react-redux";
import { updateConversation, updateMembersToConversation } from "../../redux/thunks/chatThunks";
import { socketSelector } from "../../redux/selector";
import PermissionGroupModal from "../modal/PermissionGroupModal";

const GroupInfo = ({ conversation, authUser }) => {
    const dispatch = useDispatch();
    const socket = useSelector(socketSelector);
    const fileRef = useRef();
    const [visibleMemberList, setVisibleMemberList] = useState(false);
    const [visibleEditGroupInfoUI, setVisibleEditGroupInfoUI] = useState(false);
    const [visibleAddMemberModal, setVisibleAddMemberModal] = useState(false);
    const [visiblePermissionModal, setVisiblePermissionModal] = useState(false);
    const [visibleAdminPermissionModal, setVisibleAdminPermissionModal] = useState(false);

    const [file, setFile] = useState("");
    const [groupName, setGroupName] = useState(conversation.group_name);
    const status = "remove-members";
    const [allowSendMessage, setAllowSendMessage] = useState(conversation.allow_send_message);
    const [allowChangeGroupInfo, setAllowChangeGroupInfo] = useState(conversation.allow_change_group_info);

    const handleToggleAllowSendMessagePermission = () => {
        setAllowSendMessage((prev) => !prev);

        dispatch(
            updateConversation({
                conversationId: conversation.conversation_id,
                allowSendMessage: !allowSendMessage
            })
        ).then((data) => {
            console.log(data);
            socket.emit("update_conversation", data.payload);
        });
    };

    const handleToggleAllowChangeGroupInfoPermission = () => {
        setAllowChangeGroupInfo((prev) => !prev);

        dispatch(
            updateConversation({
                conversationId: conversation.conversation_id,
                allowChangeGroupInfo: !allowChangeGroupInfo
            })
        ).then((data) => {
            console.log(data);
            socket.emit("update_conversation", data.payload);
        });
    };

    const handleLeaveGroup = () => {
        dispatch(
            updateMembersToConversation({
                userIdList: [authUser._id],
                conversationId: conversation.conversation_id,
                status
            })
        ).then((res) => {
            socket.emit("update_conversation_members", {
                ...res.payload,
                status,
                removedUser: authUser
            });
            window.location.href = "/";
        });
    };

    const handleDeleteGroup = () => {
        dispatch(
            updateConversation({
                conversationId: conversation.conversation_id,
                isActive: false
            })
        ).then((data) => {
            socket.emit("update_conversation", {
                ...data.payload,
                delete_group: true
            });
            window.location.href = "/";
        });
    };

    const resetFile = () => {
        setFile("");
        fileRef.current.value = "";
    };

    const handleTogglePermisionModal = () => {
        setVisiblePermissionModal((prev) => !prev);
    };

    const handleToggleAdminPermisionModal = () => {
        setVisibleAdminPermissionModal((prev) => !prev);
    };

    const handleToggleVisibleEditGroupInfoUI = () => {
        setVisibleEditGroupInfoUI((prev) => !prev);
    };

    const handleRemoveMemberFromConversation = (user) => {
        dispatch(
            updateMembersToConversation({
                userIdList: [user._id],
                conversationId: conversation.conversation_id,
                status
            })
        ).then((res) => {
            socket.emit("update_conversation_members", {
                ...res.payload,
                status,
                removedUser: user
            });
        });
    };

    const handleToggleVisibleMemberList = () => {
        setVisibleMemberList((prev) => !prev);
    };

    const handleToggleVisibleAddMemberModal = () => {
        setVisibleAddMemberModal((prev) => !prev);
    };

    const handleUpdateGroupInfo = () => {
        if (!groupName) return;

        const data = new FormData();
        data.append("conversationId", conversation.conversation_id);
        data.append("groupName", groupName);
        data.append("file", file);

        dispatch(updateConversation(data)).then((data) => {
            socket.emit("update_conversation", data.payload);
            handleToggleVisibleEditGroupInfoUI();
        });
    };

    useEffect(() => {
        setAllowSendMessage(conversation.allow_send_message);
        setAllowChangeGroupInfo(conversation.allow_change_group_info);
    }, [JSON.stringify(conversation)]);

    return (
        <Fragment>
            {visibleAddMemberModal && (
                <AddMemberModal
                    handleToggleVisibleAddMemberModal={handleToggleVisibleAddMemberModal}
                    otherUser={conversation.other_user}
                    conversation={conversation}
                />
            )}

            {visiblePermissionModal && (
                <PermissionGroupModal
                    users={conversation.other_user}
                    handleTogglePermisionModal={handleTogglePermisionModal}
                    conversation={conversation}
                />
            )}

            {visibleAdminPermissionModal && (
                <PermissionGroupModal
                    users={conversation.other_user}
                    handleTogglePermisionModal={handleToggleAdminPermisionModal}
                    conversation={conversation}
                    adminPermission={true}
                />
            )}
            <div className="w-[350px] h-screen bg-white overflow-y-scroll scrollbar-hide border-l border-gray-200 py-3">
                <div className="text-center border-b p-4 border-gray-200 font-semibold text-lg">
                    {visibleMemberList && (
                        <div className="text-center relative">
                            <span
                                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                                onClick={handleToggleVisibleMemberList}
                            >
                                <FaChevronLeft size={22} />
                            </span>
                            <span>Thành viên</span>
                        </div>
                    )}

                    {!visibleMemberList && <span>Thông tin nhóm</span>}
                </div>

                {visibleMemberList && (
                    <div>
                        <Account
                            key={authUser._id}
                            user={authUser}
                            authUser={authUser}
                            group={true}
                            conversation={conversation}
                        />
                        {conversation.other_user.map((user) => (
                            <Account
                                key={user._id}
                                user={user}
                                authUser={authUser}
                                group={true}
                                conversation={conversation}
                                handleRemoveMemberFromConversation={handleRemoveMemberFromConversation}
                            />
                        ))}
                    </div>
                )}

                {!visibleMemberList && (
                    <Fragment>
                        <div
                            className={`relative flex flex-col items-center ${
                                visibleEditGroupInfoUI ? "pb-12" : "py-4"
                            } px-6`}
                        >
                            {!visibleEditGroupInfoUI ? (
                                <Fragment>
                                    <div className="flex -space-x-4 mb-2">
                                        <Avatar src={conversation?.group_avatar} alt="avatar" size={80} />
                                    </div>
                                    <div className="text-center font-semibold text-base">
                                        {conversation?.group_name}
                                    </div>
                                    {(conversation.allow_change_group_info ||
                                        [...conversation.admin, ...conversation.sub_admin].includes(authUser._id)) && (
                                        <button
                                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                                            onClick={handleToggleVisibleEditGroupInfoUI}
                                        >
                                            <FaRegEdit />
                                        </button>
                                    )}
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <h3 className="font-medium mb-4 mt-4">Chỉnh sửa thông tin</h3>

                                    {!file ? (
                                        <div className="relative w-[80px] h-[80px]">
                                            <Avatar src={conversation?.group_avatar} alt="avatar" size={80} />
                                            <label
                                                htmlFor="input_file"
                                                className="absolute -bottom-1 right-1 w-6 h-6 bg-stone-600/70 rounded-full flex justify-center items-center cursor-pointer hover:bg-stone-600/90"
                                            >
                                                <MdOutlineEdit color="white" />
                                            </label>

                                            <input
                                                id="input_file"
                                                type="file"
                                                ref={fileRef}
                                                accept="image/png, image/gif, image/jpeg"
                                                hidden
                                                onChange={(e) => {
                                                    setFile(e.target.files[0]);
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative rounded-full border border-gray-300 shadow-sm w-[80px] h-[80px]">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="avatar"
                                                className="w-full h-full object-cover rounded-full "
                                            />

                                            <div
                                                className="absolute -bottom-1 right-1 w-6 h-6 bg-stone-600/60 rounded-full flex justify-center items-center cursor-pointer hover:bg-stone-600/70"
                                                onClick={resetFile}
                                            >
                                                <IoMdClose color="red" />
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="text"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        className="border border-gray-200 flex-1 h-10 px-3 py-1 outline-0 rounded-sm mt-2.5"
                                        placeholder="Nhập tên nhóm..."
                                    />

                                    <div className="absolute bottom-2 right-4 flex gap-2">
                                        <button
                                            disabled={!groupName}
                                            className={`w-20 py-1  text-white rounded-sm cursor-pointer text-sm font-semibold ${
                                                groupName ? "bg-blue-500" : "bg-blue-300"
                                            }`}
                                            onClick={handleUpdateGroupInfo}
                                        >
                                            Cập nhật
                                        </button>

                                        <button
                                            className="w-20 py-1 bg-red-500 text-white rounded-sm cursor-pointer text-sm font-semibold"
                                            onClick={handleToggleVisibleEditGroupInfoUI}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </Fragment>
                            )}
                        </div>

                        <div className="px-6 py-4 border-b border-t border-gray-300">
                            <div className="font-medium mb-2">Thành viên nhóm</div>
                            <div
                                className="flex items-center text-sm text-gray-700 hover:underline cursor-pointer mb-1"
                                onClick={handleToggleVisibleAddMemberModal}
                            >
                                <span className="ml-2">
                                    <IoMdAddCircleOutline size={16} />
                                </span>
                                <span className="ml-2">Thêm thành viên</span>
                            </div>
                            <div
                                className="flex items-center text-sm text-gray-700 hover:underline cursor-pointer"
                                onClick={handleToggleVisibleMemberList}
                            >
                                <span className="ml-2">
                                    <FiUsers size={16} />
                                </span>
                                <span className="ml-2">{`${conversation?.other_user.length + 1} thành viên`}</span>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-b border-gray-300">
                            <div className="font-medium mb-2">Trưởng và phó nhóm</div>
                            <div
                                className={`text-sm text-gray-700 flex items-center mb-1  hover:underline ${
                                    conversation.admin.includes(authUser._id) ? "cursor-pointer" : "cursor-not-allowed"
                                }`}
                                onClick={conversation.admin.includes(authUser._id) ? handleTogglePermisionModal : null}
                            >
                                <span className="ml-2">Quản lý phó nhóm</span>
                            </div>
                            <div
                                className={`text-sm text-gray-700 flex items-center mb-1  hover:underline ${
                                    conversation.admin.includes(authUser._id) ? "cursor-pointer" : "cursor-not-allowed"
                                }`}
                                onClick={
                                    conversation.admin.includes(authUser._id) ? handleToggleAdminPermisionModal : null
                                }
                            >
                                <span className="ml-2">Chuyển quyền trưởng nhóm</span>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-b border-gray-300">
                            <div className="font-medium mb-2">Quyền hạn thành viên</div>
                            <div className="px-4">
                                <div
                                    className={`flex items-center justify-between py-1 select-none mb-2  ${
                                        [...conversation.admin, ...conversation.sub_admin].includes(authUser._id)
                                            ? " cursor-pointer"
                                            : "cursor-not-allowed"
                                    }`}
                                    onClick={
                                        [...conversation.admin, ...conversation.sub_admin].includes(authUser._id)
                                            ? handleToggleAllowChangeGroupInfoPermission
                                            : null
                                    }
                                >
                                    <span className="text-sm text-gray-700 flex items-center">
                                        Thay đổi tên & ảnh đại diện của nhóm
                                    </span>
                                    <input
                                        checked={allowChangeGroupInfo}
                                        type="checkbox"
                                        className="accent-blue-500 w-4 h-4"
                                        readOnly
                                    />
                                </div>

                                <div
                                    className={`flex items-center justify-between py-1 select-none ${
                                        [...conversation.admin, ...conversation.sub_admin].includes(authUser._id)
                                            ? " cursor-pointer"
                                            : "cursor-not-allowed"
                                    }`}
                                    onClick={
                                        [...conversation.admin, ...conversation.sub_admin].includes(authUser._id)
                                            ? handleToggleAllowSendMessagePermission
                                            : null
                                    }
                                >
                                    <span className="text-sm text-gray-700 flex items-center">Gửi tin nhắn</span>
                                    <input
                                        type="checkbox"
                                        checked={allowSendMessage}
                                        className="accent-blue-500 w-4 h-4"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 px-6 py-4">
                            <button
                                className="w-full bg-red-200 text-red-600 font-semibold py-2 rounded cursor-pointer"
                                onClick={handleLeaveGroup}
                            >
                                Rời nhóm
                            </button>

                            {conversation.admin.includes(authUser._id) && (
                                <button
                                    className="w-full bg-red-200 text-red-600 font-semibold py-2 rounded cursor-pointer"
                                    onClick={handleDeleteGroup}
                                >
                                    Giải tán nhóm
                                </button>
                            )}
                        </div>
                    </Fragment>
                )}
            </div>
        </Fragment>
    );
};

export default GroupInfo;
