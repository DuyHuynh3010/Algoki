"use client";

import CourseCard from "@/components/courses/course-card";
import React from "react";
import { Course, CourseLabel } from "@/api/types/course.type";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes/routes";

interface CourseTabProps {
  courses?: Course[];
  isLoading?: boolean;
  error?: any;
  onCourseClick?: (courseId: string) => void;
  onLabelChange?: (label: string | null) => void;
  activeLabel?: string | null;
}

const listTab = [
  {
    id: 1,
    name: "All",
    numberLesson: 0, // Will be updated dynamically
    label: null,
  },
  {
    id: 2,
    name: "Featured",
    numberLesson: 0,
    label: CourseLabel.FEATURED,
  },
  {
    id: 3,
    name: "Popular",
    numberLesson: 0,
    label: CourseLabel.BEST_SELLER,
  },
  {
    id: 4,
    name: "Trending",
    numberLesson: 0,
    label: CourseLabel.HOT,
  },
  {
    id: 5,
    name: "Newest",
    numberLesson: 0,
    label: CourseLabel.NEW,
  },
];

export function CourseTab({
  courses = [],
  isLoading = false,
  error = null,
  onCourseClick,
  onLabelChange,
  activeLabel,
}: CourseTabProps) {
  const router = useRouter();
  // Get active tab ID based on activeLabel
  const getActiveTabId = () => {
    const matchingTab = listTab.find((tab) => tab.label === activeLabel);
    return matchingTab?.id || 1; // Default to "All" if no match
  };

  const handleNavigateToCourse = () => {
    router.push(Routes.courses);
  };

  // Update tabs with actual course counts
  const updatedTabs = listTab.map((tab) => {
    if (tab.id === 1) {
      // "All" tab shows total courses available
      return { ...tab, numberLesson: courses.length };
    } else {
      // Other tabs show estimated counts (you can make these dynamic based on actual filters if needed)
      return {
        ...tab,
        numberLesson: Math.floor(courses.length * 0.7), // Estimated 70% for other categories
      };
    }
  });

  const handleTabClick = (tab: any) => {
    onLabelChange?.(tab.label);
  };

  const handleCourseClick = (courseId: string) => {
    if (onCourseClick) {
      onCourseClick(courseId);
    }
  };

  // Get courses to display (limit to 8 for preview)
  const displayCourses = courses.slice(0, 8);

  console.log(displayCourses);

  return (
    <section className="bg-default mb-20 md:mb-[120px]">
      <div className="w-full mx-auto px-5 md:px-10 max-w-[1280px]">
        <div className="text-center lg:text-left mb-16 space-y-2">
          <h2 className="text-2xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#6D5DFB] to-[#2CD4D9] text-transparent bg-clip-text">
              A Diverse Coding Course Library
            </span>
          </h2>
          <h3 className="text-2xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#6D5DFB] to-[#2CD4D9] text-transparent bg-clip-text mb-4">
            Your Pathway To Success!
          </h3>
          <p className="text-white max-w-2xl mt-4">
            We’ve curated a wide range of coding courses tailored to every level and goal. Whether you’re just starting or sharpening advanced skills, Algoki has a course for you.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {updatedTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`cursor-pointer relative flex flex-col items-center justify-center min-w-[120px] px-8 py-4 rounded-full transition-all ${
                getActiveTabId() === tab.id
                  ? "bg-primary-main text-white"
                  : "text-[#16A1FF] hover:bg-[##16A1FF] border hover:text-white shadow-[0px_12px_24px_rgba(145,158,171,0.12),0px_0px_2px_rgba(145,158,171,0.20)]"
              }`}
            >
              {/*<span className="text-[10px] right-2.5 top-2 absolute text-[#919EABCC]">*/}
              {/*  {tab.numberLesson}*/}
              {/*</span>*/}
              <span
                className={`text-sm font-medium ${getActiveTabId() === tab.id ? "text-white" : "text-[#16A1FF]"}`}
              >
                {tab.name}
              </span>
            </button>
          ))}
        </div>

        {/* Courses Display */}
        <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            <div className="col-span-4 flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-gray-400" size={32} />
              <span className="ml-2 text-gray-500">Loading courses...</span>
            </div>
          ) : error ? (
            <div className="col-span-4 flex justify-center items-center py-20">
              <div className="text-center">
                <p className="text-red-500 mb-2">
                  Something went wrong while loading courses.
                </p>
                <p className="text-gray-500 text-sm">
                  {error?.message || "Please try again later."}
                </p>
              </div>
            </div>
          ) : displayCourses.length > 0 ? (
            displayCourses.map((course) => (
              <div
                key={course.id}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => handleCourseClick(course.slug)}
              >
                <CourseCard
                  slug={course.slug}
                  badge={course.label}
                  title={course.title}
                  imageUrl={course.thumbnail}
                  category={course.category.title}
                  courseName={course.title}
                  instructor={`Instructor: ${course?.owner.fullName}`}
                  lessonCount={course.totalLesson}
                  studentCount={course.enrollmentCnt}
                  currentPrice={
                    course.pricing.discounted
                      ? course.pricing.discounted.toLocaleString()
                      : course.pricing.regular.toLocaleString()
                  }
                  originalPrice={
                    course.pricing.discounted
                      ? course.pricing.regular.toLocaleString()
                      : ""
                  }
                />
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-20">
              <p className="text-gray-500">No courses available.</p>
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleNavigateToCourse}
            size="lg"
            className="text-white rounded-full"
          >
            View all
          </Button>
        </div>
      </div>
    </section>
  );
}
