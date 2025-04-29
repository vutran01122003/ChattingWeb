import React from "react";
import { useOutletContext } from "react-router";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

function HomePage() {
    const selectedUser = useOutletContext();
    const slides = [
        {
            title: "Gửi file nặng?",
            description: "Gửi file nặng lên đến 2GB",
            image: "https://i.ibb.co/XZCS8wdd/inapp-welcome-screen.png"
        },
        {
            title: "Tin nhắn nhanh",
            description: "Nhắn tin nhiều hơn, soạn thảo ít hơn",
            image: "https://i.ibb.co/MyFH43nj/quick-message-onboard.png"
        },
        {
            title: "Đồng bộ tin nhắn",
            description: "Giúp bạn xem lại lịch sử cuộc trò chuyện mọi lúc, mọi nơi.",
            image: "https://i.ibb.co/1t1FfZwh/inapp-welcome-screen-04.png"
        }
    ];

    return (
        <div className="bg-gray-100 h-screen flex flex-col">
            {selectedUser ? (
                <ChatInterface selectedUser={selectedUser} />
            ) : (
                <div className="flex flex-1 h-full justify-center items-center bg-white z-10 relative">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        pagination={{ clickable: true }}
                        navigation
                        loop
                        className="w-[600px] max-w-full p-4"
                    >
                        {slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <div className="flex flex-col items-center text-center gap-6 px-6 py-6">
                                    <img src={slide.image} alt="slide" className="mx-auto mb-6 sw-[400px] max-w-full" />
                                    <h2 className="text-2xl font-semibold mb-2">{slide.title}</h2>
                                    <p className="text-gray-600 mb-4">{slide.description}</p>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2">
                                        Thử ngay
                                    </button>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
}

export default HomePage;
