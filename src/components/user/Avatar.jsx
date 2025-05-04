import React, { useState, useEffect } from "react";
import defaultAvatar from "../../assets/images/user/default-avatar.jpg";

const Avatar = ({ src, alt = "Avatar", size = 44 }) => {
    const [imgSrc, setImgSrc] = useState(src || defaultAvatar);

    useEffect(() => {
        setImgSrc(src || defaultAvatar);
    }, [src]);

    const sizeStyle = {
        width: `${size}px`,
        height: `${size}px`
    };

    const handleError = () => {
        setImgSrc(defaultAvatar);
    };

    return (
        <div className="rounded-full overflow-hidden border border-gray-300 shadow-sm" style={sizeStyle}>
            <img src={imgSrc} alt={alt} onError={handleError} className="w-full h-full object-cover" />
        </div>
    );
};

export default Avatar;
