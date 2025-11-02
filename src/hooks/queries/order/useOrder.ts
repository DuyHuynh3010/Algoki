import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderAPI } from "@/api/endpoints/order.api";
import toast from "react-hot-toast";

// 0. Hook lấy danh sách orders
export const useGetOrders = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderAPI.getOrders(),
    staleTime: 5 * 60 * 1000, // 5 phút
    enabled: enabled,
  });
};

export const useGetOrdersTeacher = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["orders-teacher"],
    queryFn: () => orderAPI.getOrdersTeacher(),
    staleTime: 5 * 60 * 1000, // 5 phút
    enabled: enabled,
  });
};

// 1. Hook lấy chi tiết order theo ID
export const useGetOrderById = (orderId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderAPI.getOrderById(orderId),
    staleTime: 5 * 60 * 1000, // 5 phút
    enabled: enabled && !!orderId,
  });
};

// 2. Hook tạo order mới
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (data: any) => orderAPI.createOrder(data),
    onSuccess: (data) => {
      console.log("Order created successfully:", data);
      toast.success("Tạo đơn hàng thành công!");
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
    },
  });
};

export const useApprovedOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderAPI.approvedOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-teacher"] });
      toast.success("Duyệt hàng thành công!");
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi duyệt đơn hàng!");
    },
  });
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: any) => orderAPI.rejectOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-teacher"] });
      toast.success("Từ chối đơn hàng thành công!");
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi từ chối đơn hàng!");
    },
  });
};

// 3. Hook cập nhật order
export const useUpdateOrder = () => {
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: any }) => 
      orderAPI.updateOrder(orderId, data),
    onSuccess: (data) => {
      console.log("Order updated successfully:", data);
      toast.success("Cập nhật đơn hàng thành công!");
    },
    onError: (error) => {
      console.error("Error updating order:", error);
      toast.error("Có lỗi xảy ra khi cập nhật đơn hàng!");
    },
  });
};

// 4. Hook xóa order
export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: (orderId: string) => orderAPI.deleteOrder(orderId),
    onSuccess: (data) => {
      console.log("Order deleted successfully:", data);
      toast.success("Xóa đơn hàng thành công!");
    },
    onError: (error) => {
      console.error("Error deleting order:", error);
      toast.error("Có lỗi xảy ra khi xóa đơn hàng!");
    },
  });
};
