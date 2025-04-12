export const getAccessToken = () => {
    return document.cookie.split(";").some((cookie) => cookie.trim().startsWith("accessToken="));
};

export const getUserCredentials = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const clientId = localStorage.getItem("clientId");

    return {
        accessToken,
        refreshToken,
        clientId
    };
};

export const removeUserCredentials = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("clientId");
};

export const setUserCredentialsExist = ({ accessToken, refreshToken, clientId }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("clientId", clientId);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
};

export const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
