import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate(); 

  const handleInputChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    setPhone(value); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Phone number submitted: ", phone);
    navigate("/forgot-password-confirmation", { state: { phone } });
  };

  const isPhoneValid = phone.length > 0;

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
        <div className="text-center font-semibold text-base text-gray-800 mb-4 border-b border-gray-300">
          Nhập số điện thoại của bạn
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="border-b border-gray-300 flex items-center pb-2 mx-auto w-[60%]">
            <span className="text-sm text-gray-700 mr-2">+84</span>
            <input
              type="tel"
              placeholder="Số điện thoại"
              value={phone}
              onChange={handleInputChange}
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div className="mx-auto w-[60%]">
            <button
              type="submit"
              className={`w-full py-3 rounded-md font-semibold text-sm ${isPhoneValid ? 'bg-[#2196f3] hover:bg-[#1c84dd] text-white' : 'bg-gray-300 text-gray-500'}`}
              disabled={!isPhoneValid}
            >
              Tiếp tục
            </button>
          </div>
        </form>
        <div className="text-center mt-4 text-sm">
          <div className="text-blue-600 hover:underline cursor-pointer">
            <a href="/login">« Quay lại</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
