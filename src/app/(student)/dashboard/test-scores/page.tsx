"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/slices/auth.slice";
import {
  useAttemptsUser,
  useSubmissionUser,
} from "@/hooks/queries/dashboard/useStudent";
import { formatDateToCustomString } from "@/until";

type TabType = "attempts" | "submission";

function TestScoresPage() {
  const { user, isTeacher } = useAuthStore.getState();
  const [activeTab, setActiveTab] = useState<TabType>("attempts");

  const { data: attemptsData, isLoading: isLoadingAttempts } = useAttemptsUser(user?.id || "", !isTeacher);
  const { data: submissionData, isLoading: isLoadingSubmission } = useSubmissionUser(
    user?.id || "",
    !isTeacher,
  );

  console.log("attemptsData", attemptsData);

  const renderResultBadge = (result: "Pass" | "Fail") => {
    const isPass = result === "Pass";
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
          isPass ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
        }`}
      >
        {result}
      </span>
    );
  };

  return (
    <div className="bg-paper shadow h-max p-6 rounded-2xl">
      {activeTab === "attempts" ? (
        <>
          {isLoadingAttempts && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading test scores...</span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 text-gray-600 font-medium">
                    Course
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    Questions
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    Score
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    Correct
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                {attemptsData?.data?.map((test) => (
                  <tr key={test.id} className="border-b border-gray-100">
                    <td className="py-6 px-2">
                      <div>
                        <div className="text-gray-900 font-medium mb-1">
                          {test.courseTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDateToCustomString(test.attemptAt)}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-2 text-center">
                      <span className="text-gray-900 font-medium">
                        {test.totalAnswer}
                      </span>
                    </td>
                    <td className="py-6 px-2 text-center">
                      <span className="text-gray-900 font-medium">
                        {test.score}
                      </span>
                    </td>
                    <td className="py-6 px-2 text-center">
                      <span className="text-gray-900 font-medium">
                        {test.correctAnswer}
                      </span>
                    </td>
                    <td className="py-6 px-2 text-center">
                      {renderResultBadge(test.isPassed ? "Pass" : "Fail")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Empty State */}
          {attemptsData?.data?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven’t completed any tests yet.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {isLoadingSubmission && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading assignments...</span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 text-gray-600 font-medium">
                    Assignment
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    Score
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissionData?.data?.map((test) => (
                  <tr key={test.id} className="border-b border-gray-100">
                    <td className="py-6 px-2">
                      <div>
                        <div className="text-gray-900 font-medium mb-1">
                          {test.lessonName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {test.courseName}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-2 text-center">
                      <span className="text-gray-900 font-medium">
                        {test.score}
                      </span>
                    </td>
                    <td className="py-6 px-2 text-center">
                      {renderResultBadge(test.isPassed ? "Pass" : "Fail")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Empty State */}
          {submissionData?.data?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven’t submitted any assignments yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TestScoresPage;
