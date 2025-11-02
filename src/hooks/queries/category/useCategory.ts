import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryAPI, ICreateCategoryRequest, IUpdateCategoryRequest } from "@/api/endpoints/category.api";
import { ICategory } from "@/api/types/category";
import { IParamsRequest } from "@/api/interface/api.request.interface";
import toast from "react-hot-toast";

export const categoryKeys = {
  all: ["category"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: IParamsRequest) => [...categoryKeys.lists(), filters] as const,
};

export const useCategory = (params?: IParamsRequest) => {
  return useQuery<ICategory[]>({
    queryKey: categoryKeys.list(params || {}),
    queryFn: () => categoryAPI.getListCategory(params || {}),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ICreateCategoryRequest) => categoryAPI.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Tạo danh mục thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo danh mục");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCategoryRequest }) => 
      categoryAPI.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Cập nhật danh mục thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật danh mục");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => categoryAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Xóa danh mục thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa danh mục");
    },
  });
};