import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    replies: []
};

export const suggestMessage = createAsyncThunk("suggestMessage", async (msg) => {
    const prompt = `
            Bạn là một công cụ gợi ý trả lời. Đưa cho một tin nhắn, hãy gợi ý 3 câu trả lời ngắn gọn và tự nhiên mà ai đó có thể gửi lại.
            Tin nhắn: "${msg}"
            Trả lời 1:
        `;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 60,
                stop: ["\n\n"]
            },
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_APP_OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const suggestionsText = response.data.choices[0].message.content;

        const replies = suggestionsText
            .split("\n")
            .map(
                (line) =>
                    line
                        .trim()
                        .replace(/^[-•*]?\s*/, "") // loại bỏ dấu "-" đầu dòng
                        .replace(/^Reply \d+:\s*/, "") // loại bỏ "Reply 1:"
                        .replace(/^"(.+)"$/, "$1") // loại bỏ dấu ngoặc kép quanh câu
            )
            .filter(Boolean);

        return replies;
    } catch (err) {
        console.log(err);
        alert("Gợi ý tin nhắn thất bại");
    }
});

const aiSlice = createSlice({
    name: "ai",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(suggestMessage.fulfilled, (state, action) => {
            state.replies = action.payload;
        });
    }
});

export default aiSlice.reducer;
