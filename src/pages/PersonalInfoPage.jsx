import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function PersonalInfoPage() {
    const [birthdate, setBirthdate] = useState("");
    const [gender, setGender] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const navigate = useNavigate();

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
        navigate("/");
    };

    const isFormValid = birthdate && gender;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <div className="w-full max-w-md px-6">
                <h1 className="text-xl font-semibold text-gray-800 text-center mb-4">
                    Thêm thông tin cá nhân
                </h1>

                <div className="mb-3">
                    <div className="relative">
                        <input
                            type="date"
                            value={birthdate}
                            onChange={handleBirthdateChange}
                            max={maxDate}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                            placeholder="Sinh nhật"
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
                        isFormValid
                            ? "bg-blue-600 text-white cursor-pointer"
                            : "bg-blue-300 text-white cursor-not-allowed"
                    }`}
                    disabled={!isFormValid}
                    onClick={handleContinue}
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}

export default PersonalInfoPage;
