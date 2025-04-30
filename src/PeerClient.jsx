import { Peer } from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callSelector, peerSelector, socketSelector } from "./redux/selector";
import getStream from "./utils/getStream";
import CallUserModal from "./components/call/CallUserModal";
import { setPeer } from "./redux/slices/peerSlice";
import { calling, callUser } from "./redux/slices/callSlice";

function PeerClient({ auth }) {
    const peerRef = useRef(null);
    const dispatch = useDispatch();
    const call = useSelector(callSelector);
    const peer = useSelector(peerSelector);
    const socket = useSelector(socketSelector);
    const [stream, setStream] = useState(null);
    const remoteVideo = useRef();
    const localVideo = useRef();
    const remoteAudio = useRef();

    const handleEndCall = () => {
        dispatch(callUser({}));

        const restUserId = call?.sender._id === auth.user._id ? call?.receiver._id : call?.sender._id;
        socket.emit("end_call", { restUserId });

        if (stream) {
            stream.getTracks().forEach(function (track) {
                track.stop();
            });
        } else {
            window.location.reload();
        }
    };

    useEffect(() => {
        if (socket && Object.keys(call).length > 0) {
            socket.on("disconnected_user", ({ userId }) => {
                if (call.receiver._id === userId || call.sender._id === userId) {
                    if (stream) {
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                    } else {
                        window.location.reload();
                    }

                    dispatch(callUser({}));
                }
            });

            return () => {
                socket.off("disconnected_user");
            };
        }
    }, [socket, call, dispatch, stream]);

    useEffect(() => {
        if (socket && Object.keys(peer).length > 0) {
            socket.on("answer_user", (data) => {
                dispatch(callUser(data));
            });

            socket.on("end_call", () => {
                dispatch(calling(false));

                dispatch(callUser({}));

                if (stream) {
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                } else {
                    window.location.reload();
                }
            });

            socket.on("answer_call", (data) => {
                dispatch(calling(true));
                getStream({ audio: true, video: data.isVideo ? {} : data.isVideo })
                    .then((stream) => {
                        setStream(stream);
                        if (data.isVideo) {
                            localVideo.current.srcObject = stream;
                            localVideo.current.play();
                        }
                        const call = peerRef.current.call(data.peerId, stream);

                        call.on("stream", function (stream) {
                            data.isVideo
                                ? (remoteVideo.current.srcObject = stream)
                                : (remoteAudio.current.srcObject = stream);
                        });
                    })
                    .catch((error) => {
                        throw error;
                    });
            });

            return () => {
                socket.off("answer_user");
                socket.off("end_call");
                socket.off("answer_call");
            };
        }
        // eslint-disable-next-line
    }, [socket, peer, dispatch]);

    useEffect(() => {
        const callVideo = call.video;
        if (peerRef.current && socket && callVideo !== undefined) {
            peerRef.current.on("call", function (call) {
                getStream({ audio: true, video: callVideo })
                    .then((stream) => {
                        setStream(stream);
                        call.on("stream", function (stream) {
                            callVideo
                                ? (remoteVideo.current.srcObject = stream)
                                : (remoteAudio.current.srcObject = stream);
                        });

                        if (callVideo) {
                            localVideo.current.srcObject = stream;
                            localVideo.current.play();
                        }

                        call.answer(stream);
                    })
                    .catch((error) => {
                        throw error;
                    });
            });

            return () => {
                peerRef.current.off("call");
            };
        }
        // eslint-disable-next-lin
    }, [socket, peer, dispatch, call?.video]);

    // Initial peer client
    useEffect(() => {
        const newPeer = new Peer(undefined, {
            path: "/",
            secure: true
        });
        newPeer.on("open", () => {
            peerRef.current = newPeer;
            dispatch(setPeer(newPeer.id));
        });

        return () => newPeer.destroy();
    }, [dispatch]);

    return call.calling ? (
        <CallUserModal
            call={call}
            localVideo={localVideo}
            remoteVideo={remoteVideo}
            remoteAudio={remoteAudio}
            handleEndCall={handleEndCall}
        />
    ) : null;
}

export default PeerClient;
