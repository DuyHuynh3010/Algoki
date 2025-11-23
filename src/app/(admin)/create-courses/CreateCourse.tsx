"use client";

import { CourseDetail } from "@/api/types/course.type";
import Step1Form from "@/app/(admin)/create-courses/create/Step1Form";
import {
  CourseBuilderSection,
  CoursePricingSection,
  CourseSettingsSection,
  VideoIntroSection,
} from "@/app/(admin)/create-courses/create/components";
import CourseFAQ from "@/app/(admin)/create-courses/create/components/CourseFAQ";
import { fullCourseFormData } from "@/app/(admin)/create-courses/create/schemas";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListStatusCourse } from "@/contants/course";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import { useCreateCourse } from "@/hooks/queries/course";
import {
  courseKeys,
  useCourseCMSBySlug,
} from "@/hooks/queries/course/useCourses";
import { useUpdateCourse } from "@/hooks/queries/course/useCreateCourse";
import {
  EStatusCourse,
  useStatusCourse,
} from "@/hooks/queries/course/useStatusCourse";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "iconsax-react";
import { Check, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CourseInfoSection from "./create/components/CourseInfoSection";

const STEP_SUBMIT_CREATE_COURSE = 5;

const steps = [
  { id: 1, title: "Create Course", description: "Create Course" },
  { id: 2, title: "Add Information", description: "Add Information" },
];

function CreateCourse() {
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("slug") ?? "";
  const [currentStep, setCurrentStep] = useState(1);
  const { courseData, setCourseData } = useCreateCourseContext();
  const [formData, setFormData] = useState<Partial<fullCourseFormData>>();
  const isEdit = Boolean(courseSlug);
  const queryClient = useQueryClient();

  const { data: initialCourseData } = useCourseCMSBySlug(courseSlug as string);

  useEffect(() => {
    if (initialCourseData) {
      setFormData({
        ...initialCourseData,
        categoryId: initialCourseData.category.id,
      });
      setCourseData(initialCourseData);
      setCurrentStep(1);
    }
  }, [initialCourseData]);

  console.log("formData---", formData);


  const handleStepNext = (data: any) => {
    const finalData = { ...formData, ...data };
    setFormData((prev: any) => ({ ...prev, ...finalData }));
    if (currentStep === STEP_SUBMIT_CREATE_COURSE) {
      handleFinalSubmit(finalData);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleSetCourseData = (data: CourseDetail) => {
    setCourseData(data);
  };

  const { createCourse } = useCreateCourse();
  const updateCourse = useUpdateCourse(courseData?.id as string);

  const { archiveCourse, draftCourse, publishCourse } =
    useStatusCourse(handleSetCourseData);

  const handleStepBack = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const handleFinalSubmit = (data: fullCourseFormData) => {
    const request = {
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      slug: data.slug,
      label: data.label,
      isFree: data.isFree,
      thumbnail: data.thumbnail,
      shortDescription: data.shortDescription,
      categoryId: data.categoryId,
      learningOutcomes: data.learningOutcomes,
      previewVideo: data.previewVideo,
      previewImg: data.previewImg,
      difficulty: data.difficulty,
      regularPrice: data.regularPrice,
      discountedPrice: data.discountedPrice,
      overview: data.overview,
    };
    if (isEdit) {
      updateCourse.mutate(request, {
        onSuccess: (data) => {
          setCourseData(data);
          queryClient.invalidateQueries({
            queryKey: [courseKeys.list()], // Match all queries starting with this key
            exact: false
          })
        },
      });
      return;
    }
    createCourse.mutate(request, {
      onSuccess: (data) => {
        setCourseData(data);
        setCurrentStep((prev) => prev + 1);
        queryClient.invalidateQueries({
          queryKey: [courseKeys.list()], // Match all queries starting with this key
          exact: false
        })
      },
      onError: (error) => {
        console.error("Error creating course:", error);
      },
    });
  };

  const handleOnChangeStatus = (value: string) => {
    switch (value) {
      case EStatusCourse.ARCHIVED:
        archiveCourse.mutate(courseData?.id || "");
        break;
      case EStatusCourse.DRAFT:
        draftCourse.mutate(courseData?.id || "");
        break;
      case EStatusCourse.PUBLISHED:
        publishCourse.mutate(courseData?.id || "");
        break;
    }
  };

  const stepsList = [
    {
      label: "Create Course",
      stepIndex: 1,
      disabled: false,
      component: <Step1Form onNext={handleStepNext} initialData={formData} />,
    },
    {
      label: "Add Information",
      stepIndex: 2,
      disabled: !courseData && currentStep < 2,
      component: (
        <CourseInfoSection
          onNext={handleStepNext}
          onBack={handleStepBack}
          initialData={formData}
        />
      ),
    },
    {
      label: "Course Settings",
      stepIndex: 3,
      disabled: !courseData && currentStep < 3,
      component: (
        <CourseSettingsSection
          onNext={handleStepNext}
          onBack={handleStepBack}
          initialData={formData}
        />
      ),
    },
    {
      label: "Intro Video",
      stepIndex: 4,
      disabled: !courseData && currentStep < 4,
      component: (
        <VideoIntroSection
          onNext={handleStepNext}
          onBack={handleStepBack}
          initialData={formData}
        />
      ),
    },
    {
      label: "Course Pricing",
      stepIndex: 5,
      disabled: !courseData && currentStep < 5,
      component: (
        <CoursePricingSection
          onNext={handleStepNext}
          onBack={handleStepBack}
          initialData={formData}
        />
      ),
    },
    {
      label: "Build Course",
      stepIndex: 6,
      disabled: !courseData && currentStep < 6,
      component: <CourseBuilderSection />,
    },
    {
      label: "Course FAQ",
      stepIndex: 7,
      disabled: !courseData && currentStep < 7,
      component: <CourseFAQ />,
    },
    // { label: "Build Course", stepIndex: 5},
  ];

  const renderStepScreen = () => {
    const currentStepData = stepsList.find(
      (item) => item.stepIndex === currentStep,
    );
    if (currentStepData) {
      return currentStepData.component;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#020617] py-8 md:mt-20 mt-10 text-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between flex-col md:flex-row items-center">
          <h1 className="text-2xl font-bold text-slate-50 mb-8 md:w-[30%]">
            {!initialCourseData ? "New Course" : "Edit Course"}
          </h1>
          <div className="flex items-center justify-center mb-4 w-[70%] relative">
            {/* Connecting Line Background */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full md:max-w-[150px] max-w-[120px] h-[2px] bg-slate-700 z-0" />
            <div
              className={`absolute top-4 left-1/2 transform -translate-x-1/2 h-[2px] bg-sky-500 z-0 transition-all duration-300 w-0`}
            />

            <div className="flex items-center justify-between w-full max-w-[300px] relative z-10">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center flex-col gap-1">
                  <div
                    className={`flex items-center justify-center w-8 h-8 flex-shrink-0 rounded-full border-2 ${
                      currentStep >= step.id
                        ? "bg-sky-500 border-sky-500 text-slate-950"
                        : "border-slate-600 bg-slate-700 text-slate-200"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" color="white" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.id ? "text-slate-100" : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {courseData && (
            <div className="flex items-end justify-end gap-2">
              <div className="p-2">
                <Trash color="#f97373" />
              </div>
              <div>
                <Select
                  onValueChange={(value) => handleOnChangeStatus(value)}
                  value={courseData.status}
                >
                  <SelectTrigger className="h-10 border-slate-700 bg-slate-900 text-slate-100 focus:border-sky-500 focus:ring-sky-500">
                    <SelectValue placeholder="Youtube" />
                  </SelectTrigger>
                  <SelectContent className="bg-paper">
                    {ListStatusCourse.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3" style={{
            boxShadow:
              "0 0 0 1px rgba(15,23,42,0.8), 0 18px 40px -12px rgba(15,23,42,0.9)",
          }}>
            <Card className="p-6 bg-slate-900 shadow-sm border border-slate-800">
              <nav className="space-y-2">
                {stepsList.map((item, index) => (
                  <div
                    onClick={() => {
                      if (item.disabled) {
                        return;
                      }
                      setCurrentStep(item.stepIndex);
                    }}
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      item.stepIndex === currentStep
                        ? "bg-slate-800 text-sky-400 border border-sky-500"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                    style={{
                      cursor: item.disabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <span
                      className={`font-medium ${item.disabled ? "text-gray-400" : ""}`}
                    >
                      {item.label}
                    </span>
                    <ChevronRight
                      color={item.disabled ? "#64748b" : "#e5e7eb"}
                      className="w-4 h-4"
                    />
                  </div>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div
            className="lg:col-span-9"
            style={{
              boxShadow:
                "0 0 0 1px rgba(15,23,42,0.8), 0 18px 40px -12px rgba(15,23,42,0.9)",
            }}
          >
            {/* Form Card */}
            {renderStepScreen()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
