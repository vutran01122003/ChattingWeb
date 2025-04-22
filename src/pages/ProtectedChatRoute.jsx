import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatPage from "./ChatPage";

export default function ProtectedChatRoute() {
    const { otherId } = useParams(); // giữ nguyên
    const navigate = useNavigate();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const navType = performance.getEntriesByType("navigation")[0]?.type;
        if (navType === "reload") {
            navigate("/", { replace: true });
        } else {
            setShouldRender(true);
        }
    }, [navigate]);

    if (!shouldRender) return null;

    return <ChatPage otherId={otherId} />;
}
