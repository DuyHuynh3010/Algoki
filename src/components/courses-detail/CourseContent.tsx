import React from "react";
import { ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/slices/auth.slice";
import toast from "react-hot-toast";

interface Module {
  title: string;
  id: string;
  lessons?: {
    id: string;
  }[];
}

interface CourseContentProps {
  moduleData?: {
    data?: Module[];
  };
  slug?: string;
  enrolled: boolean
}

export const CourseContent: React.FC<CourseContentProps> = ({ moduleData, slug, enrolled }) => {
  const router = useRouter();
  const user = useAuthStore.getState().user

  return (
    <div className="bg-paper p-6 rounded-lg shadow mb-8">
      <h3 className="text-xl font-bold mb-6">Course content</h3>
      <div className="space-y-2">
        {moduleData?.data && moduleData.data?.length > 0 ? (
          moduleData.data.map((item) => (
            <div
              role="presentation"
              className="p-4 rounded-lg bg-neutural-12 cursor-pointer"
              key={item.id}
              onClick={() => {
                if (user) {
                  if (enrolled) {
                    router.push(
                      `/lesson?course=${slug}&module=${item.id}&lesson=${item?.lessons?.[0]?.id}`,
                    );
                  } else {
                    toast.error("Please purchase the course to continue.");
                  }
                } else {
                  router.push('/login')
                }
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{item.title}</h4>
                  <div className="bg-[#919EAB29] p-1 rounded">
                    <span className="text-sm text-secondary font-semibold">
                      1h 12m
                    </span>
                  </div>
                </div>
                <ArrowRight2 size="24" color="white" />
              </div>
            </div>
          ))
        ) : (
          <div>No lessons available yet.</div>
        )}
      </div>
    </div>
  );
}; 