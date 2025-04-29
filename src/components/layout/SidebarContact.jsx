import React, { useState } from "react";
import { Users, UserPlus, User, UsersRound } from "lucide-react";
import { Link } from "react-router";

export default function SidebarContact() {
    const [activeIndex, setActiveIndex] = useState(0);

    const menuItems = [
        {
            icon: <User className="w-5 h-5" />,
            text: "Danh sách bạn bè",
            url: "/list-friend"
        },
        {
            icon: <Users className="w-5 h-5" />,
            text: "Danh sách nhóm và cộng đồng"
        },
        {
            icon: <UserPlus className="w-5 h-5" />,
            text: "Lời mời kết bạn",
            url: "/friend-request"
        },
        {
            icon: <UsersRound className="w-5 h-5" />,
            text: "Lời mời vào nhóm và cộng đồng"
        }
    ];

    return (
        <div className="w-[300px] flex flex-col h-screen bg-white">
            <div className="flex gap-1 items-center p-3">
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="flex-1 bg-gray-100 px-2.5 py-1 rounded-sm outline-none focus:border border-blue-500"
                />
            </div>
            {menuItems.map((item, index) => {
                const isActive = index === activeIndex;
                const content = (
                    <div
                        key={index}
                        className={`flex items-center gap-3 p-3 cursor-pointer ${
                            isActive ? "bg-blue-100 text-blue-600" : "bg-white hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveIndex(index)}
                    >
                        <div className={isActive ? "text-blue-600" : "text-gray-600"}>{item.icon}</div>
                        <span className={`font-medium ${isActive ? "text-blue-600" : "text-gray-800"}`}>
                            {item.text}
                        </span>
                    </div>
                );

                return item.url ? (
                    <Link to={item.url} key={index}>
                        {content}
                    </Link>
                ) : (
                    <div key={index}>{content}</div>
                );
            })}
        </div>
    );
}
