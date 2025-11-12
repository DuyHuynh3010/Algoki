"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

export default function NewsletterSection() {

  const onSubmit = () => {
    console.log("Form submitted---");
  }

  return (
    <section className="relative bg-primary-main bg-blend-overlay bg-cover bg-center text-[#FFFFFF] py-20 px-4">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/about/img_3.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      ></div>

      <div className="relative z-20 md:max-w-3xl text-[#FFFFFF] max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto w-full text-center">
        <div className="text-lg text-[#FFFFFF] mb-2 font-bold">Stay in the loop</div>
        <div className="text-3xl leading-10 lg:text-5xl font-bold mb-2 text-[#FFFFFF] lg:leading-16">
          Subscribe to our newsletter<br />
          and never miss an update
        </div>
        <p className="text-[#FFFFFF] mb-8">
          Get exclusive offers and the latest updates every week!
        </p>

        <div className="lg:bg-white bg-transparent rounded-xl lg:w-fit p-2 flex flex-col md:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="e.g. algoki@gmail.com"
            className="w-full md:w-[350px] px-4 py-3 rounded-lg bg-white text-primary-contrastText placeholder-gray-400 focus:outline-none"
          />
          <Button
            type="submit"
            onClick={onSubmit}
            className="lg:w-fit w-full bg-secondary-main hover:bg-secondary-light text-primary-contrastText font-semibold px-6 py-2 rounded-lg whitespace-nowrap flex items-center gap-2"
          >
            Subscribe
            <ArrowRight size="24" color="#212B36" />
          </Button>
        </div>

        <p className="text-[#FFFFFF] mt-4 font-bold">
          No ads, no trials, no commitments
        </p>

        <div className="flex flex-col lg:flex-row justify-center gap-12 mt-12 text-center items-center lg:items-stretch h-full">
          <div>
            <div className="text-[#FFFFFF] text-5xl font-bold">100+</div>
            <div className="text-[#FFFFFF] font-semibold text-xl my-2">Successful learners</div>
            <div className="text-base text-[#FFFFFF]">Learners completed</div>
          </div>
          <div className="h-[1px] w-2/3 lg:w-[1px] lg:self-stretch bg-white/32"></div>
          <div className="text-[#FFFFFF]">
            <div className="text-[#FFFFFF] text-5xl font-bold">60K+</div>
            <div className="text-[#FFFFFF] font-semibold text-xl my-2">Active learners</div>
            <div className="text-[#FFFFFF] text-base ">Online courses</div>
          </div>
        </div>
      </div>
    </section>
  );
}
