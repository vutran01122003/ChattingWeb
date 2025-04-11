import { Route, Routes } from "react-router";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import NotfoundPage from "./pages/Notfound";
import Layout from "./components/layout/Layout";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password-confirmation" element={<ForgotPasswordConfirmation />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="*" element={<NotfoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
