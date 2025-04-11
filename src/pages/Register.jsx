import React, { useState, useRef, useEffect } from "react";
import countries from "../core/country_code";
import { useNavigate, Link } from "react-router";

function RegisterPage() {
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState({
        phone: "",
        password: "",
        confirmPassword: "",
        terms: "",
    });
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const validateForm = () => {
        const newErrors = {
            phone: "",
            password: "",
            confirmPassword: "",
            terms: "",
        };

        let isValid = true;

        if (!phoneNumber) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
            isValid = false;
        } else if (!/^\d+$/.test(phoneNumber)) {
            newErrors.phone = "Số điện thoại chỉ được chứa số";
            isValid = false;
        }

        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
            isValid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu không khớp";
            isValid = false;
        }

        if (!acceptTerms) {
            newErrors.terms = "Bạn cần chấp nhận điều khoản sử dụng";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (validateForm()) {
            navigate("/otp");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-blue-600">Zalo</h1>
                <p className="text-gray-600 mt-2">
                    Đăng ký tài khoản Zalo để kết nối với ứng dụng Zalo Web
                </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Đăng ký tài khoản
                </h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <div
                            className={`flex items-center border ${
                                errors.phone
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded-lg px-3 py-2 bg-gray-50`}
                        >
                            {/* Country dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className="flex items-center bg-transparent text-gray-700 mr-2"
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                >
                                    <span className="mr-1">
                                        {selectedCountry.code}
                                    </span>
                                    <svg
                                        className="w-4 h-4 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-64 bg-white shadow-lg max-h-60 rounded-md overflow-auto">
                                        <ul className="py-1">
                                            {countries.map((country) => (
                                                <li
                                                    key={country.code}
                                                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedCountry(
                                                            country
                                                        );
                                                        setIsDropdownOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    <span className="font-medium">
                                                        {country.code}
                                                    </span>{" "}
                                                    - {country.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                className="flex-1 bg-transparent outline-none text-gray-700"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <div
                            className={`flex items-center border ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded-lg px-3 py-2 bg-gray-50`}
                        >
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu"
                                className="flex-1 bg-transparent outline-none text-gray-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="text-gray-500 hover:text-blue-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <div
                            className={`flex items-center border ${
                                errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded-lg px-3 py-2 bg-gray-50`}
                        >
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
                                className="flex-1 bg-transparent outline-none text-gray-700"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                            <button
                                type="button"
                                className="text-gray-500 hover:text-blue-600"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 mr-2"
                                checked={acceptTerms}
                                onChange={(e) =>
                                    setAcceptTerms(e.target.checked)
                                }
                            />
                            <label
                                htmlFor="terms"
                                className="text-gray-600 text-sm"
                            >
                                Tôi đồng ý với{" "}
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline"
                                >
                                    Điều khoản sử dụng
                                </a>{" "}
                                của Zalo
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.terms}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Đăng ký
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-gray-600 text-sm">
                        Đã có tài khoản?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
