import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { authSelector } from "../redux/selector";
import { setPassword } from "../redux/slices/authSlice";

const ForgotPasswordConfirmation = () => {
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const verifyFPStatus = auth?.verifyForgotPasswordStatus;

    const [activationCode, setActivationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const isFormValid = newPassword && confirmPassword && newPassword === confirmPassword;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Mật khẩu không trùng nhau!");
        } else {
            dispatch(
                setPassword({
                    phone: verifyFPStatus?.phone,
                    newPassword
                })
            );

            window.location.href = "/";
        }
    };

    return (
        <div className="min-h-screen bg-[#e6efff] flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-blue-600 font-serif mb-4">Lochat</h1>
            <h2 className="text-center text-gray-600 text-base mb-6 leading-5 font-semibold">
                Khôi phục mật khẩu Lochat <br />
                để kết nối với ứng dụng Lochat Web
            </h2>

            <div className="bg-white p-6 pt-6 rounded-xl shadow-md w-[400px]">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Mật khẩu */}
                    <div className="border-b border-gray-300 pb-2 mx-auto w-[80%]">
                        <input
                            type="password"
                            placeholder="Vui lòng nhập mật khẩu"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            className="w-full text-sm text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:border-blue-500 focus:ring-0"
                        />
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="border-b border-gray-300 pb-2 mx-auto w-[80%]">
                        <input
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="w-full text-sm text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:border-blue-500 focus:ring-0"
                        />
                    </div>

                    <div className="mx-auto w-[80%]">
                        <button
                            type="submit"
                            className={`w-full py-3 rounded-md font-semibold text-sm ${
                                isFormValid ? "bg-[#2196f3] hover:bg-[#1c84dd] text-white" : "bg-gray-300 text-gray-500"
                            }`}
                            disabled={!isFormValid}
                        >
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>

            <div className="text-center mt-6 text-sm text-gray-500">
                <span className="hover:underline cursor-pointer mr-2">Tiếng Việt</span> |{" "}
                <span className="hover:underline cursor-pointer ml-2">English</span>
            </div>
        </div>
    );
};

export default ForgotPasswordConfirmation;
