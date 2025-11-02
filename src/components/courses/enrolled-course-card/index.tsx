import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Book, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCourseBySlug, useModule } from "@/hooks/queries/course/useCourses";

interface EnrolledCourseCardProps {
  imageUrl: string;
  category: string;
  courseName: string;
  instructor: string;
  lessonCount: number;
  studentCount: number;
  progress: number;
  status: "in-progress" | "completed";
  onEdit?: () => void;
  slug: string;
}

function EnrolledCourseCard({
  imageUrl,
  category,
  courseName,
  instructor,
  lessonCount,
  studentCount,
  progress,
  status,
  onEdit,
  slug,
}: EnrolledCourseCardProps) {
  const router = useRouter();
  const { data: courseDetail } = useCourseBySlug(slug);
  const {
    data: moduleData,
    isLoading,
  } = useModule(courseDetail?.id || "");

  const handleLearn = () => {
    if (isLoading) {
      toast.error("Đang tải bài học");
      return;
    }
    if (moduleData?.data && moduleData?.data?.length > 0) {
      router.push(
        `/lesson?course=${slug}&module=${moduleData?.data?.[0]?.id}&lesson=${moduleData?.data?.[0]?.lessons?.[0]?.id}`,
      );
    } else {
      toast.error("Hiện chưa có bài học nào!");
    }
  };

  return (
    <div
      role="presentation"
      onClick={handleLearn}
      className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer border border-gray-200"
    >
      {/* Course Image */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={courseName}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="text-blue-600 text-sm mb-2">{category}</div>
        <h4 className="font-semibold text-lg mb-2 line-clamp-2">
          {courseName}
        </h4>
        <div className="text-gray-600 text-sm mb-3">{instructor}</div>

        <div className="flex items-center gap-4 text-sm mb-4">
          <div className="flex items-center text-gray-500">
            <Book className="w-4 h-4 mr-1" />
            {lessonCount} Bài học
          </div>
          <div className="flex items-center text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            {studentCount} Người học
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Hoàn thành:</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center">
          {status === "completed" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="text-gray-600 border-gray-300"
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleLearn}
              className="bg-gray-800 hover:bg-gray-700 text-[#FFFFFF]"
            >
              Tiếp tục
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnrolledCourseCard;
