import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getFriendList } from "../../redux/slices/friendSlice";
import Avatar from "../user/Avatar";
import { getUserBySearch } from "../../redux/slices/authSlice";
import { updateMembersToConversation } from "../../redux/thunks/chatThunks";
import { socketSelector } from "../../redux/selector";

const sortByTheFirstLetter = (arr, otherUser) => {
    return arr.reduce((acc, contact) => {
        if (otherUser.every((user) => user._id !== contact._id)) {
            const firstLetter = contact.full_name.split("")[0];
            if (!acc[firstLetter]) acc[firstLetter] = [];
            acc[firstLetter].push(contact);
        }

        return acc;
    }, {});
};

function AddMemberModal({ handleToggleVisibleAddMemberModal, otherUser, conversation }) {
    const dispatch = useDispatch();
    const socket = useSelector(socketSelector);
    const status = "add-members";
    const [keyword, setKeyWord] = useState("");
    const [selected, setSelected] = useState([]);
    const friendship = useSelector((state) => state.friendship);
    const [groupedContacts, setgroupedContacts] = useState([]);

    const handleAddMembersToConversation = () => {
        dispatch(
            updateMembersToConversation({
                conversationId: conversation.conversation_id,
                userIdList: selected,
                status
            })
        ).then((res) => {
            handleToggleVisibleAddMemberModal();
            socket.emit("update_conversation_members", {
                ...res.payload,
                status,
                newUserIdList: selected
            });
        });
    };

    const toggleSelect = (name) => {
        setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
    };

    useEffect(() => {
        dispatch(getFriendList());
    }, []);

    useEffect(() => {
        setgroupedContacts(sortByTheFirstLetter(friendship.friendList, otherUser));
    }, [JSON.stringify(friendship.friendList), otherUser]);

    useEffect(() => {
        let timerId = null;
        if (keyword && otherUser) {
            timerId = setTimeout(() => {
                dispatch(getUserBySearch({ search: keyword, forGroup: true })).then((data) => {
                    if (data?.error) setgroupedContacts({}, otherUser);
                    else setgroupedContacts(sortByTheFirstLetter(data.payload.metadata, otherUser));
                });
            }, 500);
        } else setgroupedContacts(sortByTheFirstLetter(friendship.friendList, otherUser));

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [keyword, otherUser]);

    return (
        <Modal hideModal={handleToggleVisibleAddMemberModal}>
            <div className="w-[400px] bg-white rounded shadow p-4">
                <div className="relative">
                    <h2 className="text-xl font-semibold mb-4">Thêm thành viên</h2>
                    <div
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-gray-100 flex justify-center items-center hover:bg-gray-200"
                        onClick={handleToggleVisibleAddMemberModal}
                    >
                        <IoMdClose color="red" size={20} />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <input
                        placeholder="Nhập tên hoặc số điện thoại..."
                        className="border border-gray-200  h-10 px-3 outline-0 rounded-4xl"
                        value={keyword}
                        onChange={(e) => setKeyWord(e.target.value)}
                    />
                </div>

                <div className="h-[300px] pr-2">
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
                        onClick={handleToggleVisibleAddMemberModal}
                    >
                        Hủy
                    </button>
                    <button
                        disabled={selected.length === 0}
                        className={`h-10 w-28 rounded-sm  font-semibold text-white  ${
                            selected.length === 0 ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 cursor-pointer"
                        }`}
                        onClick={handleAddMembersToConversation}
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default AddMemberModal;
