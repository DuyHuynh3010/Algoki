"use client";

import React from "react";
import { Table } from "antd";
import { useAttemptsTeacher } from "@/hooks/queries/dashboard/useTeacher";
import { useAuthStore } from "@/store/slices/auth.slice";
import { formatDateToCustomString } from "@/until";
import './custom-table.css'

function TestPage() {
  const { user, isTeacher } = useAuthStore.getState();
  const { data: teacherAttemptsData } = useAttemptsTeacher(
    user?.id || "",
    isTeacher,
  );

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
  const columns = [
    {
      title: "Assessment",
      dataIndex: "courseTitle",
      key: "courseTitle",
      render: (_: any, record: any) => (
        <div>
          <div className="text-[#212B36] text-[14px]">{record.courseTitle}</div>
          <div className="text-xs text-secondary mt-1">
            Learner:{" "}
            <span className="font-medium text-[#222]">
              {record.nameLearner}
            </span>
          </div>
          <div className="text-xs text-secondary">
            {formatDateToCustomString(record.passedAt)}
          </div>
        </div>
      ),
    },
    {
      title: "Questions",
      dataIndex: "totalAnswer",
      key: "totalAnswer",
      align: "center" as const,
      width: 200,
      render: (qus: any) => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          {qus}
        </div>
      ),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      align: "center" as const,
      width: 80,
      render: (tm: any) => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          {tm}
        </div>
      ),
    },
    {
      title: "Correct",
      dataIndex: "correctAnswer",
      key: "correctAnswer",
      align: "center" as const,
      width: 80,
      render: (ca: any) => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          {ca}
        </div>
      ),
    },
    {
      title: "Result",
      dataIndex: "isPassed",
      key: "isPassed",
      align: "center" as const,
      width: 100,
      render: (result: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {renderResultBadge(result.isPassed ? "Pass" : "Fail")}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6  rounded-2xl box-shadow-page">
      <div className="max-w-5xl mx-auto">
        <div className="font-bold text-[20px] mb-6 text-white">
          Tests
        </div>
        <div className="bg-[#1F2937] rounded-xl overflow-hidden border border-[#4B5563] mt-8">
          <Table
            dataSource={teacherAttemptsData?.data ?? []}
            columns={columns}
            pagination={false}
            rowClassName={() => "!bg-[#1F2937] hover:!bg-[#2C3644]"}
            className="custom-ant-table"
          />
        </div>
      </div>
    </div>
  );
}

export default TestPage;
