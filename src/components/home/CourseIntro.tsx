import { Button } from "@/components/ui/button";
import { ArrowDown } from "iconsax-react";
import React from "react";

export function CourseIntro() {
  return (
    <div className="lg:mt-20 lg:w-3/4 relative flex flex-col items-center justify-center pt-20">
      <div className="absolute lg:flex hidden top-0 justify-center items-center z-0 pointer-events-none">
        <div className=" text-[460px] leading-[400px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-secondary-main opacity-20">
          26K
        </div>
      </div>
      <div className="relative z-10 lg:leading-16 bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent w-fit text-3xl leading-11 lg:text-5xl font-bold text-center gap-4">
        Exceptional courses led by <br/>
        top instructors
      </div>
      <div className="leading-9 font-bold lg:text-2xl text-xl text-center pt-4 lg:pt-0">
        <b>Every day of learning is a small step closer to your goals.</b>
        <span className="text-secondary">Knowledge isn&apos;t just a grade—it&apos;s the key that opens future opportunities.</span>
      </div>
      <div className="text-center pt-4 lg:pt-0">
        You don&apos;t need to be great from the start—just brave enough to begin. Keep learning, <br/>
        and you&apos;ll be amazed at how far you go!
      </div>
      <Button className="mt-8 lg:mt-20 rounded-full w-12 h-12 bg-tertiary-main/8 flex justify-center items-center">
        <ArrowDown
          size="24"
          color="#D14EA8"
        />
      </Button>
    </div>
  )
}