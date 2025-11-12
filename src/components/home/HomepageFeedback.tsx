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
      "I love Algoki! The Java lessons are super easy to follow, and I even get to build my own games. Coding isn’t scary anymore!",
  },
  {
    name: "Khôi Nguyên",
    age: 12,
    username: "@khoinguyen",
    avatar: "/images/home/feedback-boy.png",
    rating: 5,
    content:
      "The instructors at Algoki are so helpful. Whenever I ask a question I get an answer instantly, and I even built a real project to show my parents!",
  },
  {
    name: "Mai Chi",
    age: 11,
    username: "@maichi",
    avatar: "/images/home/feedback-girl.png",
    rating: 4,
    content:
      "I tried a few places, but Algoki is the best. The Java roadmap is crystal clear, from basics to advanced, and I feel confident coding on my own now.",
  },
  {
    name: "Bảo Nam",
    age: 13,
    username: "@baonam",
    avatar: "/images/home/feedback-boy.png",
    rating: 5,
    content:
      "I love how the teachers guide us. Learning feels like playing, and I even built a Unity game. Now I want to be a developer in the future!",
  },
  {
    name: "Lan Phương",
    age: 9,
    username: "@lanphuong",
    avatar: "/images/home/feedback-girl.png",
    rating: 5,
    content:
      "I just started Scratch and already built a jumping cat game. Every lesson is a fun new adventure!",
  },
  {
    name: "Minh Anh",
    age: 10,
    username: "@minhanh",
    avatar: "/images/home/feedback-girl.png",
    rating: 5,
    content:
      "I love Algoki! The Java lessons are super easy to follow, and I even get to build my own games. Coding isn’t scary anymore!",
  },
  {
    name: "Khôi Nguyên",
    age: 12,
    username: "@khoinguyen",
    avatar: "/images/home/feedback-boy.png",
    rating: 5,
    content:
      "The instructors at Algoki are so helpful. Whenever I ask a question I get an answer instantly, and I even built a real project to show my parents!",
  },
  {
    name: "Mai Chi",
    age: 11,
    username: "@maichi",
    avatar: "/images/home/feedback-girl.png",
    rating: 4,
    content:
      "I tried a few places, but Algoki is the best. The Java roadmap is crystal clear, from basics to advanced, and I feel confident coding on my own now.",
  },
  {
    name: "Bảo Nam",
    age: 13,
    username: "@baonam",
    avatar: "/images/home/feedback-boy.png",
    rating: 5,
    content:
      "I love how the teachers guide us. Learning feels like playing, and I even built a Unity game. Now I want to be a developer in the future!",
  },
  {
    name: "Lan Phương",
    age: 9,
    username: "@lanphuong",
    avatar: "/images/home/feedback-girl.png",
    rating: 5,
    content:
      "I just started Scratch and already built a jumping cat game. Every lesson is a fun new adventure!",
  },
];

export default function HomepageFeedback() {
  return (
    <section className="bg-default mb-20 md:mb-[120px]">
      <div className="relative mx-auto text-center">
        <h2 className="text-2xl lg:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#6D5DFB] to-[#2CD4D9] text-transparent bg-clip-text">
            What Our Learners Are Saying
          </span>
        </h2>
        <p className="text-base text-[#212B36] mb-16">
          Hear the positive stories from learners who grow with Algoki.
        </p>
        <div className="relative">
          <div className="pointer-events-none absolute top-0 left-0 w-0 md:w-50 xl:w-100 h-full z-10 bg-gradient-to-r from-default to-transparent"></div>
          <div className="pointer-events-none absolute top-0 right-0 w-0 md:w-50 xl:w-100 h-full z-10 bg-gradient-to-l from-default to-transparent"></div>
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
                <div className="bg-neutural-12 p-6 md:p-8 rounded-2xl shadow-md text-left h-full max-w-xl mx-auto min-h-[300px] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <FaQuoteLeft
                      style={{ fill: "#0B5180" }}
                      className="text-3xl"
                    />
                    <div
                      style={{ color: "#facc15 !important" }}
                      className="custom-rate"
                    >
                      <Rate disabled defaultValue={fb.rating} />
                    </div>
                  </div>

                  <p className="text-white text-base mb-6 leading-relaxed">
                    {fb.content}
                  </p>

                  {/* User info */}
                  <div className="flex items-center gap-3 mt-auto">
                    <Avatar src={fb.avatar} size={48} />
                    <div>
                      <p className="text-sm font-semibold">
                        {fb.name} ({fb.age} years old)
                      </p>
                      <p className="text-secondary text-xs">{fb.username}</p>
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
