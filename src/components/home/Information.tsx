"use client";

import { Row, Col } from "antd";
import React from "react";

export function Information() {
  return (
    <section className="bg-white mt-20 lg:mt-[120px] mb-20 md:mb-[120px]">
      <div className="w-full mx-auto px-5 md:px-10 max-w-[1280px]">
        <div className="text-center lg:text-left mb-16 space-y-2">
          <h2 className="text-2xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#6D5DFB] to-[#2CD4D9] text-transparent bg-clip-text">
              Tất Cả Những Gì Bạn Cần
            </span>
          </h2>
          <h3 className="text-2xl lg:text-5xl font-extrabold text-[#0E0F1C] mb-4">
            Đều có ở đây
          </h3>
          <p className="text-gray-600 max-w-2xl mt-4">
            Tại Algoki, chúng mình tin rằng việc học lập trình Java phải thật dễ
            dàng và toàn diện. Đó là lý do tại sao chúng mình đã gói gọn mọi thứ
            bạn cần để trở thành một &#34;cao thủ&#34; Java, tất cả chỉ trong
            một nền tảng duy nhất, thân thiện với các lập trình viên nhí.
          </p>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="bg-[#F7F8FA] rounded-2xl p-6 space-y-2 shadow-sm h-full">
              <span className="inline-block px-3 py-1 text-xs bg-[#DDE3EA] text-[#3F3F3F] font-semibold rounded-lg w-fit">
                Algoki
              </span>
              <h4 className="text-lg font-bold text-[#0E0F1C]">
                Lộ Trình Học Java Toàn Diện
              </h4>
              <p className="text-base text-gray-600">
                Từ những khái niệm cơ bản nhất như biến, vòng lặp đến các cấu
                trúc phức tạp hơn.
              </p>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="bg-gradient-to-br from-[#E3E8FF] to-[#F6F2FF] rounded-2xl p-6 space-y-2 shadow-sm h-full">
              <span className="inline-block px-3 py-1 text-xs bg-gradient-to-r from-[#2C8DFF] to-[#C06CFF] text-white font-semibold rounded-lg w-fit">
                Algoki
              </span>
              <h4 className="text-lg font-bold text-[#0E0F1C]">
                Thực Hành Trực Quan
              </h4>
              <p className="text-base text-gray-600">
                Bạn không chỉ học lý thuyết! Algoki cung cấp môi trường lập
                trình trực tuyến tiện lợi và hàng trăm bài tập thực hành từ dễ
                đến khó sẽ giúp bạn củng cố kiến thức và phát triển kỹ năng
                &#34;code&#34; của mình.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
