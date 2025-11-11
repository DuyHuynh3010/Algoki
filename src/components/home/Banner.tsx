"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes/routes";
import React from "react";

export function Banner() {
  const router = useRouter();

  const handleNavigateToCourse = () => {
    router.push(Routes.courses);
  };

  const handleNavigateToLogin = () => {
    router.push(Routes.login);
  };

  return (
    <section
      className="relative mt-20 w-full bg-top bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/images/home/banner.png')" }}
    >
      <div className="w-full mx-auto px-5 md:px-10 max-w-[1280px] pt-16 pb-10 text-center">
        <div className="bg-cover bg-center py-20 px-4">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#0E0F1C] leading-tight max-w-4xl mx-auto">
            Love coding? <br />
            Imagine having Algoki by your side for every line of code.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base md:text-lg text-[#212B36] max-w-3xl mx-auto">
            Turn your code into production-ready, readable solutions that everyone understands. Explore the Algoki platform today and accelerate your learning journey.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={handleNavigateToLogin}
              className="bg-[#16A1FF] px-6 h-10 rounded-full text-white font-semibold transition-colors duration-300 hover:!bg-[#0f8ae0]"
            >
              Get started
            </Button>

            <Button
              onClick={handleNavigateToCourse}
              variant="outline"
              className="h-10 px-6 rounded-full border border-[#16A1FF] text-[#16A1FF] font-semibold transition-all duration-300 hover:!bg-[#16A1FF] hover:!text-white"
            >
              Browse courses
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <Image
            src="/images/home/code-screen-1.png"
            alt="Code preview"
            width={1000}
            height={630}
            className="mx-auto rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
