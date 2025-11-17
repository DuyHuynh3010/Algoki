"use client";

import { InstructorProfile, LearnerProfile } from "@/api/types/intructor.type";
import { Button } from "@/components/ui/button";
import { useStudent } from "@/hooks/queries/dashboard/useStudent";
import { useTeacher } from "@/hooks/queries/dashboard/useTeacher";
import { Routes } from "@/lib/routes/routes";
import { UserType } from "@/models/user.model";
import { useAuthStore } from "@/store/slices/auth.slice";
import { useCartStore } from "@/store/slices/cart.slice";
import {
  DocumentText,
  MessageText,
  Profile2User,
  Tag
} from "iconsax-react";
import {
  Book,
  FileText,
  Heart,
  History,
  Home,
  LogOut,
  Settings,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import IconBookWhite from "../../../../public/icons/IconBookWhite";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, isTeacher, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const user = useAuthStore.getState().user;
  const { clearCart } = useCartStore();
  const [learnerProfileData, setLearnerProfileData] = React.useState<
    LearnerProfile | InstructorProfile | undefined
  >(undefined);

  const { data: teacherData } = useTeacher(user?.id || "", isTeacher);
  const { data: studentData } = useStudent(user?.id || "", !isTeacher);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(Routes.login);
    }
  }, []);

  useEffect(() => {
    if (isTeacher) {
      setLearnerProfileData(teacherData as InstructorProfile);
    } else {
      setLearnerProfileData(studentData as LearnerProfile);
    }
  }, [studentData, teacherData, isTeacher]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const renderStars = (rating: number | string) => {
    return (
      <div className="flex items-center gap-1 my-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= Number(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
            color={star <= Number(rating) ? "#fbbf24" : "#e5e7eb"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-20 bg-[#020617] min-h-screen text-slate-50">
      {/* Colorful Banner/Header */}
      <div className="bg-[linear-gradient(90deg,#020617_0%,#0b1120_40%,#020617_100%)] w-full h-[300px] relative"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-[160px] relative z-10">
        {/* Profile Info Section */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dashboard/banner-profile.png"
            alt="profile banner"
            className="h-[310px] w-full object-cover rounded-xl"
          />
            <div className="absolute bottom-10 md:left-10 left-4 text-center flex items-end justify-between md:right-20">
            <div className="flex md:flex-row flex-col md:items-center  gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  user?.avatarUrl ??
                  "https://i.pinimg.com/736x/00/7c/bb/007cbbb03fa1405a7bd2b8a353e16242.jpg"
                }
                alt={user?.fullName}
                width={120}
                height={120}
                className="rounded-full border-4 border-white h-[120px] w-[120px]"
              />
              <div className="flex flex-col items-start">
                <h1 className="text-2xl font-bold mt-4 text-slate-50">
                  {user?.fullName}
                </h1>
                {isTeacher ? (
                  <>
                    {renderStars(
                      (learnerProfileData as InstructorProfile)?.data
                        ?.ratingAverage,
                    )}
                    <div className="flex items-center gap-2 text-slate-50">
                      <div className="flex items-center mt-2 gap-2 text-slate-50">
                        <IconBookWhite />
                        <span className="text-sm text-slate-50">
                          {
                            (learnerProfileData as InstructorProfile)?.data
                              ?.totalCourses
                          }{" "}
                          courses
                        </span>
                      </div>
                      <div className="flex items-center mt-2 gap-2 text-slate-50">
                        <Profile2User size={20} color="white" />
                        <span className="text-sm text-slate-50">
                          {
                            (learnerProfileData as InstructorProfile)?.data
                              ?.totalStudents
                          }{" "}
                          learners
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center mt-2 gap-2 text-slate-50">
                    <IconBookWhite />
                    <span className="text-sm text-slate-50">
                      {isTeacher
                        ? (learnerProfileData as InstructorProfile)?.data
                            ?.totalCourses
                        : (learnerProfileData as LearnerProfile)?.data
                            ?.totalCoursesEnrolled}{" "}
                      enrolled courses
                    </span>
                  </div>
                )}
              </div>
            </div>
            {isTeacher && (
              <Button className="text-slate-50 bg-[#1d4ed8] hover:bg-[#1e40af] border border-slate-700">
                <Link href="/create-courses" className="text-slate-50">
                  Create a new course
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="bg-[#020617] rounded-lg border border-slate-800 p-6">
            <div className="text-sm font-medium uppercase text-slate-400 mb-4">
              WELCOME, {user?.fullName}
            </div>

            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className={`flex items-center px-3 py-3 transition-colors ${
                  isActive("/dashboard")
                    ? "text-sky-400 bg-slate-900"
                    : "text-slate-200 hover:bg-slate-900"
                } rounded-lg`}
              >
                <Home
                  className="w-5 h-5 mr-3"
                  color={isActive("/dashboard") ? "#155dfc" : "#364153"}
                />
                <span
                  className={
                    isActive("/dashboard") ? "font-medium text-sky-400" : ""
                  }
                  >
                  Overview
                </span>
              </Link>

              <Link
                href="/dashboard/profile"
                className={`flex items-center px-3 py-3 transition-colors ${
                  isActive("/dashboard/profile")
                    ? "text-sky-400 bg-slate-900"
                    : "text-slate-200 hover:bg-slate-900"
                } rounded-lg`}
              >
                <User
                  className="w-5 h-5 mr-3"
                  color={isActive("/dashboard/profile") ? "#155dfc" : "#364153"}
                />
                <span
                  className={
                    isActive("/dashboard/profile")
                      ? "font-medium text-sky-400"
                      : ""
                  }
                  >
                  Profile
                </span>
              </Link>

              {!isTeacher && (
                <Link
                  href="/dashboard/courses"
                  className={`flex items-center px-3 py-3 transition-colors ${
                    isActive("/dashboard/courses")
                      ? "text-sky-400 bg-slate-900"
                      : "text-slate-200 hover:bg-slate-900"
                  } rounded-lg`}
                >
                  <Book
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/courses") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/courses")
                        ? "font-medium text-sky-400"
                        : ""
                    }
                  >
                    Enrolled courses
                  </span>
                </Link>
              )}

              {!isTeacher && (
                <Link
                  href="/dashboard/favorites"
                  className={`flex items-center px-3 py-3 transition-colors ${
                    isActive("/dashboard/favorites")
                      ? "text-sky-400 bg-slate-900"
                      : "text-slate-200 hover:bg-slate-900"
                  } rounded-lg`}
                >
                  <Heart
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/favorites") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/favorites")
                        ? "font-medium text-sky-400"
                        : ""
                    }
                  >
                    Favourites
                  </span>
                </Link>
              )}

              <Link
                href="/dashboard/reviews"
                className={`flex items-center px-3 py-3 transition-colors ${
                  isActive("/dashboard/reviews")
                    ? "text-sky-400 bg-slate-900"
                    : "text-slate-200 hover:bg-slate-900"
                } rounded-lg`}
              >
                <Star
                  className="w-5 h-5 mr-3"
                  color={isActive("/dashboard/reviews") ? "#155dfc" : "#364153"}
                />
                <span
                  className={
                    isActive("/dashboard/reviews")
                      ? "font-medium text-sky-400"
                      : ""
                  }
                  >
                  Reviews
                </span>
              </Link>

              {!isTeacher && (
                <Link
                  href="/dashboard/test-scores"
                  className={`flex items-center px-3 py-3 transition-colors ${
                    isActive("/dashboard/test-scores")
                      ? "text-sky-400 bg-slate-900"
                      : "text-slate-200 hover:bg-slate-900"
                  } rounded-lg`}
                >
                  <FileText
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/test-scores") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/test-scores")
                        ? "font-medium text-sky-400"
                        : ""
                    }
                  >
                    Test scores
                  </span>
                </Link>
              )}

              {!isTeacher && (
                <Link
                  href="/dashboard/purchase-history"
                  className={`flex items-center px-3 py-3 transition-colors ${
                    isActive("/dashboard/purchase-history")
                      ? "text-sky-400 bg-slate-900"
                      : "text-slate-200 hover:bg-slate-900"
                  } rounded-lg`}
                >
                  <History
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/purchase-history")
                        ? "#155dfc"
                        : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/purchase-history")
                        ? "font-medium text-sky-400"
                        : ""
                    }
                  >
                    Purchase history
                  </span>
                </Link>
              )}
            </nav>

            {user?.type === UserType.INSTRUCTOR && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="text-sm font-medium uppercase text-slate-400 mb-4">
                  INSTRUCTOR
                </div>

                <Link
                  href="/dashboard/my-courses"
                  className={`flex items-center px-3 py-3 transition-colors ${
                    isActive("/dashboard/my-courses")
                      ? "text-sky-400 bg-slate-900"
                      : "text-slate-200 hover:bg-slate-900"
                  } rounded-lg`}
                >
                  <Book
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/my-courses") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/my-courses")
                        ? "font-medium text-sky-400"
                        : ""
                    }
                  >
                    My courses
                  </span>
                </Link>

                <Link
                  href="/dashboard/category"
                  className={`flex items-center px-3 py-3 transition-colors ${
                    isActive("/dashboard/category")
                      ? "text-sky-400 bg-slate-900"
                      : "text-slate-200 hover:bg-slate-900"
                  } rounded-lg`}
                >
                  <Tag
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/category")
                        ? "#155dfc"
                        : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/category")
                        ? "font-medium text-sky-400"
                        : ""
                    }
                  >
                    Course categories
                  </span>
                </Link>

                <Link
                  href="/dashboard/test"
                  className={`flex items-center px-3 py-3 transition-colors ${
                    isActive("/dashboard/test")
                      ? "text-sky-400 bg-slate-900"
                      : "text-slate-200 hover:bg-slate-900"
                  } rounded-lg`}
                >
                  <DocumentText
                    className="w-5 h-5 mr-3"
                    color={isActive("/dashboard/test") ? "#155dfc" : "#364153"}
                  />
                  <span
                    className={
                      isActive("/dashboard/test")
                        ? "font-medium text-sky-400"
                        : ""
                    }
                  >
                    Tests
                  </span>
                </Link>

                <Link
                  href="/dashboard/exercise"
                  className={`flex items-center px-3 py-3 transition-colors ${
                    isActive("/dashboard/exercise")
                      ? "text-sky-400 bg-slate-900"
                      : "text-slate-200 hover:bg-slate-900"
                  } rounded-lg`}
                >
                  <MessageText
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/exercise") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/exercise")
                        ? "font-medium text-sky-400"
                        : ""
                    }
                  >
                    Exercises
                  </span>
                </Link>
                <Link
                  href="/dashboard/purchase-approve"
                  className={`flex items-center px-3 py-3 transition-colors ${
                    isActive("/dashboard/purchase-approve")
                      ? "text-sky-400 bg-slate-900"
                      : "text-slate-200 hover:bg-slate-900"
                  } rounded-lg`}
                >
                  <History
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/purchase-approve")
                        ? "#155dfc"
                        : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/purchase-approve")
                        ? "font-medium text-sky-400"
                        : ""
                    }
                  >
                    Purchase approvals
                  </span>
                </Link>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="text-sm font-medium uppercase text-slate-400 mb-4">
                PERSONAL
              </div>

              <nav className="space-y-1">
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center px-3 py-3 transition-colors ${
                    isActive("/dashboard/settings")
                      ? "text-sky-400 bg-slate-900"
                      : "text-slate-200 hover:bg-slate-900"
                  } rounded-lg`}
                >
                  <Settings
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/settings") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/settings")
                      ? "font-medium text-sky-400"
                        : ""
                    }
                  >
                    Settings
                  </span>
                </Link>

                <div
                  role="presentation"
                  onClick={() => {
                    clearCart()
                    logout();
                    router.push("/");
                  }}
                  className="flex cursor-pointer items-center px-3 py-3 text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Log out</span>
                </div>
              </nav>
            </div>
          </div>

          {/* Page Content */}
          <div className="md:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
