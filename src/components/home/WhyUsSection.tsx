"use client";

import { ArrowRight } from "iconsax-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Routes} from "@/lib/routes/routes";

export function WhyUsSection() {
  const router = useRouter();

  const navigateToTeacher = () => {
    router.push(Routes.instructors);
  };

  return (
    <div>
      <div className="flex gap-4 lg:gap-8 lg:flex-row flex-col">
        <div className="text-3xl leading-11 text-center lg:text-start lg:text-5xl lg:leading-16 font-bold">
          Why is Algoki different from other platforms?
        </div>
        <div className="flex flex-col items-center lg:items-start lg:justify-between py-3">
          <div className="text-secondary text-center lg:text-start">
            We bring professional instructors and richer features than any other platform.
          </div>
          <button className="mt-4 font-bold justify-self-center lg:justify-self-end text-primary-main w-fit flex items-center gap-2">
            Learn more about us <ArrowRight size={20} color="#16A1FF" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 lg:gap-8 mt-12">

        <div className="lg:col-span-2 rounded-2xl">
          <Image src="/images/home/img_6.png" alt="HS" width={400} height={400} />
        </div>

        <div className="lg:col-span-4 rounded-2xl px-10 py-8 bg-primary-main/8 flex flex-col">
          <div className="text-primary-main font-bold text-3xl">Learn from anywhere</div>
          <div className="mt-2 flex-1">Online education has become more essential than ever, thanks to technology and growing internet access.</div>
          <Button variant="default" className="mt-5 w-fit text-warning-dark bg-warning-dark/16 h-9 hover:bg-warning-dark/32 rounded-[10px]">
            Explore now <ArrowRight size={20} color="#F57C00" />
          </Button>
        </div>

        <div className="lg:col-span-2 rounded-2xl relative lg:overflow-hidden">
          <Image
            src="/images/home/img_7.png" // thay bằng đúng path ảnh của bạn
            alt="Giảng viên"
            width={500}
            height={400}
            className="object-cover"
          />
          <div className="absolute inset-0 p-8 text-[#FFFFFF] flex flex-col justify-between">
            <h3 className="text-4xl font-bold leading-12 text-[#FFFFFF]">
              Experienced <br /> instructors
            </h3>
            <Button onClick={navigateToTeacher} className="h-9 text-[#FFFFFF] w-fit bg-white/12 hover:bg-white/20 rounded-[10px]">
              Meet them <ArrowRight size={20} color="white" />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl lg:overflow-hidden relative min-h-[400px] lg:min-h-auto">
          <Image
            src="/images/home/img_8.png" // thay bằng đúng path ảnh của bạn
            alt="Giảng viên"
            fill
            className="object-cover w-full h-full rounded-2xl"
          />
          <div className="absolute inset-0 p-8 text-[#FFFFFF] flex flex-col justify-between">
            <h3 className="text-4xl font-bold leading-12 text-[#FFFFFF]">
              Flexible classes
            </h3>
            <div className="mt-2 lg:flex-1 text-[#FFFFFF]">
              Online learning is more popular than ever, giving you the freedom to study whenever and wherever you choose.
            </div>
            <Button className="h-9 mt-5 text-[#FFFFFF] w-fit bg-white/12 hover:bg-white/20">
              Discover more <ArrowRight size={20} color="white" />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl">
          <Image
            src="/images/home/img_9.png" // thay bằng đúng path ảnh của bạn
            alt="Giảng viên"
            width={1000}
            height={300}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}