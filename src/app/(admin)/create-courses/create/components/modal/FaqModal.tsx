import { FAQ } from "@/api/types/course.type";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import { useCreateFAQ, useUpdateFAQ } from "@/hooks/queries/course/useFaqs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema validation for the FAQ form
const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

type FaqFormData = z.infer<typeof faqSchema>;

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  initData?: FAQ
}

export const FaqModal = ({ isOpen, onClose, initData }: FaqModalProps) => {
  const form = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });
  const { courseData } = useCreateCourseContext();

  useEffect(() => {
    form.reset({
      question: initData?.question || "",
      answer: initData?.answer || "",
    })
  }, [initData]);

  const createFaq = useCreateFAQ(courseData?.id as string);
  const updateFaq = useUpdateFAQ(courseData?.id as string, initData?.id as string);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (value: FaqFormData) => {
    handleClose();
    if(initData) {
      updateFaq.mutate(value);
      return;
    }
    createFaq.mutate(value);

  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 text-slate-50 p-0 rounded-lg max-h-[90vh] overflow-y-auto border border-slate-700">
        <DialogHeader className="p-6 pb-4 border-b border-slate-800 text-left">
          <DialogTitle className="text-lg text-left font-medium text-slate-50">
            {initData?.id ? "Edit FAQ" : "Add FAQ"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="p-6 space-y-5"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/* Question */}
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a question..." className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Answer */}
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter an answer..."
                      className="min-h-[120px] border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="mr-2 border-slate-600 text-slate-100 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button type="submit" className="text-slate-950 bg-sky-500 hover:bg-sky-400">
                {initData?.id ? "Save changes" : "Add FAQ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
