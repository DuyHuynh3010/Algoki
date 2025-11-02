"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  useApprovedOrder,
  useGetOrdersTeacher,
  useRejectOrder,
} from "@/hooks/queries/order/useOrder";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Pagination } from "antd";
import { CloseCircle, TickCircle } from "iconsax-react";

function PurchaseApprovePage() {
  const { data, isLoading, error } = useGetOrdersTeacher();
  const apprevedCart = useApprovedOrder();
  const rejectOrder = useRejectOrder();

  // Frontend pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalItems = data?.length ?? 0;
  const paginatedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  console.log("paginatedData----", data?.length);

  const handleAccept = (orderID: string) => {
    console.log("handleAccept", orderID);
    apprevedCart.mutate(orderID);
  };

  const handleReject = (orderID: string) => {
    rejectOrder.mutate(orderID);
    console.log("handleReject", orderID);
  };

  const renderNameStatusBadge = useCallback(
    (status: "pending" | "completed" | "failed") => {
      switch (status) {
        case "completed":
          return "Thành công";
        case "pending":
          return "Đang chờ";
        case "failed":
          return "Thất bại";
        default:
          return;
      }
    },
    [],
  );

  const renderStatusBadge = (status: "pending" | "completed" | "failed") => {
    const statusConfig = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${statusConfig[status]}`}
      >
        {renderNameStatusBadge(status)}
      </span>
    );
  };

  return (
    <div className="bg-white shadow h-max p-6 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">Phê duyệt đơn hàng</h2>

      {(isLoading || apprevedCart.isPending || rejectOrder.isPending) && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Đang tải đơn hàng...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-red-500">
          Không thể tải dữ liệu.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-2 text-gray-600 font-medium">
                ID
              </th>
              <th className="text-left py-4 px-2 text-gray-600 font-medium">
                Khóa học
              </th>
              <th className="text-left py-4 px-2 text-gray-600 font-medium">
                Ngày
              </th>
              <th className="text-left py-4 px-2 text-gray-600 font-medium">
                Giá
              </th>
              <th className="text-center py-4 px-2 text-gray-600 font-medium">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((order) => (
              <tr key={order.id} className="border-b border-gray-100">
                <td className="py-6 px-2">
                  <span className="text-gray-900 font-medium">
                    #{order.id.split("-")[0]}
                  </span>
                </td>
                <td className="py-6 px-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-gray-900 font-medium">
                      {index + 1}: {item?.product?.title}
                    </div>
                  ))}
                </td>
                <td className="py-6 px-2">
                  <div>
                    <div className="text-gray-900">
                      {dayjs(order?.createdAt, "YYYY-MM-DDTHH:mm:ssZ").format(
                        "DD/MM/YYYY",
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {dayjs(order?.createdAt, "YYYY-MM-DDTHH:mm:ssZ").format(
                        "HH:mm",
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-6 px-2">
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(order?.payment?.amount)}đ
                  </span>
                </td>
                <td className="py-6 px-2 text-center flex items-center gap-4 justify-center">
                  {order?.payment?.status !== "pending" ? (
                    renderStatusBadge(order?.payment?.status)
                  ) : (
                    <div className="py-6 px-2 text-center flex items-center gap-4 justify-center">
                      <div
                        className="cursor-pointer"
                        onClick={() => handleAccept(order.id)}
                      >
                        <TickCircle size="32" color="#16A1FF" />
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => handleReject(order.id)}
                      >
                        <CloseCircle size="32" color="red" />
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {data?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có khóa học nào chờ phê duyệt</p>
        </div>
      )}

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-6 flex justify-end">
          <Pagination
            total={totalItems}
            current={currentPage}
            pageSize={pageSize}
            showSizeChanger
            pageSizeOptions={[5, 10, 20, 50]}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total}`}
          />
        </div>
      )}
    </div>
  );
}

export default PurchaseApprovePage;
