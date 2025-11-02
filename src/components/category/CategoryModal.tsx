"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ICategory } from "@/api/types/category";
import { ICreateCategoryRequest, IUpdateCategoryRequest } from "@/api/endpoints/category.api";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  category?: ICategory;
  onSubmit: (data: ICreateCategoryRequest | IUpdateCategoryRequest) => void;
  isLoading?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  mode,
  category,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ICreateCategoryRequest>({
    title: "",
    shortDescription: "",
    slug: "",
  });

  useEffect(() => {
    if (category && mode === "edit") {
      setFormData({
        title: category.title,
        shortDescription: category.shortDescription,
        slug: category.slug,
      });
    } else {
      setFormData({
        title: "",
        shortDescription: "",
        slug: "",
      });
    }
  }, [category, mode]);

  const handleInputChange = (field: keyof ICreateCategoryRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from title
    if (field === "title") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      
      setFormData(prev => ({
        ...prev,
        slug: slug,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "edit" && category) {
      // For edit, send only the form data, not wrapped in {id, data}
      onSubmit(formData);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-left text-xl">
            {mode === "create" ? "Thêm danh mục" : "Sửa danh mục"}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề
            </label>
            <Input
              placeholder="Tiêu đề"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Permalink */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Liên kết cố định
            </label>
            <Input
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              required
            />
            <div className="mt-2 text-sm text-gray-500">
              Xem trước:{" "}
              <a
                href={`https://example.com/${formData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://example.com/{formData.slug}
              </a>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <Textarea
              placeholder="Mô tả ngắn"
              value={formData.shortDescription}
              onChange={(e) => handleInputChange("shortDescription", e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Action Buttons */}
          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#F4433629] px-2 py-1 rounded-lg"
            >
              <div className="text-[#D32F2F] font-semibold text-sm">
                Hủy bỏ
              </div>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 px-2 py-1 rounded-lg"
            >
              <div className="text-white font-semibold text-sm">
                {isLoading ? "Đang xử lý..." : mode === "create" ? "Thêm danh mục" : "Cập nhật"}
              </div>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
