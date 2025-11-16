import {
  ModuleCourseFormData,
  moduleCourseSchema,
} from "@/app/(admin)/create-courses/create/schemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import {
  useCreateModule,
  useUpdateModule,
} from "@/hooks/queries/course/useModuleCourse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChapter: () => void;
}

export default function AddChapterModal({
  isOpen,
  onClose,
  onAddChapter,
}: AddChapterModalProps) {
  const { moduleSelected, courseData } = useCreateCourseContext();
  const isEdit = Boolean(moduleSelected?.id);
  const createModule = useCreateModule(courseData?.id as string);
  const updateModule = useUpdateModule(
    courseData?.id as string,
    moduleSelected?.id as string,
  );
  const form = useForm<ModuleCourseFormData>({
    resolver: zodResolver(moduleCourseSchema),
    defaultValues: {
      title: moduleSelected?.title || "",
      shortDescription: moduleSelected?.shortDescription || "",
    },
  });

  useEffect(() => {
    if (moduleSelected) {
      form.reset(moduleSelected);
    } else {
      form.reset({
        title: "",
        shortDescription: "",
      });
    }
  }, [moduleSelected]);

  const onSubmit = (value: ModuleCourseFormData) => {
    if (isEdit) {
      updateModule.mutate(value, {
        onSuccess: () => {
          onAddChapter();
          handleClose();
        },
        onError: (error) => {
          console.error("Error updating chapter:", error);
        },
      });
      return;
    }
    createModule.mutate(value, {
      onSuccess: () => {
        onAddChapter();
        handleClose();
      },
      onError: (error) => {
        console.error("Error creating chapter:", error);
      },
    });
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[580px] bg-slate-900 text-slate-50 p-0 rounded-lg border border-slate-700">
        <DialogHeader className="p-6 pb-4 border-b border-slate-800 text-left">
          <DialogTitle className="text-lg text-left font-medium text-slate-50">
            Add module
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-6 space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        className="h-12 border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Summary"
                        className="min-h-[120px] border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t border-slate-800">
              <Button
                type="button"
                size="sm"
                onClick={handleClose}
                className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-sky-500 hover:bg-sky-400 text-slate-950"
              >
                Add module
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}