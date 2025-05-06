import React, { useEffect, useState } from "react";
import Modal from "./Modal";

import { useDispatch, useSelector } from "react-redux";
import Avatar from "../user/Avatar";
import { socketSelector } from "../../redux/selector";
import { updateConversation } from "../../redux/thunks/chatThunks";
import { FaMinus } from "react-icons/fa";

const sortByTheFirstLetter = (arr) => {
    return arr.reduce((acc, contact) => {
        const firstLetter = contact.full_name.split("")[0];
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(contact);
        return acc;
    }, {});
};

function PermissionGroupModal({ users, handleTogglePermisionModal, conversation, adminPermission }) {
    const dispatch = useDispatch();
    const socket = useSelector(socketSelector);
    const [keyword, setKeyWord] = useState("");
    const [selected, setSelected] = useState([]);
    const [groupedContacts, setgroupedContacts] = useState([]);
    const [userList, setUserList] = useState(users);

    const toggleSelect = (name) => {
        adminPermission
            ? setSelected([name])
            : setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
    };

    const handleAddSubAdminToConversation = () => {
        dispatch(
            updateConversation({
                conversationId: conversation.conversation_id,
                subAdmin: selected,
                subAdminStatus: "add-sub-admin"
            })
        ).then((data) => {
            socket.emit("update_conversation", data.payload);
            setKeyWord("");
            setSelected([]);
        });
    };
    const handleChangeAdmin = () => {
        dispatch(
            updateConversation({
                conversationId: conversation.conversation_id,
                admin: selected
            })
        ).then((data) => {
            socket.emit("update_conversation", data.payload);
            setKeyWord("");
            setSelected([]);
            handleTogglePermisionModal();
        });
    };

    const handleDeleteSubAdminToConversation = (userId) => {
        dispatch(
            updateConversation({
                conversationId: conversation.conversation_id,
                subAdmin: [userId],
                subAdminStatus: "delete-sub-admin"
            })
        ).then((data) => {
            console.log(data.payload);
            socket.emit("update_conversation", data.payload);
            setKeyWord("");
            setSelected([]);
        });
    };

    useEffect(() => {
        if (!keyword) setUserList(users.filter((user) => !conversation.sub_admin.includes(user._id)));
        else setUserList(users.filter((user) => user.full_name.toLowerCase()).includes(keyword.toLowerCase()));
    }, [keyword, JSON.stringify(conversation.sub_admin)]);

    useEffect(() => {
        if (userList) setgroupedContacts(sortByTheFirstLetter(userList));
    }, [JSON.stringify(userList)]);

    return (
        <Modal hideModal={handleTogglePermisionModal}>
            <div className="w-[400px] bg-white rounded shadow p-4">
                {!adminPermission && (
                    <div className="mb-3 w-full max-h-[200px] pr-2 overflow-auto">
                        <h3 className="font-semibold mb-2">Danh sách phó nhóm</h3>
                        <div>
                            {users && users.map((user) => {
                                if (conversation.sub_admin.includes(user._id))
                                    return (
                                        <div key={user._id} className="flex items-center gap-3 mb-3">
                                            <Avatar src={user.avatar_url} alt="avatar" size={40} />
                                            <span className="flex-1 font-semibold">{user.full_name}</span>
                                            <div
                                                className="rounded-full bg-stone-600/10 flex items-center justify-center h-6 w-6 hover:bg-stone-600/20"
                                                onClick={() => handleDeleteSubAdminToConversation(user._id)}
                                            >
                                                <FaMinus color="red" />
                                            </div>
                                        </div>
                                    );
                                return null;
                            })}

                            {conversation.sub_admin.length === 0 && (
                                <h3 className="font-semibold text-gray-600 text-center p-1">Trống</h3>
                            )}
                        </div>
                    </div>
                )}

                <div className="mb-3">
                    <h3 className="font-semibold mb-2">
                        {adminPermission ? "Chuyển quyền trưởng nhóm" : "Thêm phó nhóm"}
                    </h3>
                    <input
                        placeholder="Nhập tên..."
                        className="border border-gray-300 h-10 px-3 outline-0 rounded-4xl w-full"
                        value={keyword}
                        onChange={(e) => setKeyWord(e.target.value)}
                    />
                </div>

                <div className="w-full max-h-[200px] pr-2 overflow-auto">
                    {Object.entries(groupedContacts).map(([letter, items]) => (
                        <div key={letter} className="mb-2">
                            <h3 className="font-bold text-gray-700 mb-1">{letter}</h3>
                            {items.map(({ _id, full_name, avatar_url }) => (
                                <div
                                    key={_id}
                                    className="flex items-center gap-2 mb-2 cursor-pointer"
                                    onClick={() => toggleSelect(_id)}
                                >
                                    <input type="checkbox" checked={selected.includes(_id)} readOnly />
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <Avatar src={avatar_url} alt={full_name} size={32} />
                                    </div>
                                    <span>{full_name}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        variant="outline"
                        className="h-10 w-22 rounded-sm bg-gray-300 font-semibold cursor-pointer"
                        onClick={handleTogglePermisionModal}
                    >
                        Hủy
                    </button>
                    <button
                        disabled={selected.length === 0}
                        className={`h-10 w-28 rounded-sm  font-semibold text-white  ${
                            selected.length === 0 ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 cursor-pointer"
                        }`}
                        onClick={adminPermission ? handleChangeAdmin : handleAddSubAdminToConversation}
                    >
                        {adminPermission ? "Đồng ý" : "Thêm"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default PermissionGroupModal;
