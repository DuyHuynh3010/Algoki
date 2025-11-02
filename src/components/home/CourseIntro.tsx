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
        Khóa học tuyệt vời cùng với những <br/>
        Giảng viên hàng đầu
      </div>
      <div className="leading-9 font-bold lg:text-2xl text-xl text-center pt-4 lg:pt-0">
        <b>Mỗi ngày học là một bước nhỏ giúp bạn tiến gần hơn đến ước mơ.</b>
        <span className="text-secondary">Kiến thức không chỉ là điểm số, mà là chìa khóa mở cánh cửa tương lai.</span>
      </div>
      <div className="text-center pt-4 lg:pt-0">
        Bạn không cần phải giỏi ngay từ đầu – chỉ cần đủ dũng cảm để bắt đầu. Học hỏi từng chút, <br/>
        bạn sẽ ngạc nhiên với chính mình đấy!
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