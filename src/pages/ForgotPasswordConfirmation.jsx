import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const ForgotPasswordConfirmation = () => {
  const location = useLocation();
  const phone = location.state?.phone; 

  const [activationCode, setActivationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleActivationCodeChange = (event) => {
    setActivationCode(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const isFormValid = activationCode && newPassword && confirmPassword;

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Activation Code: ", activationCode);
    console.log("New Password: ", newPassword);
    console.log("Confirm Password: ", confirmPassword);
  };

  return (
    <div className="min-h-screen bg-[#e6efff] flex flex-col items-center justify-center">
      <img
        src="https://stc-zlogin.zdn.vn/images/zlogo.png"
        alt="Zalo"
        className="h-9 mb-3"
      />
      <h2 className="text-center text-gray-600 text-base mb-6 leading-5 font-semibold">
        Khôi phục mật khẩu Zalo <br />
        để kết nối với ứng dụng Zalo Web
      </h2>

      <div className="bg-white p-6 pt-6 rounded-xl shadow-md w-[400px]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className=" bg-[#e6efff] flex flex-col items-center justify-center p-6">
            <div className="mb-4 text-center text-lg text-gray-700">
                <p className="text-sm">Gửi tin nhắn để nhận mã xác thực</p>
              <strong>
                {phone ? `(+84) ${phone}` : "Số điện thoại không có"}
              </strong>
            </div>
            {/* Mã kích hoạt */}
            <div className="border-b border-gray-300 flex items-center pb-2 mx-auto w-[80%]">
              <div className="w-full bg-[#ffff] rounded-md p-2">
                <input
                  type="text"
                  placeholder="Nhập mã kích hoạt"
                  value={activationCode}
                  onChange={handleActivationCodeChange}
                  className="w-full text-sm text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 text-center"
                />
              </div>
            </div>

            <div className="text-sm text-blue-600 mt-2 text-center">
              <p>
                Soạn tin nhắn với cú pháp <strong>“ZALOPC”</strong> gửi đến 6020
                (1000đ/tin) để nhận mã xác thực (Chỉ áp dụng cho mạng Viettel,
                Mobifone, Vinaphone, Vietnamobile, Gmobile)
              </p>
            </div>
          </div>

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
                isFormValid
                  ? "bg-[#2196f3] hover:bg-[#1c84dd] text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
              disabled={!isFormValid} 
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>

      <div className="text-center mt-6 text-sm text-gray-500">
        <span className="hover:underline cursor-pointer mr-2">Tiếng Việt</span>{" "}
        | <span className="hover:underline cursor-pointer ml-2">English</span>
      </div>
    </div>
  );
};

export default ForgotPasswordConfirmation;
