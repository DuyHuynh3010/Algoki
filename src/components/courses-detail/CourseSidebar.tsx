import React, { useState } from "react";
import Image from "next/image";
import { ArrowDown2, ArrowUp2, Backward5Seconds } from "iconsax-react";
import { formatToHourUnit } from "@/until";

interface CourseSidebarProps {
  courseDetail: {
    id: string;
    thumbnail: string;
    category: { title: string };
    title: string;
    ratingAvg?: number;
    ratingCnt: number;
    enrollmentCnt: number;
    discountedPrice?: number;
    regularPrice: number;
    duration?: number;
    totalLessons?: number;
    certification?: boolean;
    totalCompletedLessons?: number;
    language?: string;
    isFree?: boolean;
  };
  onCheckoutCourse: () => void;
  handlePushToCart: () => void;
  handleLearn: () => void;
  enrolled: boolean;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseDetail,
  onCheckoutCourse,
  handlePushToCart,
  enrolled = false,
  handleLearn,
}) => {
  const [showMoreCardProduct, setShowMoreCardProduct] = useState(false);

  return (
    <div className="lg:w-1/4 block md:fixed right-[5%] top-[10%] h-[90vh] overflow-y-auto">
      <div className="bg-paper rounded-lg shadow-lg p-6">
        <div className="w-full h-[250px] relative rounded-lg overflow-hidden mb-8">
          <Image
            src={courseDetail.thumbnail}
            alt={courseDetail.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="text-[#16A1FF] font-semibold mb-1">
          {courseDetail.category.title}
        </div>
        <h2 className="text-xl font-bold mb-4">{courseDetail.title}</h2>

        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-secondary">
              {courseDetail.ratingAvg || 0}
            </span>
            <span className="ml-1 text-secondary">
              ({courseDetail.ratingCnt})
            </span>
          </div>
          <div className="mx-3 text-gray-300">|</div>
          <div className="text-secondary">
            {courseDetail.enrollmentCnt} students
          </div>
        </div>
        {(courseDetail.discountedPrice === 0 &&
        courseDetail.regularPrice === 0) || courseDetail.isFree ? (
          <div className="text-2xl font-bold text-[#2F57EF] mb-6">Free</div>
        ) : (
          <div className="flex items-center mb-6">
            <div className="text-2xl font-bold text-[#16A1FF]">
              {(
                courseDetail.discountedPrice || courseDetail.regularPrice
              ).toLocaleString()}
              đ
            </div>
            {courseDetail.discountedPrice && (
              <div className="ml-2 text-secondary line-through text-sm">
                {courseDetail.regularPrice.toLocaleString()}đ
              </div>
            )}
          </div>
        )}

        {enrolled ? (
          <>
            <button
              onClick={handleLearn}
              className="bg-[#16A1FF] text-white w-full py-3 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
            >
              Start learning
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handlePushToCart}
              className="bg-[#16A1FF] text-white w-full py-3 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
            >
              Add to cart
            </button>
            <button
              onClick={onCheckoutCourse}
              className="border border-[#919EAB52] mt-2 text-primary w-full py-3 rounded-lg font-bold hover:bg-blue-700 hover:text-white transition cursor-pointer"
            >
              Buy now
            </button>
            <div className="flex gap-2 justify-center text-secondary mt-2 text-sm items-center">
              <Backward5Seconds size="24" color="#637381" />
              30-day money-back guarantee
            </div>
          </>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
            <div className="text-secondary font-semibold">Duration</div>
            <div className="bg-[#919EAB29] px-2 rounded">
              <span className="text-xs text-secondary font-semibold">
                {courseDetail?.duration
                  ? formatToHourUnit(courseDetail.duration)
                  : "0"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
            <div className="text-secondary font-semibold">Enrolled</div>
            <div className="bg-[#919EAB29] px-2 rounded">
              <span className="text-xs text-secondary font-semibold">100</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
            <div className="text-secondary font-semibold">Lessons</div>
            <div className="bg-[#919EAB29] px-2 rounded">
              <span className="text-xs text-secondary font-semibold">
                {courseDetail?.totalLessons}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
            <div className="text-secondary font-semibold">Level</div>
            <div className="bg-[#919EAB29] px-2 rounded">
              <span className="text-xs text-secondary font-semibold">
                Beginner
              </span>
            </div>
          </div>

          {showMoreCardProduct && (
            <>
              <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
                <div className="text-secondary font-semibold">Language</div>
                <div className="bg-[#919EAB29] px-2 rounded">
                  <span className="text-xs text-secondary font-semibold">
                    {courseDetail?.language || "Vietnamese"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
                <div className="text-secondary font-semibold">Quizzes</div>
                <div className="bg-[#919EAB29] px-2 rounded">
                  <span className="text-xs text-secondary font-semibold">
                    {courseDetail?.totalLessons}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
                <div className="text-secondary font-semibold">Certificate</div>
                <div className="bg-[#919EAB29] px-2 rounded">
                  <span className="text-xs text-secondary font-semibold">
                    {courseDetail?.certification ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
                <div className="text-secondary font-semibold">Completed</div>
                <div className="bg-[#919EAB29] px-2 rounded">
                  <span className="text-xs text-secondary font-semibold">
                    {courseDetail?.totalCompletedLessons}
                  </span>
                </div>
              </div>
            </>
          )}
          <button
            onClick={() => setShowMoreCardProduct(!showMoreCardProduct)}
            className="text-[#16A1FF] flex items-center gap-2 mt-4 font-medium"
          >
            {!showMoreCardProduct ? "Show more" : "Show less"}
            {!showMoreCardProduct ? (
              <ArrowDown2 size="20" color="#16A1FF" />
            ) : (
              <ArrowUp2 size="20" color="#16A1FF" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
