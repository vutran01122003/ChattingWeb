import { useState } from "react";
import { useDispatch } from "react-redux";
import { editProfile } from "../../redux/slices/authSlice";

function EditProfile({ user, file, setFile, onToggleVisibleEditModal }) {
    const dispatch = useDispatch();
    const [fullName, setFullName] = useState(user?.full_name || "");
    const [dateOfBirth, setDateOfBirth] = useState(user?.date_of_birth.split("T")[0] || "");
    const [gender, setGender] = useState(user?.gender);

    const onEditProfile = () => {
        dispatch(
            editProfile({
                fullName,
                dateOfBirth,
                gender,
                file,
                setFile
            })
        );
        onToggleVisibleEditModal();
    };
    return (
        <div className="max-w-md mx-auto bg-white shadow rounded-lg">
            <div className="p-4 space-y-6">
                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Tên hiển thị:</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Giới tính:</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={gender === "male"}
                                onChange={() => setGender("male")}
                                className="w-4 h-4 text-blue-600 "
                            />
                            <span className="ml-2">Nam</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={gender === "female"}
                                onChange={() => setGender("female")}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="ml-2">Nữ</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block font-medium text-gray-700">Ngày sinh:</label>
                    <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex justify-end p-4 space-x-2">
                <button
                    onClick={onToggleVisibleEditModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Hủy
                </button>
                <button
                    onClick={onEditProfile}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Cập nhật
                </button>
            </div>
        </div>
    );
}

export default EditProfile;
