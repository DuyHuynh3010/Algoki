"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/slices/auth.slice";
import { formatDateToCustomString } from "@/until";
import { useTeacher } from "@/hooks/queries/dashboard/useTeacher";
import { useStudent } from "@/hooks/queries/dashboard/useStudent";

function ProfilePage() {
  const { user, isTeacher } = useAuthStore.getState();
  const { data } = useStudent(user?.id || "", !isTeacher);


  const { data: teacherData } = useTeacher(user?.id || "");

  return (
    <Card className="bg-white border-0 rounded-xl shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Hồ sơ</h2>
        {!data && !teacherData && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Đang tải hồ sơ...</span>
          </div>
        )}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-2">
              <label className="block text-gray-500">Ngày đăng ký</label>
              <div className="text-gray-800 font-medium">
                {data?.data?.auditInfo?.createdAt ||
                teacherData?.data?.auditInfo?.createdAt
                  ? formatDateToCustomString(
                      data?.data?.auditInfo?.createdAt ??
                        (teacherData?.data?.auditInfo?.createdAt as string),
                    )
                  : "Chưa có thông tin"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-500">Họ & tên</label>
              <div className="text-gray-800 font-medium">{user?.fullName}</div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-500">Tên người dùng</label>
              <div className="text-gray-800 font-medium">{user?.username}</div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-500">Email</label>
              <div className="text-gray-800 font-medium">{user?.email}</div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-500">Số điện thoại</label>
              <div className="text-gray-800 font-medium">
                {teacherData?.data.phoneNumber ?? data?.data?.phoneNumber ?? "Chưa có thông tin"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-500">Kỹ năng/Nghề nghiệp</label>
              <div className="text-gray-800 font-medium">
                {teacherData?.data.skill ?? data?.data?.skill ?? "Chưa có thông tin"}
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-gray-500">Giới thiệu</label>
              <div className="text-gray-800">
                {teacherData?.data?.bio ?? data?.data?.bio ?? "Chưa có thông tin"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfilePage;
