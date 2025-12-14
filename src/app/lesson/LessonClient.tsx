"use client";

import LessonSidebar from "@/components/courses/lesson-sidebar";
import VideoPlayer from "@/components/ui/video-player";
import { useEffect, useState } from "react";
// import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import ContentTab from "@/components/lesson/ContentTab";
import DocumentLesson from "@/components/lesson/DocumentLesson";
import ExerciseLesson from "@/components/lesson/ExerciseLesson";
import QuizLesson from "@/components/lesson/QuizLesson";
import StudyCode, { defaultJavaExercise } from "@/components/lesson/StudyCode";
import {
  useCourseBySlug,
  useModuleForUser,
} from "@/hooks/queries/course/useCourses";
import { useGetLessonById } from "@/hooks/queries/course/useLessonCourse";
import { useQuizStore } from "@/store/slices/lesson.slice";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import IconToggleSidebar from "../../../public/icons/lessson/IconToggleSidebar";
import IconToggleSidebarActive from "../../../public/icons/lessson/IconToggleSidebarActive";
// import AIHelperModal from "@/app/lesson/ModalChatbot";

// Interface compatible with LessonSidebar
interface SidebarLesson {
  id: string;
  title: string;
  duration: string;
  type: string;
  active?: boolean;
}

interface SidebarSection {
  id: string;
  title: string;
  expanded: boolean;
  lessons: SidebarLesson[];
  progress?: string;
}

// Extended interface for internal use
interface ExtendedLesson extends SidebarLesson {
  moduleId: string;
  order: number;
  status: string;
  isPreviewable: boolean;
  description: string;
  attachmentUrl: string | null;
  sampleImageUrl: string;
  isCompleted: boolean;
}

