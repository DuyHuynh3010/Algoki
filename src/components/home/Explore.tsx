"use client";

import Image from "next/image";
import { Row, Col } from "antd";
import React from "react";

export function Explore() {
  return (
    <section className="bg-white mb-20 md:mb-[120px]">
      <div className="w-full mx-auto px-5 md:px-10 max-w-[1280px]">
        <div className="text-center lg:text-left mb-16 space-y-2">
          <h2 className="text-2xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#6D5DFB] to-[#2CD4D9] text-transparent bg-clip-text">
              Khám Phá Thế Giới Lập Trình
            </span>
          </h2>
          <h3 className="text-2xl lg:text-5xl font-extrabold text-[#0E0F1C] mb-4">
            Cùng Algoki!
          </h3>
          <p className="max-w-2xl mt-4">
            Chúng tôi không chỉ dạy bạn cách viết code, mà còn giúp bạn hiểu sâu
            sắc về cách tư duy như một lập trình viên, giải quyết vấn đề và sáng
            tạo không giới hạn.
          </p>
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <div className="bg-[#F7F8FA] rounded-2xl p-8 space-y-4 shadow-sm h-full">
              <h4 className="text-3xl font-bold text-[#0E0F1C]">
                Bắt Đầu Từ Số 0, Trở Thành Anh Hùng Code
              </h4>
              <p className="text-base text-gray-600 mb-10">
                Lộ trình học lập trình của Algoki được thiết kế để đưa bạn từ
                những khái niệm cơ bản nhất đến việc xây dựng các ứng dụng phức
                tạp.
              </p>
              <Image
                src="/images/home/code-screen-2.png"
                alt="Java Code Example"
                width={600}
                height={300}
                className="w-full rounded-xl shadow-md"
              />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="bg-[#F7F8FA] rounded-2xl p-8 space-y-4 shadow-sm h-full">
              <Image
                src="/images/home/code-screen-3.png"
                alt="Java Code Example 2"
                width={600}
                height={300}
                className="w-full rounded-xl shadow-md mb-10"
              />
              <h4 className="text-3xl font-bold text-[#0E0F1C]">
                Học Mà Chơi, Chơi Mà Học Với Dự Án Thực Tế
              </h4>
              <p className="text-base text-gray-600">
                Tại Algoki, bạn sẽ được thử sức với các dự án lập trình thực tế,
                từ việc tạo ra những trò chơi vui nhộn đến những chương trình
                thú vị và khác biệt.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
