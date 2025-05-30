import React, { useState, useRef } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

const key =
    import.meta.env.VITE_APP_KEY_PART_1 + import.meta.env.VITE_APP_KEY_PART_2 + import.meta.env.VITE_APP_KEY_PART_3;

export default function VoiceToText({ handleToggleVisibleVoiceToText, setMessage }) {
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [loading, setLoading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

            // Gửi lên OpenAI Whisper API
            const formData = new FormData();
            formData.append("file", audioBlob, "audio.webm");
            formData.append("model", "whisper-1");

            setLoading(true);
            try {
                const res = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
                    headers: {
                        Authorization: `Bearer ${key}`,
                        "Content-Type": "multipart/form-data"
                    }
                });

                setTranscript(res.data.text);
                setMessage(res.data.text);
            } catch (error) {
                console.error("Lỗi:", error.response?.data || error.message);
                setTranscript("Lỗi khi xử lý âm thanh");
            }
            setLoading(false);
            handleToggleVisibleVoiceToText();
        };

        mediaRecorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    return (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-stone-800/70 flex justify-center items-center">
            <div className="w-[500px] bg-white shadow-2xl p-4">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="flex-1 font-semibold text-left">Nói để chuyển thành văn bản</h2>
                    <div onClick={handleToggleVisibleVoiceToText} className="cursor-pointer">
                        <IoMdClose color="red" size={22} />
                    </div>
                </div>

                <button onClick={recording ? stopRecording : startRecording}>
                    {recording ? "⏹️ Dừng ghi âm" : "▶️ Bắt đầu ghi âm"}
                </button>

                {loading && <p>⏳ Đang xử lý...</p>}
                {transcript && (
                    <p>
                        <strong>Kết quả:</strong> {transcript}
                    </p>
                )}
            </div>
        </div>
    );
}
