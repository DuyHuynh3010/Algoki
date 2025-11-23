import React from "react";
import IconTickGreen from "../../../public/icons/IconTickGreen";

interface ICourseOverview {
  courseDetail: string[];
}

export const CourseOverview: React.FC<ICourseOverview> = ({courseDetail}) => {
  const defaultData = [
    "Plenty of new and valuable knowledge.",
  ];

  const learningPoints = courseDetail.length > 0 ? courseDetail : defaultData;

  return (
    <div className="p-6 rounded-lg shadow bg-paper mb-8">
      <h3 className="text-xl font-bold mb-6">
        What you will learn
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {learningPoints.map((point, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-shrink-0">
              <IconTickGreen />
            </div>
            <p>{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 