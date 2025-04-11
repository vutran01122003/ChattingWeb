import { Route, Routes } from "react-router";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import NotfoundPage from "./pages/Notfound";
import OTPVerificationPage from "./pages/OTPVerification";
import InputNamePage from "./pages/InputNamePage";
import PersonalInfoPage from "./pages/PersonalInfoPage";
import Layout from "./components/layout/Layout";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordConfirmation from "./pages/ForgotPasswordConfirmation";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password-confirmation" element={<ForgotPasswordConfirmation />} />
            <Route path="/otp" element={<OTPVerificationPage />} />
            <Route path="/input-name" element={<InputNamePage />} />
            <Route path="/input-personal-info" element={<PersonalInfoPage />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="*" element={<NotfoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
