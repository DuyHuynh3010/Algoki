import React from "react";
import Image from "next/image";
import { TEACHER_LIST } from "@/contants/instructor";
import { clsx } from "clsx";
import { HeaderSection } from "@/components/common/HeaderSection";

function InstructorListPage() {
  return (
    <div>
      <HeaderSection
        title="Instructors"
        label="Home"
        subLabel="Instructors"
      />
      <div className="bg-gradient-to-br from-primary-light  to-primary-main">
        <div className="py-12 lg:py-32 px-6 md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto w-full flex flex-col items-center justify-center h-full">
          <div className="font-semibold text-[#FFFFFF] text-lg">
            Our instructors
          </div>
          <div className="mt-2 font-bold text-center lg:text-start text-[#FFFFFF] text-2xl leading-9 lg:text-3xl lg:leading-12">
            A team of dedicated professionals
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-12 lg:grid-rows-5 gap-8 mt-10">
            {TEACHER_LIST.map((item, idx) => (
              <div
                key={idx}
                className={clsx(
                  "p-2.5 bg-white/16 rounded-2xl",
                  item.containerClass,
                )}
              >
                <Image
                  className="w-full h-full rounded-2xl"
                  src={item.images}
                  alt=""
                  width={250}
                  height={350}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorListPage;
