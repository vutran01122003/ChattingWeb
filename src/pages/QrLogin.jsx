import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getDataApi } from "../utils/fetchData";
import { setUserCredentialsExist } from "../utils";

function OrLogin() {
    const [sessionId, setSessionId] = useState(null);
    const [status, setStatus] = useState("waiting");
    useEffect(() => {
        const generateSession = async () => {
            const { data } = await getDataApi("auth/generateQRSession");
            setSessionId(data.metadata.sessionId);
        };
        generateSession();
    }, []);

    useEffect(() => {
        if (!sessionId) return;
        const interval = setInterval(async () => {
            try {
                const { data } = await getDataApi("/auth/checkQRSession", { sessionId });
                const { status, tokens, userId } = data.metadata;
                if (status === "approved") {
                    clearInterval(interval);
                    setStatus("approved");
                    setUserCredentialsExist({
                        clientId: userId,
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken
                    });
                    window.location.href = "/";
                }
            } catch (err) {
                clearInterval(interval);
                setStatus("error");
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [sessionId]);

    return (
        <div className="flex flex-col items-center gap-4 mt-10">
            <h1 className="text-5xl font-bold text-blue-600 font-serif mb-4">Lochat</h1>

            <h2 className="text-center text-gray-600 text-base mb-6 leading-5 font-semibold">
                Đăng nhập tài khoản Lochat <br />
                để kết nối với ứng dụng Lochat Web
            </h2>
            {sessionId && <QRCodeSVG value={sessionId} size={200} />}

            <p>
                {status === "waiting" && "Đang chờ xác nhận từ thiết bị di động..."}
                {status === "approved" && "✅ Đăng nhập thành công!"}
                {status === "error" && "❌ Mã QR không hợp lệ hoặc đã hết hạn."}
            </p>
        </div>
    );
}

export default OrLogin;
