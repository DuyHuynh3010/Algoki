"use client";

import Image from "next/image";
import { Row, Col } from "antd";
import React from "react";

export function Explore() {
  return (
    <section className="bg-default mb-20 md:mb-[120px]">
      <div className="w-full mx-auto px-5 md:px-10 max-w-[1280px]">
        <div className="text-center lg:text-left mb-16 space-y-2">
          <h2 className="text-2xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#6D5DFB] to-[#2CD4D9] text-transparent bg-clip-text">
              Explore The World Of Coding
            </span>
          </h2>
          <h3 className="text-2xl lg:text-5xl bg-gradient-to-r from-[#6D5DFB] to-[#2CD4D9] text-transparent font-extrabold bg-clip-text mb-4">
            With Algoki!
          </h3>
          <p className="max-w-2xl mt-4">
            We don&apos;t just teach you to code—we help you think like a developer, solve problems, and create without limits.
          </p>
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <div className="bg-neutural-12 border border-neutural-16 rounded-2xl p-8 space-y-4 shadow-sm h-full">
              <h4 className="text-3xl font-bold text-white">
                Start From Zero, Become A Code Hero
              </h4>
              <p className="text-base text-secondary mb-10">
                Algoki&apos;s learning paths are designed to take you from foundational concepts to building complex applications.
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
            <div className="bg-neutural-12 border border-neutural-16 rounded-2xl p-8 space-y-4 shadow-sm h-full">
              <Image
                src="/images/home/code-screen-3.png"
                alt="Java Code Example 2"
                width={600}
                height={300}
                className="w-full rounded-xl shadow-md mb-10"
              />
              <h4 className="text-3xl font-bold text-white">
                Learn Through Real Projects That Feel Like Play
              </h4>
              <p className="text-base text-secondary">
                At Algoki, you&apos;ll tackle real-world coding projects—from building fun games to crafting unique applications.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
