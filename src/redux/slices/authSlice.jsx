import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDataApi, postDataApi } from "../../utils/fetchData";
import { getUserCredentials, removeUserCredentials, toBase64 } from "../../utils";
const { clientId } = getUserCredentials();

const initialState = {
    user: null,
    tokens: {
        refreshToken: null,
        accessToken: null,
        otpToken: null
    },
    temporaryPassword: null
};

export const signUp = createAsyncThunk("signUp", async ({ phone, password }) => {
    const res = await postDataApi("/auth/signup", {
        phone,
        password
    });

    return res.data;
});

export const verifyOtp = createAsyncThunk("verifyOtp", async ({ otp, token }) => {
    const res = await postDataApi("/auth/verify-otp", {
        otp,
        token
    });
    return res.data;
});

export const editProfile = createAsyncThunk("editProfile", async ({ fullName, dateOfBirth, gender, file, setFile }) => {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("gender", gender);
    formData.append("file", file);

    const res = await postDataApi("/user/edit-profile", formData, {
        "x-client-id": clientId
    });

    setFile("");

    return res.data;
});

export const updateUser = createAsyncThunk("updateUser", async ({ fullName, dateOfBirth, gender }) => {
    const res = await postDataApi(
        "/user/update-info",
        {
            fullName,
            dateOfBirth,
            gender
        },
        {
            "x-client-id": clientId
        }
    );

    return res.data;
});

export const createPassword = createAsyncThunk("createPassword", async ({ temporaryPassword }) => {
    const res = await postDataApi(
        "/user/create-password",
        {
            password: temporaryPassword
        },
        {
            "x-client-id": clientId
        }
    );

    return res.data;
});

export const login = createAsyncThunk("login", async ({ phone, password }) => {
    const res = await postDataApi(
        "/auth/login",
        {
            phone,
            password
        },
        {
            "x-client-id": clientId
        }
    );

    return res.data;
});

export const getUserDataByTokensAndClientId = createAsyncThunk("getUserDataByToken", async ({ setIsLoading }) => {
    return new Promise((resolve, reject) => {
        getDataApi("/auth/user-info", null, {
            "x-client-id": clientId
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((e) => reject(e))
            .finally(() => {
                setIsLoading(false);
            });
    });
});

export const logout = createAsyncThunk("logout", async () => {
    return new Promise((resolve, reject) => {
        postDataApi("/auth/logout", null, {
            "x-client-id": clientId
        })
            .then(() => {
                removeUserCredentials();
                window.location.reload();
            })
            .catch((e) => reject(e));
    });
});

export const requestForgotPassword = createAsyncThunk("requestForgotPassword", async ({ phone }) => {
    const res = await postDataApi("/user/request-reset-password", {
        phone
    });

    return res.data;
});

export const verifyForgotPasswordOtp = createAsyncThunk("verifyForgotPasswordOtp", async ({ otp, token }) => {
    const res = await postDataApi("/user/verify-reset-password", {
        otp,
        token
    });

    return res.data;
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signUp.fulfilled, (state, action) => {
                state.temporaryPassword = action.meta.arg.password;
                state.tokens.otpToken = action.payload?.metadata?.token;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                const { tokens, user } = action.payload?.metadata;
                state.tokens = tokens;
                state.user = user;

                localStorage.setItem("refreshToken", tokens.refreshToken);
                localStorage.setItem("accessToken", tokens.accessToken);
                localStorage.setItem("clientId", user._id);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                console.log(action.payload.data);
            })
            .addCase(getUserDataByTokensAndClientId.fulfilled, (state, action) => {
                state.user = action.payload.metadata?.user;
            })
            .addCase(createPassword.fulfilled, (state, action) => {
                state.temporaryPassword = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                const { tokens, user } = action.payload?.metadata;
                state.tokens = tokens;
                state.user = user;
                localStorage.setItem("refreshToken", tokens.refreshToken);
                localStorage.setItem("accessToken", tokens.accessToken);
                localStorage.setItem("clientId", user._id);
            })
            .addCase(editProfile.fulfilled, (state, action) => {
                state.user = action.payload?.metadata;
            })
            .addCase(requestForgotPassword.fulfilled, (state, action) => {
                state.tokens.otpToken = action.payload?.metadata?.token;
            })
            .addCase(verifyForgotPasswordOtp.fulfilled, (state, action) => {
                const { phone, result } = action.payload?.metadata;
                state.verifyForgotPasswordStatus = {
                    phone,
                    result
                };
            });
    }
});

export default authSlice.reducer;
