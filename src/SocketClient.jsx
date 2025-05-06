import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { delSocket, getUsersOnline, setSocket } from "./redux/slices/socketSlice";
import { getUserCredentials } from "./utils";
import { addConversation, removeConversation, updateConv } from "./redux/slices/chatSlice";
import { useLocation } from "react-router";

function SocketClient({ auth }) {
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    useEffect(() => {
        if (auth?.user) {
            const { accessToken } = getUserCredentials();
            const socket = io(import.meta.env.VITE_APP_BASE_API_URI, {
                auth: {
                    userId: auth?.user._id,
                    token: accessToken
                }
            });

            const connectSocketHandler = () => {
                dispatch(setSocket(socket));
                socket.emit("connected_user", auth?.user._id);
            };

            const getUsersOnlineHandler = (data) => {
                dispatch(getUsersOnline(data));
            };

            const createConversationHandler = (data) => {
                dispatch(addConversation(data));
            };

            const updateConversationMembersHandler = (data) => {
                if (data.status === "add-members") {
                    if(data.newUserIdList.includes(auth.user._id)) dispatch(addConversation(data));
                    else dispatch(updateConv(data));
                } else {
                    if (auth.user._id === data.removedUser._id) {
                        window.location.href = "/";
                        dispatch(removeConversation(data));
                    }
                    else dispatch(updateConv(data));
                }
            };

            const updateConversationHandler = (data) => {
                console.log(data);
                if (data.delete_group) {
                    if (pathname.split("/")[2] === data.conversation_id) window.location.href = "/";
                }
                dispatch(updateConv(data));
            };

            socket.on("connect", connectSocketHandler);
            socket.on("user_online_list", getUsersOnlineHandler);
            socket.on("create_conversation", createConversationHandler);
            socket.on("update_conversation_members", updateConversationMembersHandler);
            socket.on("update_conversation", updateConversationHandler);

            return () => {
                if (socket) {
                    delSocket();
                    socket.disconnect();
                    socket.off("connect", connectSocketHandler);
                    socket.off("user_online_list", getUsersOnlineHandler);
                    socket.off("create_conversation", createConversationHandler);
                    socket.off("update_conversation_members", updateConversationMembersHandler);
                    socket.off("update_conversation", updateConversationHandler);
                }
            };
        }
    }, [dispatch, auth?.user, pathname]);

    return <></>;
}

export default SocketClient;
