import React, { Fragment, useState } from "react";
import { useOutletContext } from "react-router";
import { useSelector } from "react-redux";
import { authSelector, callSelector, peerSelector, socketSelector } from "../redux/selector";
import ChatHeader from "../components/message/ChatHeader";
import ChatFooter from "../components/message/ChatFooter";
import CallModal from "../components/message/CallModal";

function HomePage() {
    const selectedUser = useOutletContext();
    return (
        <div className="bg-gray-100 h-screen flex flex-col">
            <ChatInterface selectedUser={selectedUser} />
        </div>
    );
}

function ChatInterface({ selectedUser }) {
    const auth = useSelector(authSelector);
    const call = useSelector(callSelector);
    const peer = useSelector(peerSelector);
    const socket = useSelector(socketSelector);

    return (
        <Fragment>
            <ChatHeader selectedUser={selectedUser} peer={peer} auth={auth} socket={socket} />
            <main className="flex-1 overflow-y-auto p-4"></main>
            <ChatFooter />

            {Object.keys(call).length > 0 && !call.calling && (
                <CallModal auth={auth} call={call} socket={socket} peer={peer} />
            )}
        </Fragment>
    );
}

export default HomePage;
