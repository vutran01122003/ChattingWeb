import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { IoCameraSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getFriendList } from "../../redux/slices/friendSlice";
import Avatar from "../user/Avatar";
import { createConversation } from "../../redux/thunks/chatThunks";
import { MdDeleteOutline } from "react-icons/md";
import { getUserBySearch } from "../../redux/slices/authSlice";
import { socketSelector } from "../../redux/selector";

const sortByTheFirstLetter = (arr) => {
    return arr.reduce((acc, contact) => {
        const firstLetter = contact.full_name.split("")[0];
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(contact);
        return acc;
    }, {});
};
function CreateGroupModal({ handleToggleDisplayCreateGroupModal }) {
    const dispatch = useDispatch();
    const socket = useSelector(socketSelector);
    const fileRef = useRef();
    const [groupName, setGroupName] = useState("");
    const [keyword, setKeyWord] = useState("");
    const [selected, setSelected] = useState([]);
    const [file, setFile] = useState("");
    const friendship = useSelector((state) => state.friendship);
    const [groupedContacts, setgroupedContacts] = useState([]);

    const toggleSelect = (name) => {
        setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
    };

    const resetData = () => {
        setGroupName("");
        setSelected([]);
        setFile("");
        fileRef.current.value = "";
    };

    const handleCreateGroup = async () => {
        if (selected.length === 0 || !groupName) return;

        const data = new FormData();
        data.append("groupName", groupName);
        data.append("otherUserId", JSON.stringify(selected));
        data.append("file", file);

        dispatch(createConversation(data)).then((data) => {
            resetData();
            handleToggleDisplayCreateGroupModal();
            socket.emit("create_conversation", data.payload);
        });
    };

    useEffect(() => {
        dispatch(getFriendList());
    }, []);

    useEffect(() => {
        setgroupedContacts(sortByTheFirstLetter(friendship.friendList));
    }, [JSON.stringify(friendship.friendList)]);

    useEffect(() => {
        let timerId = null;
        if (keyword) {
            timerId = setTimeout(() => {
                dispatch(getUserBySearch({ search: keyword, forGroup: true })).then((data) => {
                    if (data?.error) setgroupedContacts({});
                    else setgroupedContacts(sortByTheFirstLetter(data.payload.metadata));
                });
            }, 500);
        } else setgroupedContacts(sortByTheFirstLetter(friendship.friendList));

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [keyword]);

    return (
        <Modal hideModal={handleToggleDisplayCreateGroupModal}>
            <div className="w-[400px] bg-white rounded shadow p-4">
                <div className="relative">
                    <h2 className="text-xl font-semibold mb-4">Tạo nhóm</h2>
                    <div
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-gray-100 flex justify-center items-center hover:bg-gray-200"
                        onClick={handleToggleDisplayCreateGroupModal}
                    >
                        <IoMdClose color="red" size={20} />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                        {file ? (
                            <div className="relative">
                                <div
                                    className="absolute -right-1 -bottom-1 w-5 h-5 bg-gray-50 hover:bg-gray-100 border rounded-full border-gray-400 flex justify-center items-center cursor-pointer"
                                    onClick={() => {
                                        setFile("");
                                        fileRef.current.value = "";
                                    }}
                                >
                                    <MdDeleteOutline color="red" size={16} />
                                </div>
                                <img src={URL.createObjectURL(file)} className="h-10 w-10 rounded-full object-cover" />
                            </div>
                        ) : (
                            <label
                                htmlFor="input_file"
                                className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer"
                            >
                                <IoCameraSharp size={20} color="gray" />
                            </label>
                        )}

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

                        <input
                            placeholder="Nhập tên nhóm..."
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="border border-gray-200 flex-1 h-10 px-3 outline-0 rounded-sm"
                        />
                    </div>

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
                        onClick={handleToggleDisplayCreateGroupModal}
                    >
                        Hủy
                    </button>
                    <button
                        disabled={!groupName || selected.length < 2}
                        className={`h-10 w-28 rounded-sm  font-semibold text-white  ${
                            !groupName || selected.length < 2
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-500 cursor-pointer"
                        }`}
                        onClick={handleCreateGroup}
                    >
                        Tạo nhóm
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default CreateGroupModal;
