import React, { useState } from "react";
import { useNavigate } from "react-router";

function InputNamePage() {
    const [fullName, setFullName] = useState("");
    const navigate = useNavigate();

    const handleNameChange = (e) => {
        setFullName(e.target.value);
    };

    const handleContinue = () => {
        navigate("/input-personal-info");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <div className="w-full max-w-md px-6">
                <h1 className="text-xl font-semibold text-gray-800 text-center mb-1">
                    Nhập tên Zalo
                </h1>
                <p className="text-gray-600 text-sm text-center mb-4">
                    Hãy dùng tên thật để mọi người dễ nhận ra bạn
                </p>

                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={handleNameChange}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                </div>

                <div className="text-xs text-gray-500 mb-6 pl-1">
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Dài từ 2 đến 40 ký tự</li>
                        <li>Không chứa số</li>
                        <li>
                            Cần tuân thủ{" "}
                            <a
                                href="#"
                                className="text-blue-600 hover:underline"
                            >
                                quy định đặt tên Zalo
                            </a>{" "}
                        </li>
                    </ul>
                </div>

                <button
                    className={`w-full py-3 rounded-lg font-medium transition ${
                        fullName.trim().length >= 2
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
