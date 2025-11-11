"use client";

import Image from "next/image";
import { Row, Col } from "antd";
import React from "react";

export function FeaturesOverview() {
  return (
    <section className="bg-default mb-20 md:mb-[120px]">
      <div className="w-full mx-auto px-5 md:px-10 max-w-[1280px]">
        <div className="text-center lg:text-left max-w-4xl mb-16">
          <h2 className="text-2xl md:text-4xl font-semibold text-white leading-snug mb-4">
            Algoki gives you the platform <br className="hidden md:block" />
            and knowledge you need <br className="hidden md:block" />
            to succeed.
          </h2>
          <p className="text-secondary text-sm md:text-base">
            We don&apos;t just teach you how to write code—we help you think like a developer, solve real problems, and create without limits.
          </p>
        </div>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={8}>
            <div className="bg-neutural-12 rounded-2xl shadow-sm p-6 text-center h-full">
              <Image
                src="/images/home/video-library.png"
                alt="Video Library"
                width={200}
                height={200}
                className="mx-auto mb-4"
              />
              <h4 className="text-2xl font-semibold text-white mb-4">
                Video library
              </h4>
              <p className="text-base text-white">
                Thousands of rich videos so you can learn at your own pace.
              </p>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="bg-neutural-12 rounded-2xl shadow-md p-8 text-center h-full flex flex-col justify-center min-h-[336px]">
              <p className="text-white font-bold text-2xl leading-relaxed mb-4">
                Algoki provides the platform and knowledge you need to succeed.
              </p>
              <div className="flex justify-center gap-2 mb-2">
                <span className="h-6 w-6 border border-white rounded-full"></span>
                <span className="h-6 w-6 border border-white rounded-full"></span>
                <span className="h-6 w-6 border border-white rounded-full"></span>
                <span className="h-6 w-6 border border-white rounded-full"></span>
                <span className="h-6 w-6 border border-white rounded-full"></span>
              </div>
              <span className="text-base text-white">Algoki</span>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="bg-neutural-12 rounded-2xl shadow-sm p-6 text-center h-full">
              <Image
                src="/images/home/assistant.png"
                alt="Assistant"
                width={200}
                height={200}
                className="mx-auto mb-4"
              />
              <h4 className="text-2xl font-semibold text-white mb-4">
                Teaching assistant
              </h4>
              <p className="text-base text-white">
                Experienced instructors and an energetic learner community.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
