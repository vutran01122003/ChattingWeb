import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { fetchConversations } from "../redux/thunks/chatThunks";
import { useDispatch, useSelector } from "react-redux";

export default function ListGroupsScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { groupConversations } = useSelector((state) => state.chat);
  const conversations = useMemo(() => {
    return [...groupConversations];
  }, [groupConversations]);

  const filteredGroups = conversations.filter((group) =>
    group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderGroupAvatar = (group) => {
    if (group.group_avatar) {
      return (
        <img
          src={group.group_avatar} 
          alt={group.group_name}
          className="w-10 h-10 rounded-full"
        />
      );
    } else {
      let bgColor = "bg-blue-500";
      if (group.group_name.startsWith("CNM")) bgColor = "bg-yellow-500";
      if (group.group_name.includes("HELP")) bgColor = "bg-red-500";
      if (group.isCommunity) bgColor = "bg-purple-500";

      return (
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor} text-white font-bold`}
        >
          {group.iconText || group.group_name.charAt(0)}
        </div>
      );
    }
  };

  const renderGroupItem = (group) => {
    return (
      <div
        key={group.conversation_id} 
        className="flex items-center py-3 px-4 border-b border-gray-200 hover:bg-gray-50"
      >
        {renderGroupAvatar(group)}

        <div className="ml-3 flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-base font-medium text-gray-900">
                {group.group_name}
              </h3>
            </div>
            <button className="p-1 hover:bg-gray-200 rounded-full">
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="mt-1 text-sm text-gray-500 flex items-center">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {group.participants ? group.participants.length : 0} thành viên
            </span>

          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  return (
    <div className="flex flex-row h-screen">
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="py-2 px-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Users className="mr-2" />
            <h1 className="text-lg font-medium">Danh sách nhóm và cộng đồng</h1>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg
                className="w-5 h-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg
                className="w-5 h-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-medium">
                Nhóm và cộng đồng ({filteredGroups.length})
              </h2>
            </div>

            <div className="p-4 flex space-x-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span>Hoạt động (mới → cũ)</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>

              <button className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span>Tất cả</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-screen">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => renderGroupItem(group))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Không tìm thấy nhóm hoặc cộng đồng phù hợp
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
