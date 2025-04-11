import { Route, Routes } from "react-router";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import NotfoundPage from "./pages/Notfound";
import OTPVerificationPage from "./pages/OTPVerification";
import InputNamePage from "./pages/InputNamePage";
import PersonalInfoPage from "./pages/PersonalInfoPage";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/otp" element={<OTPVerificationPage />} />
                <Route path="/input-name" element={<InputNamePage />} />
                <Route
                    path="/input-personal-info"
                    element={<PersonalInfoPage />}
                />
                <Route path="*" element={<NotfoundPage />} />
            </Routes>
        </div>
    );
}

export default App;
