"use client";
import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/slices/cart.slice";
import { Routes } from "@/lib/routes/routes";
import { Loader2 } from "lucide-react";
import {
  useCourseBySlug,
  useEnrollmentsCheck,
  useFAQUser,
  useInstructorProfile,
  useModule,
  useRelatedCourses,
  useReview,
  useReviewSummary,
} from "@/hooks/queries/course/useCourses";
import { useCreateReview } from "@/hooks/queries/course/useCreateRview";
import {
  CourseContent,
  CourseDetails,
  CourseFAQ,
  CourseHeader,
  CourseInstructor,
  CourseOverview,
  CourseReviews,
  CourseSidebar,
  OtherCourses,
  RelatedCourses,
} from "@/components/courses-detail";
import {
  useAddItemToCart,
  useRefetchCart,
} from "@/hooks/queries/cart/useCartApi";
import { useAuthStore } from "@/store/slices/auth.slice";
import toast from "react-hot-toast";
import { UserType } from "@/models/user.model";

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.id as string;
  const { cartId } = useCartStore();
  const { user } = useAuthStore.getState();

  // Fetch course data by slug
  const { data: courseDetail, isLoading, error } = useCourseBySlug(slug);
  const { data: enrollmentsCheck } = useEnrollmentsCheck(
    courseDetail?.id || "",
  );

  // Initialize createReview hook with courseDetail.id for query invalidation
  const { createReview, isLoading: isCreatingReview } = useCreateReview(
    courseDetail?.id,
    () => {
      // Review creation success callback
    },
  );

  // Fetch related courses when we have course detail
  const {
    data: relatedCoursesData,
    isLoading: isLoadingRelated,
    error: errorRelated,
  } = useRelatedCourses(courseDetail?.id || "");

  // Fetch FAQs when we have course detail
  const {
    data: faqsData,
    isLoading: isLoadingFAQs,
    error: errorFAQs,
  } = useFAQUser(courseDetail?.id || "");

  // Fetch FAQs when we have course detail
  const { data: moduleData } = useModule(courseDetail?.id || "");
  const { data: reviewData } = useReview(courseDetail?.id || "");
  const { data: reviewSummaryData, refetch } = useReviewSummary(
    courseDetail?.id || "",
  );
  const { data: instructorProfileData } = useInstructorProfile(
    courseDetail?.owner?.id || "",
  );

  // Add state for active tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "content" | "details" | "instructor" | "reviews"
  >("overview");

  // Add refs for each section
  const overviewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const instructorRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const { refetchCart } = useRefetchCart();

  const addToCart = useAddItemToCart();

  // Function to scroll to section
  const scrollToSection = (
    section: "overview" | "content" | "details" | "instructor" | "reviews",
  ) => {
    setActiveTab(section);

    let ref;
    switch (section) {
      case "overview":
        ref = overviewRef;
        break;
      case "content":
        ref = contentRef;
        break;
      case "details":
        ref = detailsRef;
        break;
      case "instructor":
        ref = instructorRef;
        break;
      case "reviews":
        ref = reviewsRef;
        break;
    }

    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-gray-400" size={48} />
        <span className="ml-2 text-gray-500">
          Loading course information...
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-2">
            Something went wrong while loading the course
          </p>
          <p className="text-gray-500 text-sm">
            {error?.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  // Course not found
  if (!courseDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Course not found</p>
          <button
            onClick={() => router.push("/course")}
            className="text-blue-500 hover:underline"
          >
            Back to course list
          </button>
        </div>
      </div>
    );
  }

  const handleCourseClick = (courseSlug: string) => {
    router.push(`/course/${courseSlug}`);
  };

  const handleCheckoutCourse = () => {
    if (user) {
      addToCart.mutate(
        {
          cartId,
          data: {
            productId: courseDetail.id,
            quantity: 1,
          },
        },
        {
          onSuccess: () => {
            refetchCart();
            router.push(Routes.checkout);
          },
        },
      );
    } else {
      router.push(Routes.login);
    }
  };

  const handlePushToCart = () => {
    if (user) {
      addToCart.mutate(
        {
          cartId,
          data: {
            productId: courseDetail.id,
            quantity: 1,
          },
        },
        {
          onSuccess: () => {
            refetchCart();
          },
        },
      );
    } else {
      router.push(Routes.login);
    }
  };

  const handleLearn = () => {
    if (user?.type === UserType.INSTRUCTOR) {
      toast.error("Not available for instructors!");
      return;
    }
    if (moduleData?.data && moduleData?.data?.length > 0) {
      router.push(
        `/lesson?course=${slug}&module=${moduleData?.data?.[0]?.id}&lesson=${moduleData?.data?.[0]?.lessons?.[0]?.id}`,
      );
    } else {
      toast.error("No lessons available yet!");
    }
  };

  const handleUpdateReview = (
    rating: number,
    comment: string,
    title?: string,
  ) => {
    if (!courseDetail?.id) {
      console.error("Course ID not available");
      return;
    }

    const reviewData = {
      data: {
        rating: rating,
        content: comment,
        title: title || "",
      },
      productId: courseDetail.id,
    };

    createReview.mutate(reviewData, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <div className="bg-default">
      {/* Header */}
      <CourseHeader
        courseDetail={courseDetail}
        reviewSummaryData={reviewSummaryData}
      />

      <CourseSidebar
        enrolled={enrollmentsCheck?.enrolled}
        courseDetail={courseDetail}
        onCheckoutCourse={handleCheckoutCourse}
        handlePushToCart={handlePushToCart}
        handleLearn={handleLearn}
      />


      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="sm:sticky top-[64px] lg:top-[72px] z-40 flex flex-wrap gap-2 mb-8 py-4">
              <button
                className={`px-8 py-3 font-medium rounded-full ${activeTab === "overview" ? "bg-[#16A1FF] text-white" : "bg-[#F4F6F8] text-gray-500 hover:bg-gray-200"}`}
                onClick={() => scrollToSection("overview")}
              >
                Overview
              </button>
              <button
                className={`px-8 py-3 font-medium rounded-full ${activeTab === "content" ? "bg-[#16A1FF] text-white" : "bg-[#F4F6F8] text-gray-500 hover:bg-gray-200"}`}
                onClick={() => scrollToSection("content")}
              >
                Content
              </button>
              <button
                className={`px-8 py-3 font-medium rounded-full ${activeTab === "details" ? "bg-[#16A1FF] text-white" : "bg-[#F4F6F8] text-gray-500 hover:bg-gray-200"}`}
                onClick={() => scrollToSection("details")}
              >
                Details
              </button>
              <button
                className={`px-8 py-3 font-medium rounded-full ${activeTab === "instructor" ? "bg-[#16A1FF] text-white" : "bg-[#F4F6F8] text-gray-500 hover:bg-gray-200"}`}
                onClick={() => scrollToSection("instructor")}
              >
                Instructor
              </button>
              <button
                className={`px-8 py-3 font-medium rounded-full ${activeTab === "reviews" ? "bg-[#16A1FF] text-white" : "bg-[#F4F6F8] text-gray-500 hover:bg-gray-200"}`}
                onClick={() => scrollToSection("reviews")}
              >
                Reviews
              </button>
            </div>

            {/* Tab Content */}
            <div ref={overviewRef}>
              <CourseOverview courseDetail={courseDetail.overview} />
            </div>

            <div ref={contentRef}>
              <CourseContent
                enrolled={enrollmentsCheck?.enrolled}
                moduleData={moduleData}
                slug={slug}
              />
            </div>

            <div ref={detailsRef}>
              <CourseDetails courseDetail={courseDetail} />
            </div>

            <div ref={instructorRef}>
              <CourseInstructor
                courseDetail={courseDetail}
                instructorProfileData={instructorProfileData}
              />
            </div>

            <div ref={reviewsRef}>
              <CourseReviews
                courseDetail={courseDetail}
                reviewData={reviewData as any}
                isCreatingReview={isCreatingReview}
                onUpdateReview={handleUpdateReview}
                reviewSummaryData={reviewSummaryData}
              />
            </div>

            <CourseFAQ
              faqsData={faqsData}
              isLoadingFAQs={isLoadingFAQs}
              errorFAQs={errorFAQs}
            />

            <OtherCourses
              instructorName={courseDetail.owner.fullName}
              instructorId={courseDetail.owner.id}
              currentCourseId={courseDetail.id}
              onCourseClick={handleCourseClick}
            />
          </div>
        </div>
      </div>

      <RelatedCourses
        relatedCoursesData={relatedCoursesData}
        isLoadingRelated={isLoadingRelated}
        errorRelated={errorRelated}
      />
    </div>
  );
}
