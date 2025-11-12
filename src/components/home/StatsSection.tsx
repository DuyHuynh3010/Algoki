import React from "react";
import Image from "next/image";
import {Title} from "@/components/common/Title";

const stats = [
  {
    color: "#16A1FF",
    bg: "bg-[#E3F0FF]",
    border: "border-info-main",
    icon: "/images/home/img_11.png", // bạn thay icon phù hợp
    value: "100K+",
    label: "Learners completed",
  },
  {
    color: "#F57C00",
    bg: "bg-[#FFF3E0]",
    border: "border-secondary-main",
    icon: "/images/home/img_10.png",
    value: "26K+",
    label: "Courses & videos",
  },
  {
    color: "#C628A8",
    bg: "bg-[#FCE4EC]",
    border: "border-tertiary-main",
    icon: "/images/home/img_12.png",
    value: "60K+",
    label: "Certified learners",
  },
  {
    color: "#43A047",
    bg: "bg-[#E8F5E9]",
    border: "border-success",
    icon: "/images/home/img_13.png",
    value: "120K+",
    label: "Learners enrolled",
  },
];

export function StatsSection() {
  return (
   <div className="flex flex-col items-center">
     <Title
       label="Why learners choose us"
       title="Creating a community of lifelong learners"
       subTitle="Data-backed outcomes from the Algoki community"
     />
     <div className="w-full flex flex-col items-center py-16 relative">
       {/* Thanh nối với các chấm tròn */}
       <div className="hidden lg:flex relative w-full max-w-6xl flex-col items-center">
         <div className="w-full relative flex justify-between items-start" style={{ height: 48 }}>
           {/* Thanh ngang */}
           <div className="absolute left-0 right-0 top-3 h-0.5 bg-gradient-to-r from-[#919EAB3D] via-[#fff7ed] to-[#919EAB3D] z-0" />
           {/* Các chấm tròn */}
           {stats.map((_, idx) => (
             <div key={idx} className="flex flex-col items-center w-1/4 z-10">
               <div className="w-6 h-6 rounded-full border-4 border-[#16A1FF] bg-white flex items-center justify-center">
                 <div className="w-3 h-3 rounded-full bg-white" />
               </div>
               {/* Đường thẳng đứng */}
               <div className={`w-0.5 bg-gradient-to-b from-[#919EAB3D] via-[#fff7ed] to-[#919EAB3D] ${idx % 2 === 0 ? 'h-6' : 'h-20'}`} />
             </div>
           ))}
         </div>
         {/* Dãy box thống kê */}
         <div className="flex justify-center gap-12 w-full">
           {stats.map((item, idx) => (
             <div
               key={idx}
               className={`flex flex-col box-shadow-card w-[240px] h-[260px] items-center justify-end rounded-2xl border-b-4 ${item.border} bg-white shadow-md px-8 py-6 relative overflow-hidden ${idx % 2 === 0 ? 'mt-1' : 'mt-14'}`}
             >
               {/*<div className={`absolute -top-8 left-1/2 -translate-x-1/2 rounded-full ${item.bg} flex items-center justify-center w-20 h-20 shadow-md`}>*/}
               {/*  <Image src={item.icon} alt="icon" width={48} height={48} />*/}
               {/*</div>*/}
               <div className="absolute top-[-30px]">
                 <Image src={item.icon} alt="icon" width={200} height={130} />
               </div>

               <div className="mt-14 text-3xl font-bold">{item.value}</div>
               <div className="mt-2 text-base text-gray-700 text-center">{item.label}</div>
             </div>
           ))}
         </div>
       </div>

       {/*Moblie*/}
       <div className="lg:hidden flex flex-col gap-6">
         {stats.map((item, idx) => (
           <div key={idx} className=" flex flex-col items-center w-full gap-1">
             <div className="flex items-center gap-1 w-full">
               <div className="h-0.5 bg-gradient-to-r from-[#919EAB3D] via-[#fff7ed] to-[#919EAB3D] flex-1"></div>
               <div className="w-6 h-6 rounded-full border-4 border-[#16A1FF] bg-white flex items-center justify-center">
                 <div className="w-3 h-3 rounded-full bg-white" />
               </div>
               <div className="h-0.5 bg-gradient-to-r from-[#919EAB3D] via-[#fff7ed] to-[#919EAB3D] flex-1"></div>
             </div>
             <div className="w-0.5 bg-gradient-to-b from-[#919EAB3D] via-[#fff7ed] to-[#919EAB3D] h-1"></div>
             <div
               key={idx}
               className={`flex flex-col box-shadow-card w-[240px] h-[260px] items-center justify-end rounded-2xl border-b-4 ${item.border} bg-white shadow-md px-8 py-6 relative overflow-hidden`}
             >
               {/*<div className={`absolute -top-8 left-1/2 -translate-x-1/2 rounded-full ${item.bg} flex items-center justify-center w-20 h-20 shadow-md`}>*/}
               {/*  <Image src={item.icon} alt="icon" width={48} height={48} />*/}
               {/*</div>*/}
               <div className="absolute top-[-30px]">
                 <Image src={item.icon} alt="icon" width={200} height={130} />
               </div>

               <div className="mt-14 text-3xl font-bold">{item.value}</div>
               <div className="mt-2 text-base text-gray-700 text-center">{item.label}</div>
             </div>
           </div>
         ))}
       </div>
     </div>

   </div>
    );
}

export default StatsSection;
