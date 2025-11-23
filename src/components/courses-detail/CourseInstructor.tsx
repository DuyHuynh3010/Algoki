import React, { useState } from "react";
import Image from "next/image";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import IconUser from "../../../public/icons/IconUser";
import IconVideo from "../../../public/icons/IconVideo";

interface CourseInstructorProps {
  courseDetail: {
    owner: {
      fullName: string;
    };
  };
  instructorProfileData?: {
    data?: {
      totalReviews?: string;
      ratingAverage?: string;
      bio?: string;
      skill?: string;
      totalCourses?: number;
      totalStudents?: number;
      avatarUrl?: string;
    };
  };
}

export const CourseInstructor: React.FC<CourseInstructorProps> = ({
  courseDetail,
  instructorProfileData,
}) => {
  const [showFullBio, setShowFullBio] = useState(false);

  return (
    <div className="bg-paper p-6 rounded-lg mb-8">
      <h3 className="text-xl font-bold mb-6">Instructor</h3>
      <div className="flex flex-col">
        <div className="flex gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden relative">
            <Image
              src={instructorProfileData?.data?.avatarUrl || "/images/banner-sign-in.jpg"}
              alt={courseDetail.owner.fullName}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-full"
            />
          </div>
          <div>
            <h4 className="font-bold text-lg">
              {courseDetail?.owner?.fullName}
            </h4>
            <p className="text-secondary mb-2">
              {instructorProfileData?.data?.skill || "Instructor"}
            </p>
            <div className="flex flex-wrap gap-4 items-center mt-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-secondary">
                  {instructorProfileData?.data?.totalReviews} reviews
                </span>
              </div>
              <div className="bg-[#919EAB29] p-1 rounded">
                <span className="text-sm text-secondary font-semibold">
                  {instructorProfileData?.data?.ratingAverage} ratings
                </span>
              </div>

              <div className="flex items-center gap-1">
                <IconUser />
                <span className="text-sm text-secondary">
                  {instructorProfileData?.data?.totalStudents} learners
                </span>
              </div>
              <div className="flex items-center gap-1">
                <IconVideo />
                <span className="text-sm text-secondary">
                  {instructorProfileData?.data?.totalCourses} courses
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-4 ${!showFullBio ? "line-clamp-3" : ""}`}>
          <p className="text-secondary">{instructorProfileData?.data?.bio}</p>
        </div>

        {instructorProfileData?.data?.bio && (
          <button
            onClick={() => setShowFullBio(!showFullBio)}
            className="text-[#16A1FF] flex items-center gap-2 mt-4 font-medium"
          >
            {showFullBio ? "Show less" : "Show more"}
            {!showFullBio ? (
              <ArrowDown2 size="20" color="#16A1FF" />
            ) : (
              <ArrowUp2 size="20" color="#16A1FF" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
