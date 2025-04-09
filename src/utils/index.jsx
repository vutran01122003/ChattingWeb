export const getAccessToken = () => {
    return document.cookie.split(";").some((cookie) => cookie.trim().startsWith("accessToken="));
};
