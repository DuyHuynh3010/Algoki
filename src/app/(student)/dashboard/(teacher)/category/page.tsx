"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "antd";
import "antd/dist/reset.css";
import { Edit, Trash } from "iconsax-react";
import { useCategory, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/queries/category/useCategory";
import CategoryModal from "@/components/category/CategoryModal";
import { ICategory } from "@/api/types/category";
import { ICreateCategoryRequest, IUpdateCategoryRequest } from "@/api/endpoints/category.api";

function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function CategoryPage() {
  const { data: categories } = useCategory();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<ICategory | undefined>();

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: ICategory) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(undefined);
  };

  const handleSubmit = (data: ICreateCategoryRequest | IUpdateCategoryRequest) => {
    if (modalMode === "create") {
      createCategory.mutate(data as ICreateCategoryRequest, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    } else {
      if (selectedCategory) {
        // For edit, send data directly to API
        updateCategory.mutate(
          { id: selectedCategory.id, data: data as IUpdateCategoryRequest },
          {
            onSuccess: () => {
              handleCloseModal();
            },
          }
        );
      }
    }
  };

  const handleDelete = (category: ICategory) => {
    deleteCategory.mutate(category.id);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      render: (_: any, record: any) => (
        <div>
          <div className="font-semibold text-[#222] text-[15px]">
            {record.title}
          </div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 180,
      render: (_: any, record: any) => (
        <div>
          <div className="font-medium text-[15px] text-[#222]">
            {formatDate(record.createdAt)}
          </div>
        </div>
      ),
    },
    {
      title: "Courses",
      dataIndex: "order",
      key: "order",
      render: (_: any, record: any) => (
        <div>
          <div className="font-semibold text-[#222] text-[15px]">
            {record.order}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => (
        <div>
          {record.status === "PUBLISHED" ? (
            <div className="px-2 rounded bg-[#4CAF5029] text-[#388E3C] w-max text-sm font-semibold">
              Published
            </div>
          ) : (
            <div className="px-2 rounded bg-[#919EAB29] text-[#637381] w-max text-sm font-semibold">
              Draft
            </div>
          )}
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      width: 80,
      align: "right" as const,
      render: (_: any, record: any) => (
        <div className="flex gap-3 justify-end">
          <button 
            className="p-2 hover:bg-[#F4F6F8] rounded" 
            title="Edit"
            onClick={() => handleOpenEditModal(record)}
          >
            <Edit size={20} color="#16A1FF" />
          </button>
          <button 
            className="p-2 hover:bg-[#F4F6F8] rounded" 
            title="Delete"
            onClick={() => handleDelete(record)}
          >
            <Trash size={20} color="#F44336" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 rounded-2xl box-shadow-page">
      <div className="max-w-5xl mx-auto">
        <div className="font-bold text-[20px] mb-4 text-[#222]">Categories</div>
        
        {/* Box tạo thông báo */}
        <div className="bg-[#F4F6F8] rounded-xl flex flex-col md:flex-row md:items-center md:justify-between px-6 py-5 mb-6">
          <div>
            <div className="font-semibold text-[16px] text-[#222]">
              Create category
            </div>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-[#212B36] hover:bg-[#454F5B] font-semibold text-[14px] h-9 px-6 py-2 rounded-lg text-[#FFFFFF]"
            onClick={handleOpenCreateModal}
          >
            <span className="text-white">Add new category</span>
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-[#E7E9ED] mt-8">
          <Table
            dataSource={categories}
            columns={columns}
            pagination={false}
            rowClassName={() =>
              "!bg-white hover:!bg-[#F4F6F8] border-b border-[#F4F6F8]"
            }
            className="custom-ant-table"
          />
        </div>

        {/* Category Modal */}
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          mode={modalMode}
          category={selectedCategory}
          onSubmit={handleSubmit}
          isLoading={createCategory.isPending || updateCategory.isPending}
        />
      </div>
    </div>
  );
}

export default CategoryPage;
