import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { createPassword, updateUser } from "../redux/slices/authSlice";
import { authSelector } from "../redux/selector";

function InputNamePage() {
    const dispatch = useDispatch();
    const { temporaryPassword } = useSelector(authSelector);
    const [fullName, setFullName] = useState("");
    const navigate = useNavigate();
    const [birthdate, setBirthdate] = useState("");
    const [gender, setGender] = useState("");
    const [maxDate, setMaxDate] = useState("");

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];
        setMaxDate(formattedDate);
    }, []);

    const handleBirthdateChange = (e) => {
        setBirthdate(e.target.value);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    const handleContinue = () => {
        if (!fullName || !birthdate || !gender) return;
        dispatch(
            updateUser({
                fullName,
                dateOfBirth: birthdate,
                gender
            })
        );

        dispatch(createPassword({ temporaryPassword }));
        navigate("/");
    };

    const isFormValid = birthdate && gender;

    const handleNameChange = (e) => {
        setFullName(e.target.value);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <div className="w-full max-w-md px-6">
                <h1 className="text-xl font-semibold text-gray-800 text-center mb-1">Nhập thông tin tài khoản</h1>
                <p className="text-gray-600 text-sm text-center mb-4">Hãy dùng tên thật để mọi người dễ nhận ra bạn</p>

                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={handleNameChange}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                </div>

                <div className="mb-3">
                    <div className="relative">
                        <input
                            type="text"
                            value={birthdate}
                            onChange={handleBirthdateChange}
                            max={maxDate}
                            className="placeholder-gray-700 w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                            placeholder="Ngày sinh"
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => {
                                if (!e.target.value) e.target.type = "text";
                            }}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <select
                            value={gender}
                            onChange={handleGenderChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 appearance-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                        >
                            <option value="" disabled>
                                Giới tính
                            </option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <button
                    className={`w-full py-3 rounded-lg font-medium transition ${
                        fullName.trim().length >= 2 && isFormValid
                            ? "bg-blue-600 text-white cursor-pointer"
                            : "bg-blue-300 text-white cursor-not-allowed"
                    }`}
                    disabled={fullName.trim().length < 2}
                    onClick={handleContinue}
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}

export default InputNamePage;
