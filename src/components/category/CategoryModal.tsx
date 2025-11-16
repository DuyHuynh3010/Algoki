"use client";

import { ICreateCategoryRequest, IUpdateCategoryRequest } from "@/api/endpoints/category.api";
import { ICategory } from "@/api/types/category";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";

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
      <DialogContent className="w-full max-w-2xl bg-slate-900 text-slate-50 border border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-left text-xl text-slate-50">
            {mode === "create" ? "Add category" : "Edit category"}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Title
            </label>
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Permalink */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Permalink
            </label>
            <Input
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              required
            />
            <div className="mt-2 text-sm text-slate-400">
              Preview:{" "}
              <a
                href={`https://example.com/${formData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline"
              >
                https://example.com/{formData.slug}
              </a>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Description
            </label>
            <Textarea
              placeholder="Short description"
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
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors"
            >
              <div className="text-slate-200 font-semibold text-sm">
                Cancel
              </div>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:bg-slate-600 border border-sky-600 transition-colors"
            >
              <div className="text-white font-semibold text-sm">
                {isLoading ? "Processing..." : mode === "create" ? "Add category" : "Update"}
              </div>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
