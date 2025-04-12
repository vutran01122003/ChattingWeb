import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../redux/slices/authSlice";

const LoginPage = () => {
    const dispatch = useDispatch();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handlePhoneChange = (event) => {
        const value = event.target.value.replace(/[^0-9]/g, "");
        setPhone(value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        dispatch(
            login({
                phone,
                password
            })
        );
    };

    const isFormValid = phone && password;

    return (
        <div className="min-h-screen bg-[#e6efff] flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-blue-600 font-serif mb-4">Lochat</h1>

            <h2 className="text-center text-gray-600 text-base mb-6 leading-5 font-semibold">
                Đăng nhập tài khoản Lochat <br />
                để kết nối với ứng dụng Lochat Web
            </h2>

            <div className="bg-white p-6 pt-6 rounded-xl shadow-md w-[500px] h-[500px]">
                <div className="text-center font-semibold text-base text-gray-800 mb-4 pb-2 border-b border-gray-300">
                    Đăng nhập với mật khẩu
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="border-b border-gray-300 flex items-center mt-15 pb-2 mx-auto w-[60%]">
                        <span className="text-sm text-gray-700 mr-2">+84</span>
                        <input
                            type="tel"
                            placeholder="Số điện thoại"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:border-blue-500 focus:ring-0"
                        />
                    </div>

                    <div className="border-b border-gray-300 pb-2 mx-auto w-[60%]">
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full text-sm text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:border-blue-500 focus:ring-0"
                        />
                    </div>

                    <div className="mx-auto w-[60%]">
                        <button
                            type="submit"
                            className={`w-full py-2 rounded-md font-semibold text-sm ${
                                isFormValid ? "bg-[#2196f3] hover:bg-[#1c84dd] text-white" : "bg-gray-300 text-gray-500"
                            }`}
                            disabled={!isFormValid}
                        >
                            Đăng nhập với mật khẩu
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4 text-sm">
                    <div className="flex gap-10 justify-center">
                        <div className="text-blue-600 hover:underline cursor-pointer">
                            <Link to="/register">Đăng ký tài khoản</Link>
                        </div>

                        <div className="text-blue-600 hover:underline cursor-pointer">
                            <Link to="/forgot-password">Quên mật khẩu</Link>
                        </div>
                    </div>

                    <div className="text-blue-600 mt-10 hover:underline cursor-pointer mt-2 font-medium">
                        <Link to="/qr-login">Đăng nhập qua mã QR</Link>
                    </div>
                </div>

                <div className="mt-10 border p-3 rounded-lg flex items-center gap-3 bg-[#f1f7ff]">
                    <img src="https://stc-zlogin.zdn.vn/images/banner_icon.svg" alt="Zalo PC" className="w-15 h-15" />
                    <div className="flex-1">
                        <strong className="text-sm leading-4 text-gray-800">
                            Nâng cao hiệu quả công việc với Lochat
                        </strong>
                        <p className="text-sm leading-4 text-gray-800">
                            Gửi file lớn lên đến 1 GB, chụp màn hình, gọi video và nhiều tiện ích hơn nữa
                        </p>
                    </div>
                    <div>
                        <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium">
                            Tải ngay
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center mt-6 text-sm text-gray-500">
                <span className="hover:underline cursor-pointer mr-2">Tiếng Việt</span> |{" "}
                <span className="hover:underline cursor-pointer ml-2">English</span>
            </div>
        </div>
    );
};

export default LoginPage;