export function LessonClient() {
  const isQuizStarted = useQuizStore((state) => state.isQuizStarted);

  const searchParams = useSearchParams();
  const slug = searchParams.get("course");
  const moduleId = searchParams.get("module");
  const lessonId = searchParams.get("lesson");

  const { data: courseDetail } = useCourseBySlug(slug as string);
  const { data: moduleData } = useModuleForUser(courseDetail?.id || "");
  const { data: initValue } = useGetLessonById(
    courseDetail?.id as string,
    moduleId as string,
    lessonId as string,
  );

  const [sections, setSections] = useState<SidebarSection[]>([]);
  const [lessonsData, setLessonsData] = useState<ExtendedLesson[]>([]); // Store extended lesson data
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<ExtendedLesson | null>(
    null,
  );
  // const [isAIHelperOpen, setIsAIHelperOpen] = useState(false);

  // Map lesson type from BE to frontend
  const mapLessonType = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "video";
      case "ARTICLE":
        return "doc";
      case "QUIZ":
        return "quiz";
      case "PRACTICE":
        return "exercise";
      default:
        return "video";
    }
  };

  // Format duration to display string
  const formatDuration = (duration: number) => {
    if (duration === 0) return "00:00";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Transform BE data to frontend sections
  useEffect(() => {
    if (moduleData?.data) {
      const allLessonsData: ExtendedLesson[] = [];

      const transformedSections = moduleData.data
        .filter((module: any) => module.status === "PUBLISHED")
        .sort((a: any, b: any) => a.order - b.order)
        .map((module: any) => {
          const publishedLessons = module.lessons
            .filter((lesson: any) => lesson.status === "PUBLISHED")
            .sort((a: any, b: any) => a.order - b.order)
            .map((lesson: any) => {
              const extendedLesson: ExtendedLesson = {
                id: lesson.id,
                title: lesson.title,
                duration: formatDuration(lesson.duration),
                type: mapLessonType(lesson.type),
                moduleId: lesson.moduleId,
                order: lesson.order,
                status: lesson.status,
                isPreviewable: lesson.isPreviewable,
                description: lesson.description,
                attachmentUrl: lesson.attachmentUrl,
                sampleImageUrl: lesson?.sampleImageUrl,
                active: false,
                isCompleted: lesson?.isCompleted,
              };

              allLessonsData.push(extendedLesson);

              // Return sidebar-compatible lesson
              return {
                id: lesson.id,
                title: lesson.title,
                duration: formatDuration(lesson.duration),
                type: mapLessonType(lesson.type),
                active: false,
                isCompleted: lesson?.isCompleted,
              };
            });

          return {
            id: module.id,
            title: module.title,
            expanded: module.id === moduleId, // Expand section if it matches URL moduleId
            lessons: publishedLessons,
            progress: `0/${publishedLessons.length}`,
          };
        });

      setLessonsData(allLessonsData);
      setSections(transformedSections);

      // Set current lesson based on URL params or first lesson of active module
      if (allLessonsData.length > 0) {
        let lessonToSelect = null;

        if (lessonId) {
          // Find lesson by lessonId
          lessonToSelect = allLessonsData.find(
            (lesson: ExtendedLesson) => lesson.id === lessonId,
          );
        }

        if (!lessonToSelect && moduleId) {
          // Find first lesson in the specified module
          lessonToSelect = allLessonsData.find(
            (lesson: ExtendedLesson) => lesson.moduleId === moduleId,
          );
        }

        if (!lessonToSelect) {
          // Fallback to first lesson
          lessonToSelect = allLessonsData[0];
        }

        if (lessonToSelect) {
          setCurrentLesson(lessonToSelect);
          // Update sections to mark the selected lesson as active
          setSections((prevSections) =>
            prevSections.map((section) => ({
              ...section,
              lessons: section.lessons.map((lesson) => ({
                ...lesson,
                active: lesson.id === lessonToSelect!.id,
              })),
            })),
          );
        }
      }
    }
  }, [moduleData, moduleId, lessonId]);

  // Handle responsive sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobileView(mobile);
      setIsSidebarVisible(!mobile);
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section,
      ),
    );
  };


  const selectLesson = (lesson: SidebarLesson) => {
    // Find the extended lesson data
    const extendedLesson = lessonsData.find((l) => l.id === lesson.id);
    if (!extendedLesson) return;

    // Create a new sections array with the active lesson updated
    const newSections = sections.map((section) => ({
      ...section,
      lessons: section.lessons.map((l) => ({
        ...l,
        active: l.id === lesson.id,
      })),
    }));

    // Set the updated sections
    setSections(newSections);

    // Update current lesson
    setCurrentLesson(extendedLesson);

    // Hide sidebar on mobile after selecting a lesson
    if (isMobileView) {
      setIsSidebarVisible(false);
    }

    // Update URL params to reflect current lesson
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("lesson", lesson.id);
    newSearchParams.set("module", extendedLesson.moduleId);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${newSearchParams}`,
    );
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const renderLessonBody = (type: string) => {
    switch (type) {
      case "video":
        return (
          <VideoPlayer
            src={initValue?.videoUrl || "/videos/lesson.mp4"}
            poster="/images/lesson-thumbnail.jpg"
          />
        );
      case "doc":
        return <DocumentLesson data={initValue} />;
      case "quiz":
        return <QuizLesson dataLesson={initValue} dataCourse={courseDetail} />;
      case "exercise":
        return (
          <ExerciseLesson dataLesson={initValue} dataCourse={courseDetail} />
        );
      default:
        return null;
    }
  };

  if (!courseDetail || !currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#161C24]">
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex relative min-h-screen bg-[#161C24]">
      <div
        className="fixed bottom-10 right-20 z-50"
        // onClick={() => setIsAIHelperOpen(true)}
      >
        <Image
          src="/chatbot.svg"
          alt="Logo"
          className="m-2"
          width={88}
          height={88}
        />
      </div>

      {/* Left Sidebar - always visible on desktop, toggle on mobile */}
      {isSidebarVisible && (
        <div
          className={`
          ${isMobileView ? "fixed z-20 top-0 left-0 h-full transition-transform duration-300 ease-in-out" : "relative z-10"}
          ${isSidebarVisible ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isMobileView ? "w-max sm:w-[350px] bg-[#212B36] shadow-xl" : "w-0 lg:w-[350px] bg-[#212B36]"}
        `}
          style={{ minHeight: "100vh" }}
        >
          <LessonSidebar
            sections={sections}
            onToggleSection={toggleSection}
            onSelectLesson={selectLesson}
          />
        </div>
      )}
      {/* Overlay for mobile when sidebar is open */}
      {isMobileView && isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-10 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#161C24] min-w-0 min-h-screen">
        {/* Header with back button */}
        <div className="items-center justify-between md:flex p-4 bg-[#212B36] text-white border-b border-gray-700">
          <div className="flex items-center gap-3">
            <button
              className="mr-3 bg-gray-700 h-[36px] w-[36px] flex items-center justify-center rounded hover:bg-gray-600 transition-colors"
              onClick={toggleSidebar}
            >
              {isSidebarVisible ? (
                <IconToggleSidebar />
              ) : (
                <IconToggleSidebarActive />
              )}
            </button>
            <h1 className="text-lg font-medium truncate text-white">
              {courseDetail?.title}
            </h1>
          </div>
          {/*<div className="flex items-center gap-6 mt-2 md:mt-0">*/}
          {/*  <div className="font-bold cursor-pointer flex items-center gap-1">*/}
          {/*    <ArrowLeft2 size="20" color="#212B36" />*/}
          {/*    Previous*/}
          {/*  </div>*/}
          {/*  <div className="font-bold cursor-pointer flex items-center gap-1">*/}
          {/*    Next*/}
          {/*    <ArrowRight2 size="20" color="#212B36" />*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>

        {initValue?.practiceType === "coding" ? (
          <StudyCode
            exercise={defaultJavaExercise}
            course={courseDetail}
            initValue={initValue}
          />
        ) : (
          <>
            {renderLessonBody(currentLesson.type)}

            {!isQuizStarted && (
              <ContentTab
                courseTitle={courseDetail?.title}
                currentLesson={courseDetail}
                lessonId={lessonId as string}
                courseId={courseDetail?.id}
                dataLesson={initValue}
              />
            )}
          </>
        )}
      </div>
      {/*<AIHelperModal open={isAIHelperOpen} setOpen={setIsAIHelperOpen} />*/}
    </div>
  );
}

export default LessonClient;
