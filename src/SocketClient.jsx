import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { delSocket, getUsersOnline, setSocket } from "./redux/slices/socketSlice";
import { getAccessToken, getUserCredentials } from "./utils";

function SocketClient({ auth }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const { accessToken } = getUserCredentials();
        const socket = io(import.meta.env.VITE_APP_BASE_API_URI, {
            auth: {
                userId: auth?.user._id,
                token: accessToken
            }
        });

        if (auth?.user) {
            socket.on("connect", () => {
                dispatch(setSocket(socket));
                socket.emit("connected_user", auth?.user._id);
            });

            socket.on("user_online_list", (data) => {
                console.log(data);
                dispatch(getUsersOnline(data));
            });
        }

        return () => {
            if (socket) {
                delSocket();
                socket.disconnect();
            }
        };
    }, [dispatch, auth?.user]);

    return <></>;
}

export default SocketClient;
