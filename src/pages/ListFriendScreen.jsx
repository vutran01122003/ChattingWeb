import { useState, useEffect } from "react";
import { Search, ChevronDown, MoreHorizontal, Users } from "lucide-react";
import { getFriendList } from "../redux/slices/friendSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../components/user/Avatar";

export default function ListFriendScreen() {
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    const { friendList } = useSelector((state) => state.friendship);

    useEffect(() => {
        dispatch(getFriendList());
    }, []);

    const filteredContacts = friendList.filter((friend) =>
        friend.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedContacts = filteredContacts.reduce((acc, friend) => {
        const group = friend.full_name.charAt(0).toUpperCase();
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(friend);
        return acc;
    }, {});

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="bg-white p-3.5 shadow">
                <div className="flex items-center">
                    <Users className="mr-2" />
                    <h1 className="text-lg font-medium">Danh sách bạn bè</h1>
                </div>
            </div>

            <div className="p-4">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-base font-medium">Bạn bè ({friendList.length})</h2>
                    </div>

                    <div className="p-4 flex space-x-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tìm bạn"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="relative inline-block text-left">
                            <button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <span>Tên (A-Z)</span>
                                <ChevronDown className="w-5 h-5 ml-2 -mr-1" />
                            </button>
                        </div>

                        <div className="relative inline-block text-left">
                            <button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <span>Tất cả</span>
                                <ChevronDown className="w-5 h-5 ml-2 -mr-1" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-96">
                        {Object.keys(groupedContacts)
                            .sort()
                            .map((group) => (
                                <div key={group}>
                                    <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-500">{group}</h3>
                                    </div>

                                    {groupedContacts[group].map((friend) => (
                                        <div
                                            key={friend._id}
                                            className="flex items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
                                        >
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                                                <Avatar src={friend.avatar_url} alt={friend.full_name} size={40} />
                                            </div>
                                            <div className="ml-3 flex-grow">
                                                <p className="text-sm font-medium text-gray-900">{friend.full_name}</p>
                                            </div>
                                            <button className="p-1 rounded-full hover:bg-gray-200">
                                                <MoreHorizontal className="h-5 w-5 text-gray-200" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
