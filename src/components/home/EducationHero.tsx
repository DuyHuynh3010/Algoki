"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Row, Col } from "antd";
import React from "react";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes/routes";

export function EducationHero() {
  const router = useRouter();
  const handleNavigateToLogin = () => {
    router.push(Routes.login);
  };
  return (
    <section className="bg-white mb-20 md:mb-[120px]">
      <div className="w-full mx-auto px-5 md:px-10 max-w-[1280px]">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={12}>
            <div className="w-full flex justify-center">
              <Image
                src="/images/home/student-boy.png"
                alt="Student"
                width={500}
                height={600}
                className="w-full max-w-md object-contain rounded-[40px]"
              />
            </div>
          </Col>

          {/* Right Side - Text */}
          <Col xs={24} lg={12}>
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-3xl lg:text-5xl font-semibold text-[#0E0F1C] leading-tight">
                The Learning Platform <br />
                Built For Your <br />
                Successful Future
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-md mx-auto lg:mx-0">
                Get ready for real tech challenges, review key Java concepts efficiently, and receive instant feedback on your progress.
              </p>
              <Button
                onClick={handleNavigateToLogin}
                className="bg-[#16A1FF] text-white px-6 py-2 rounded-full font-semibold text-sm shadow-md"
              >
                Start for free
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
