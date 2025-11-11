import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {useCreateFAQ, useUpdateFAQ} from "@/hooks/queries/course/useFaqs";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import {FAQ} from "@/api/types/course.type";
import {useEffect} from "react";

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
      <DialogContent className="sm:max-w-[600px] bg-white p-0 rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b border-[#919EAB52] text-left">
          <DialogTitle className="text-lg text-left font-medium text-gray-900">
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
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a question..." {...field} />
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
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter an answer..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button type="submit" className="text-[#FFFFFF]">
                {initData?.id ? "Save changes" : "Add FAQ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
