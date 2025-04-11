import { MdOutlinePersonAddAlt } from "react-icons/md";
import { MdOutlineGroupAdd } from "react-icons/md";

function SideBar() {
    return (
        <div className="w-xs border-r border-r-gray-200">
            <div className="flex gap-1 items-center p-3">
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="flex-1 bg-gray-100 px-2.5 py-1 rounded-sm outline-none focus:border border-blue-500"
                />

                <abbr title="Thêm bạn">
                    <button className="w-9 h-9 flex justify-center items-center hover:bg-gray-200 rounded-sm cursor-pointer">
                        <MdOutlinePersonAddAlt size={18} />
                    </button>
                </abbr>

                <abbr title="Tạo nhóm chat">
                    <button className="w-9 h-9 flex justify-center items-center hover:bg-gray-200 rounded-sm cursor-pointer">
                        <MdOutlineGroupAdd size={18} />
                    </button>
                </abbr>
            </div>
        </div>
    );
}

export default SideBar;
