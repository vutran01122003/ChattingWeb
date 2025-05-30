import { Fragment, useState } from "react";
import Tippy from "@tippyjs/react/headless";
import { GoGear } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { MdOutlineCloudQueue } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import { RiContactsBook3Line } from "react-icons/ri";
import { SlLogout } from "react-icons/sl";
import { Link } from "react-router";
import Avatar from "../user/Avatar";
import Profile from "../user/Profile";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { authSelector } from "../../redux/selector";

function Tab({currentFeatureId, setCurrentFeatureId}) {
    const dispatch = useDispatch();
    const { user } = useSelector(authSelector);
    // const [currentFeatureId, setCurrentFeatureId] = useState(1);
    const [visibleSettingModal, setVisibleSettingModal] = useState(false);
    const [visibleProfile, setVisibleProfile] = useState(false);
    const features = [
        {
            id: 1,
            name: "Tin nhắn",
            icon: <MdOutlineMessage size={30} />,
            url: "/"
        },
        {
            id: 2,
            name: "Danh bạ",
            icon: <RiContactsBook3Line size={30} />,
            url: "/list-friend"
        },
        {
            id: 3,
            name: "Cloud của tôi",
            icon: <MdOutlineCloudQueue size={30} />
        },
        {
            id: 4,
            name: "Cài đặt",
            icon: <GoGear size={31} />
        }
    ];

    const settingOptions = [
        {
            id: 1,
            name: "Thông tin tài khỏan",
            icon: <CiUser size={18} />
        },
        {
            id: 2,
            name: "Cài đặt",
            icon: <GoGear size={17} />
        },
        {
            id: 3,
            name: "Đăng xuất",
            icon: <SlLogout />
        }
    ];

    const hideSettingModal = () => {
        setVisibleSettingModal(false);
        setCurrentFeatureId(null);
    };

    const hideProfileModal = () => {
        setVisibleProfile(false);
    };

    const onLogout = () => {
        dispatch(logout());
    };

    return (
        <Fragment>
            {visibleProfile && <Profile hideProfileModal={hideProfileModal} user={user} />}

            <div className="bg-blue-700 h-full w-16 flex flex-col justify-between pt-8 pb-8">
                <div className="flex flex-col items-center gap-8 text-white">
                    <button onClick={() => setVisibleProfile(true)}>
                        <Avatar src={user?.avatar_url} />
                    </button>
                    {features.map((feature) => {
                        if ([1, 2].includes(feature.id))
                            return (
                                <abbr key={feature.id} title={feature.name}>
                                    <Link
                                        to={feature.url}
                                        onClick={() => setCurrentFeatureId(feature.id)}
                                        className={`flex justify-center items-center w-12 h-12 rounded-sm ${
                                            currentFeatureId === feature.id ? "bg-blue-800" : null
                                        }`}
                                    >
                                        {feature.icon}
                                    </Link>
                                </abbr>
                            );
                        return null;
                    })}
                </div>

                <div className="flex flex-col items-center gap-8 text-white">
                    {features.map((feature) => {
                        if (feature.id === 3) {
                            return (
                                <abbr key={feature.id} title={feature.name}>
                                    <button
                                        onClick={() => setCurrentFeatureId(feature.id)}
                                        className={`flex justify-center items-center w-12 h-12 rounded-sm ${
                                            currentFeatureId === feature.id ? "bg-blue-800" : null
                                        }`}
                                    >
                                        {feature.icon}
                                    </button>
                                </abbr>
                            );
                        } else if (feature.id === 4) {
                            return (
                                <Tippy
                                    key={feature.id}
                                    visible={visibleSettingModal}
                                    onClickOutside={hideSettingModal}
                                    placement="top-end"
                                    interactive={true}
                                    render={(attrs, ref) => (
                                        <div
                                            ref={ref}
                                            tabIndex="-1"
                                            className="w-3xs border border-stone-500 bg-gray-50 p-2"
                                            {...attrs}
                                        >
                                            {settingOptions.map((option) => {
                                                return (
                                                    <div
                                                        key={option.id}
                                                        className={`flex items-center gap-5 p-1 hover:bg-gray-200 cursor-pointer ${
                                                            option.id === 3 ? "text-red-500" : "text-black"
                                                        }`}
                                                        onClick={() => {
                                                            hideSettingModal();
                                                            if (option.id === 1) setVisibleProfile(true);
                                                            if (option.id === 3) onLogout();
                                                        }}
                                                    >
                                                        <span>{option.icon}</span>
                                                        <span>{option.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                >
                                    <abbr key={feature.id} title={feature.name}>
                                        <button
                                            onClick={() => {
                                                setCurrentFeatureId(feature.id);
                                                setVisibleSettingModal((prev) => !prev);
                                            }}
                                            className={`flex justify-center items-center w-12 h-12 rounded-sm ${
                                                currentFeatureId === feature.id ? "bg-blue-800" : null
                                            }`}
                                        >
                                            {feature.icon}
                                        </button>
                                    </abbr>
                                </Tippy>
                            );
                        } else return null;
                    })}
                </div>
            </div>
        </Fragment>
    );
}

export default Tab;
