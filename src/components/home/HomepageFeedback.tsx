"use client";

import React from "react";
import { Rate, Avatar } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { FaQuoteLeft } from "react-icons/fa";

interface Feedback {
  name: string;
  age: number;
  username: string;
  avatar: string;
  rating: number;
  content: string;
}

const feedbacks: Feedback[] = [
  {
    name: "Minh Anh",
    age: 10,
    username: "@minhanh",
    avatar: "/images/home/feedback-girl.png",
    rating: 5,
    content:
      "Em thích Algoki lắm! Mấy bài học Java dễ hiểu kinh khủng, lại còn được tự tay code game nữa chứ. Giờ em thấy code không khó như em nghĩ tí nào!",
  },
  {
    name: "Khôi Nguyên",
    age: 12,
    username: "@khoinguyen",
    avatar: "/images/home/feedback-boy.png",
    rating: 5,
    content:
      "Thầy cô ở Algoki siêu dễ thương, mỗi khi em hỏi là được giải đáp ngay. Em còn làm được cả dự án thực tế, làm xong khoe với ba mẹ luôn!",
  },
  {
    name: "Mai Chi",
    age: 11,
    username: "@maichi",
    avatar: "/images/home/feedback-girl.png",
    rating: 4,
    content:
      "Em đã thử vài chỗ khác rồi nhưng Algoki là đỉnh nhất. Lộ trình học Java rất rõ ràng, đi từ cơ bản đến nâng cao. Giờ em tự tin code được nhiều thứ hơn rồi.",
  },
  {
    name: "Bảo Nam",
    age: 13,
    username: "@baonam",
    avatar: "/images/home/feedback-boy.png",
    rating: 5,
    content:
      "Em rất thích cách các thầy cô hướng dẫn. Học mà như chơi, còn làm game Unity luôn. Giờ em muốn làm lập trình viên trong tương lai!",
  },
  {
    name: "Lan Phương",
    age: 9,
    username: "@lanphuong",
    avatar: "/images/home/feedback-girl.png",
    rating: 5,
    content:
      "Em mới học Scratch mà đã làm được cả trò chơi mèo nhảy rồi. Mỗi buổi học là một trải nghiệm mới lạ, cực kỳ vui!",
  },
  {
    name: "Minh Anh",
    age: 10,
    username: "@minhanh",
    avatar: "/images/home/feedback-girl.png",
    rating: 5,
    content:
      "Em thích Algoki lắm! Mấy bài học Java dễ hiểu kinh khủng, lại còn được tự tay code game nữa chứ. Giờ em thấy code không khó như em nghĩ tí nào!",
  },
  {
    name: "Khôi Nguyên",
    age: 12,
    username: "@khoinguyen",
    avatar: "/images/home/feedback-boy.png",
    rating: 5,
    content:
      "Thầy cô ở Algoki siêu dễ thương, mỗi khi em hỏi là được giải đáp ngay. Em còn làm được cả dự án thực tế, làm xong khoe với ba mẹ luôn!",
  },
  {
    name: "Mai Chi",
    age: 11,
    username: "@maichi",
    avatar: "/images/home/feedback-girl.png",
    rating: 4,
    content:
      "Em đã thử vài chỗ khác rồi nhưng Algoki là đỉnh nhất. Lộ trình học Java rất rõ ràng, đi từ cơ bản đến nâng cao. Giờ em tự tin code được nhiều thứ hơn rồi.",
  },
  {
    name: "Bảo Nam",
    age: 13,
    username: "@baonam",
    avatar: "/images/home/feedback-boy.png",
    rating: 5,
    content:
      "Em rất thích cách các thầy cô hướng dẫn. Học mà như chơi, còn làm game Unity luôn. Giờ em muốn làm lập trình viên trong tương lai!",
  },
  {
    name: "Lan Phương",
    age: 9,
    username: "@lanphuong",
    avatar: "/images/home/feedback-girl.png",
    rating: 5,
    content:
      "Em mới học Scratch mà đã làm được cả trò chơi mèo nhảy rồi. Mỗi buổi học là một trải nghiệm mới lạ, cực kỳ vui!",
  },
];

export default function HomepageFeedback() {
  return (
    <section className="bg-white mb-20 md:mb-[120px]">
      <div className="relative mx-auto text-center">
        <h2 className="text-2xl lg:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#6D5DFB] to-[#2CD4D9] text-transparent bg-clip-text">
            Học Viên của Chúng Tôi Nói Gì
          </span>
        </h2>
        <p className="text-base text-[#212B36] mb-16">
          Cùng lắng nghe những phản hồi tích cực từ học viên của chung tôi
        </p>
        <div className="relative">
          <div className="pointer-events-none absolute top-0 left-0 w-0 md:w-50 xl:w-100 h-full z-10 bg-gradient-to-r from-white to-transparent"></div>
          <div className="pointer-events-none absolute top-0 right-0 w-0 md:w-50 xl:w-100 h-full z-10 bg-gradient-to-l from-white to-transparent"></div>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            className="!pb-[50px]"
            breakpoints={{
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 3 },
              1536: { slidesPerView: 5 },
            }}
          >
            {feedbacks.map((fb, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-[#F4F6F8] p-6 md:p-8 rounded-2xl shadow-md text-left h-full max-w-xl mx-auto min-h-[300px] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <FaQuoteLeft
                      style={{ fill: "#C9E9FF" }}
                      className="text-3xl"
                    />
                    <div
                      style={{ color: "#facc15 !important" }}
                      className="custom-rate"
                    >
                      <Rate disabled defaultValue={fb.rating} />
                    </div>
                  </div>

                  <p className="text-[#161C24] text-base mb-6 leading-relaxed">
                    {fb.content}
                  </p>

                  {/* User info */}
                  <div className="flex items-center gap-3 mt-auto">
                    <Avatar src={fb.avatar} size={48} />
                    <div>
                      <p className="text-sm font-semibold">
                        {fb.name} ({fb.age} tuổi)
                      </p>
                      <p className="text-[#637381] text-xs">{fb.username}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
