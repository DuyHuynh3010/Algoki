import api from "@/api/api";
import { ICategory } from "@/api/types/category";
import { IParamsRequest } from "@/api/interface/api.request.interface";

export interface ICreateCategoryRequest {
  title: string;
  shortDescription: string;
  slug: string;
}

export interface IUpdateCategoryRequest {
  title?: string;
  shortDescription?: string;
  slug?: string;
}

export const categoryAPI = {
  getListCategory: async ({
    limit = 100, // Default limit if not provided
  }: IParamsRequest): Promise<ICategory[]> => {
    const { data } = await api.get(`/categories`, {
      params: {
        limit,
      },
    });
    return data;
  },

  createCategory: async (data: ICreateCategoryRequest): Promise<ICategory> => {
    const response = await api.post(`/cms/categories`, data);
    return response.data;
  },

  updateCategory: async (id: string, data: IUpdateCategoryRequest): Promise<ICategory> => {
    const response = await api.patch(`/cms/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/cms/categories/${id}`);
  },
};