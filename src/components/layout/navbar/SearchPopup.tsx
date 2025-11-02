import React, { useState, useEffect } from "react";
import { SearchNormal1 } from "iconsax-react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCourses } from "@/hooks/queries/course/useCourses";
import { CourseFilters } from "@/api/types/course.type";
import { useRouter } from "next/navigation";
import _ from "lodash";

interface ISearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function SearchPopup({ open, setOpen }: ISearchProps) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  // Debounce search input
  const debouncedSetSearch = _.debounce((value: string) => {
    setDebouncedSearch(value);
  }, 500);

  useEffect(() => {
    debouncedSetSearch(searchValue);
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [searchValue, debouncedSetSearch]);

  // Prepare filters for API call
  const filters: CourseFilters = {
    search: debouncedSearch.trim() || undefined,
  };

  // Only fetch when there's a search term
  const { data: coursesData, isLoading, error } = useCourses(
    debouncedSearch.trim() ? filters : undefined
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleCourseClick = (slug: string) => {
    setOpen(false);
    router.push(`/course/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent showCloseButton={false} className="w-[600px] max-w-[90vw]">
        <div className="flex items-center gap-2">
          <SearchNormal1 size="24" color="#9F9FA9" />
          <Input
            className="border-0 shadow-none flex-1"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Bạn muốn tìm gì?"
            autoFocus
          />
          <DialogClose className="text-[13px] text-text-primary right-4 px-2 py-1 rounded-lg bg-zinc-100">
            ESC
          </DialogClose>
        </div>
        
        <div className="max-h-[70vh] lg:max-h-[50vh] overflow-y-auto mt-4">
          {!debouncedSearch.trim() ? (
            <div className="text-center py-8 text-gray-500">
              <SearchNormal1 size="48" color="#9F9FA9" className="mx-auto mb-2" />
              <p>Nhập từ khóa để tìm kiếm khóa học</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin text-gray-400" size={24} />
              <span className="ml-2 text-gray-500">Đang tìm kiếm...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Có lỗi xảy ra khi tìm kiếm</p>
              <p className="text-gray-500 text-sm">Vui lòng thử lại sau</p>
            </div>
          ) : coursesData?.data && coursesData.data.length > 0 ? (
            <div className="space-y-3">
              {coursesData.data.map((course) => (
                <div
                  key={course.id}
                  className="cursor-pointer hover:bg-gray-50 rounded-lg p-3 transition-colors"
                  onClick={() => handleCourseClick(course.slug)}
                >
                  <h4 className="font-medium text-sm line-clamp-2">
                    {course.title}
                  </h4>
                </div>
              ))}
              {coursesData.meta.total > coursesData.data.length && (
                <div className="text-center pt-3 border-t">
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push(`/course-category?search=${encodeURIComponent(debouncedSearch)}`);
                    }}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Xem tất cả {coursesData.meta.total} kết quả
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">Không tìm thấy khóa học nào</p>
              <p className="text-gray-400 text-sm">
                Thử tìm kiếm với từ khóa khác
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchPopup;
