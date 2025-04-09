import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppProvider } from "./redux/store";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AppProvider>
            <App />
        </AppProvider>
    </BrowserRouter>
);
