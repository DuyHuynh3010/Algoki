"use client";

import Image from "next/image";
import { Row, Col } from "antd";
import React from "react";

export function FeaturesOverview() {
  return (
    <section className="bg-white mb-20 md:mb-[120px]">
      <div className="w-full mx-auto px-5 md:px-10 max-w-[1280px]">
        <div className="text-center lg:text-left max-w-4xl mb-16">
          <h2 className="text-2xl md:text-4xl font-semibold text-[#0E0F1C] leading-snug mb-4">
            Algoki cung cấp cho bạn nền <br className="hidden md:block" />
            tảng và kiến thức bạn cần để <br className="hidden md:block" />
            thành công.
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Chúng tôi không chỉ dạy bạn cách viết code, mà còn giúp bạn hiểu sâu
            sắc về cách tư duy như một lập trình viên, giải quyết vấn đề và sáng
            tạo không giới hạn.
          </p>
        </div>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={8}>
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center h-full">
              <Image
                src="/images/home/video-library.png"
                alt="Video Library"
                width={200}
                height={200}
                className="mx-auto mb-4"
              />
              <h4 className="text-2xl font-semibold text-[#212B36] mb-4">
                Thư Viện Video
              </h4>
              <p className="text-base text-[#212B36]">
                Hàng ngàn video phong phú. Học theo tốc độ của riêng bạn.
              </p>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="bg-gradient-to-br from-[#edf4ff] to-[#f7f5ff] rounded-2xl shadow-md p-8 text-center h-full flex flex-col justify-center min-h-[336px]">
              <p className="text-[#212B36] font-bold text-2xl leading-relaxed mb-4">
                Algoki cung cấp cho bạn nền tảng và kiến thức bạn cần để thành
                công.
              </p>
              <div className="flex justify-center gap-2 mb-2">
                <span className="h-6 w-6 border border-gray-400 rounded-full"></span>
                <span className="h-6 w-6 border border-gray-400 rounded-full"></span>
                <span className="h-6 w-6 border border-gray-400 rounded-full"></span>
                <span className="h-6 w-6 border border-gray-400 rounded-full"></span>
                <span className="h-6 w-6 border border-gray-400 rounded-full"></span>
              </div>
              <span className="text-base text-[#212B36]">Algoki</span>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center h-full">
              <Image
                src="/images/home/assistant.png"
                alt="Assistant"
                width={200}
                height={200}
                className="mx-auto mb-4"
              />
              <h4 className="text-2xl font-semibold text-[#212B36] mb-4">
                Trợ giảng
              </h4>
              <p className="text-base text-[#212B36]">
                Đội ngũ giáo viên giàu kinh nghiệm và cộng đồng học viên năng
                động.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
