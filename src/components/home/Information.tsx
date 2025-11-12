"use client";

import { Row, Col } from "antd";
import React from "react";

export function Information() {
  return (
    <section className="bg-default mt-20 lg:mt-[120px] mb-20 md:mb-[120px]">
      <div className="w-full mx-auto px-5 md:px-10 max-w-[1280px]">
        <div className="text-center lg:text-left mb-16 space-y-2">
          <h2 className="text-2xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#6D5DFB] to-[#2CD4D9] text-transparent bg-clip-text">
              Everything You Need
            </span>
          </h2>
          <h3 className="text-2xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#6D5DFB] to-[#2CD4D9] text-transparent bg-clip-text mb-4">
            Is right here
          </h3>
          <p className="text-white max-w-2xl mt-4">
            At Algoki, we believe learning Java should be simple and comprehensive. That’s why we’ve bundled everything you need to become a Java pro into one kid-friendly platform.
          </p>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="bg-[#919EAB1F] rounded-2xl p-6 space-y-2 shadow-sm h-full">
              <span className="inline-block px-3 py-1 text-xs bg-[#212B36] text-white font-semibold rounded-lg w-fit">
                Algoki
              </span>
              <h4 className="text-lg font-bold text-white">
                A complete Java roadmap
              </h4>
              <p className="text-base text-white">
                From foundational concepts like variables and loops to more advanced structures.
              </p>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="bg-[#212B36] rounded-2xl p-6 space-y-2 shadow-sm h-full">
              <span className="inline-block px-3 py-1 text-xs bg-gradient-to-r from-[#2C8DFF] to-[#C06CFF] text-white font-semibold rounded-lg w-fit">
                Algoki
              </span>
              <h4 className="text-lg font-bold text-white">
                Hands-on practice
              </h4>
              <p className="text-base text-white">
                You won’t just study theory! Algoki provides an interactive coding environment with hundreds of exercises from easy to challenging so you can master your skills.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
