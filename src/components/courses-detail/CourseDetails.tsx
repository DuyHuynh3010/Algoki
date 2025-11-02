import React from "react";
import he from "he";

interface CourseDetailsProps {
  courseDetail: {
    requirements?: string;
    description: string;
    learningOutcomes?: string;
  };
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({
  courseDetail,
}) => {
  return (
    <>
      {/* Requirements Section */}
      <div className="bg-white p-6 rounded-lg border shadow border-gray-100 mb-8">
        <h3 className="text-xl font-bold mb-6">Yêu cầu</h3>
        <div className="space-y-2">
          <div>
            {courseDetail?.requirements && (
              <div
                dangerouslySetInnerHTML={{ __html: he.decode(courseDetail.requirements) }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white p-6 rounded-lg border shadow border-gray-100 mb-8">
        <h3 className="text-xl font-bold mb-6">Mô tả</h3>
        <div className={`space-y-4`}>
          {courseDetail?.description && (
            <div
              dangerouslySetInnerHTML={{ __html: he.decode(courseDetail.description) }}
            />
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow border-gray-100 mb-8">
        <h4 className="text-xl font-bold mb-6">Kết quả học tập:</h4>
        {courseDetail?.learningOutcomes && (
          <div
            dangerouslySetInnerHTML={{ __html: he.decode(courseDetail.learningOutcomes) }}
          />
        )}
      </div>
    </>
  );
};
