import React from "react";
import IconClock from "../../../public/icons/IconClock";
import IconPrize from "../../../public/icons/IconPrize";
import IconUser from "../../../public/icons/IconUser";
import he from "he";
import './index.css'

interface CourseHeaderProps {
  courseDetail: {
    category: { title: string };
    title: string;
    description: string;
    label?: string;
    ratingAvg?: number;
    ratingCnt: number;
    enrollmentCnt: number;
    owner: { fullName: string };
    updatedAt: string;
    shortDescription: string;
  };
  reviewSummaryData?: any
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ courseDetail, reviewSummaryData }) => {
  return (
    <div className="header-container-detail w-full py-12 md:py-20 md:mt-20 h-max">
      <div className="container mx-auto px-4 py-8 h-full flex flex-col justify-end w-full">
        <div className="text-[#16A1FF] mb-2 md:w-[50%] w-full">
          {courseDetail.category.title}
        </div>
        <div className="text-4xl font-bold text-white mb-4 md:w-[50%] w-full">
          {courseDetail.title}
        </div>
        <p className="text-gray-600 mb-2 md:w-[60%] w-full">
          {courseDetail.shortDescription && (
            <div
              dangerouslySetInnerHTML={{ __html: he.decode(courseDetail.shortDescription) }}
            />
          )}
        </p>
        <div className="my-4 flex flex-wrap items-center gap-4">
          <div className="mt-2 w-max flex items-center gap-2 md:mt-0 font-light text-[#FBABFE] border bg-[#4E035F] border-white px-4 py-2 rounded-full">
            <IconPrize /> {courseDetail.label || "Bestseller"}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xl md:text-2xl font-medium text-[#FFB145]">
                {reviewSummaryData?.averageRating || 0}
              </span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => {
                  const rating = reviewSummaryData?.averageRating || 0;
                  if (index + 1 <= Math.floor(rating)) {
                    // Sao vàng đầy
                    return (
                      <span key={index} className="text-[#FFB145] text-xl md:text-2xl">★</span>
                    );
                  } else if (
                    index < rating &&
                    rating < index + 1 &&
                    rating % 1 >= 0.5
                  ) {
                    // Sao nửa vàng (có thể thay bằng biểu tượng riêng nếu muốn)
                    return (
                      <span key={index} className="text-[#FFB145] text-xl md:text-2xl">★</span>
                    );
                  } else {
                    // Sao xám
                    return (
                      <span key={index} className="text-[#D9D9D9] text-xl md:text-2xl">★</span>
                    );
                  }
                })}
              </div>
            </div>
            <span className="text-secondary bg-[#F4F6F8] text-sm md:text-base px-3 py-1 rounded-md whitespace-nowrap">
              {reviewSummaryData?.totalCount} reviews
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconUser />
            <span className="text-sm text-secondary">
              {courseDetail.enrollmentCnt} learners
            </span>
          </div>
        </div>
        <div className="text-secondary text-sm mb-2">
          Instructor: {courseDetail.owner.fullName}
        </div>
        <div className="flex items-center gap-2">
          <IconClock />
          <div className="text-secondary text-sm">
            Last updated{" "}
            {new Date(courseDetail.updatedAt).toLocaleDateString("en-GB")}
          </div>
        </div>
      </div>
    </div>
  );
}; 