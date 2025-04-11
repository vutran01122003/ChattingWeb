import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";

function OTPVerificationPage() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        let interval = null;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer]);

    const handleResendCode = () => {
        if (!canResend) return;

        setTimer(60);
        setCanResend(false);

        console.log("Requesting new OTP code");
    };

    const handleChange = (index, value) => {
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").trim();

        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("");
            const newOtp = [...otp];

            digits.forEach((digit, index) => {
                if (index < 6) {
                    newOtp[index] = digit;
                }
            });

            setOtp(newOtp);

            if (inputRefs.current[5]) {
                inputRefs.current[5].focus();
            }
        }
    };

    const handleConfirmation = () => {
        navigate("/input-name");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-blue-600">Zalo</h1>
                <p className="text-gray-600 mt-2">Xác thực tài khoản của bạn</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Nhập mã xác thực
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                    Chúng tôi đã gửi mã xác thực đến số điện thoại của bạn. Vui
                    lòng nhập mã 6 chữ số vào ô bên dưới.
                </p>

                {/* OTP Input Group */}
                <div
                    className="flex justify-between mb-6"
                    onPaste={handlePaste}
                >
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                                handleChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    ))}
                </div>

                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    onClick={handleConfirmation}
                >
                    Xác nhận
                </button>

                <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                        Không nhận được mã?{" "}
                        <button
                            onClick={handleResendCode}
                            disabled={!canResend}
                            className={`text-sm ${
                                canResend
                                    ? "text-blue-600 hover:underline cursor-pointer"
                                    : "text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            Gửi lại mã {!canResend && `(${timer}s)`}
                        </button>
                    </p>
                </div>

                <div className="text-center mt-2">
                    <p className="text-gray-600 text-sm">
                        <Link
                            to="/register"
                            className="text-blue-600 hover:underline"
                        >
                            Thay đổi số điện thoại
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OTPVerificationPage;
