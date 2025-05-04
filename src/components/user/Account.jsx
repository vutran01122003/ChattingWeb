import { useDispatch } from "react-redux";
import Avatar from "./Avatar";
import { IoKeySharp } from "react-icons/io5";
import { createConversation } from "../../redux/thunks/chatThunks";
import { FaMinus } from "react-icons/fa";

function Account({ user, authUser, group, conversation, handleRemoveMemberFromConversation }) {
    const dispatch = useDispatch();

    const handleOpenConversation = () => {
        if (authUser._id === user._id) return;

        dispatch(
            createConversation({
                otherUserId: [user._id]
            })
        ).then((res) => {
            const { conversation_id } = res.payload;
            window.location.href = `/chat/${conversation_id}`;
        });
    };

    return (
        <div className="flex gap-3 items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer w-full">
            <div className="flex gap-3 items-center flex-1" onClick={handleOpenConversation}>
                <div className="h-10 w-10 rounded-full relative">
                    <Avatar src={user.avatar_url} alt={user.full_name} size={40} />
                    {group && conversation.admin.includes(user._id) && (
                        <div className="h-5 w-5 rounded-full bg-stone-600/60 flex items-center justify-center absolute -bottom-0.5 -right-0.5">
                            <IoKeySharp color="yellow" size={12} />
                        </div>
                    )}
                    {group && conversation.sub_admin.includes(user._id) && (
                        <div className="h-5 w-5 rounded-full bg-stone-600/60 flex items-center justify-center absolute -bottom-0.5 -right-0.5">
                            <IoKeySharp color="white" size={12} />
                        </div>
                    )}
                </div>
                <div className="flex-1 text-sm font-medium text-gray-900">{`${
                    authUser._id === user._id ? "Bạn" : user.full_name
                }`}</div>
            </div>

            {group &&
                [...conversation.admin, ...conversation.sub_admin].includes(authUser._id) &&
                (![...conversation.admin, ...conversation.sub_admin].includes(user._id) ||
                    conversation.admin.includes(authUser._id)) &&
                authUser._id !== user._id && (
                    <div
                        className="rounded-full bg-stone-600/10 flex items-center justify-center p-2 hover:bg-stone-600/20"
                        onClick={() => handleRemoveMemberFromConversation(user)}
                    >
                        <FaMinus color="red" />
                    </div>
                )}
        </div>
    );
}

export default Account;
