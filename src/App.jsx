import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import NotfoundPage from "./pages/Notfound";
import OTPVerificationPage from "./pages/OTPVerification";
import UpdateUserInfo from "./pages/UpdateUserInfo";
import Layout from "./components/layout/Layout";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordConfirmation from "./pages/ForgotPasswordConfirmation";
import { getUserDataByTokensAndClientId } from "./redux/slices/authSlice";
import { authSelector } from "./redux/selector";
import QrLogin from "./pages/QrLogin";

function App() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const auth = useSelector(authSelector);

    useEffect(() => {
        dispatch(getUserDataByTokensAndClientId({ setIsLoading }));
    }, []);

    if (isLoading) return null;

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/qr-login" element={<QrLogin />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password-confirmation" element={<ForgotPasswordConfirmation />} />
            <Route path="/otp" element={<OTPVerificationPage />} />
            <Route path="/update-info" element={<UpdateUserInfo />} />
            <Route path="/" element={auth.user ? <Layout /> : <LoginPage />}>
                <Route index element={<HomePage />} />
                <Route path="*" element={<NotfoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
