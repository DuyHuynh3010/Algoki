import CKEditorWrapper from "@/components/courses/editor/CKEditorWrapper";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircle } from "iconsax-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const uploadAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["document"]),
  content: z.string().min(1, "Content is required"),
  attachment: z
    .any()
    .refine((file) => !file || (file && file.size <= 10 * 1024 * 1024), {
      message: "Maximum file size is 10MB",
    }),
  duration: z.string().min(1, "Please enter a maximum duration"),
  durationUnit: z.enum(["hour"]),
  passScore: z.string().min(1, "Please enter a passing score"),
});
type UploadAssignmentFormData = z.infer<typeof uploadAssignmentSchema>;

interface UploadArticleAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UploadAssignmentFormData) => void;
}

export const UploadArticleAssignment = ({
  isOpen,
  onClose,
  onSubmit,
}: UploadArticleAssignmentProps) => {
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UploadAssignmentFormData>({
    resolver: zodResolver(uploadAssignmentSchema),
    defaultValues: {
      title: "",
      type: "document",
      content: "",
      attachment: undefined,
      duration: "00",
      durationUnit: "hour",
      passScore: "50",
    },
  });

  const handleClose = () => {
    setAttachmentFile(null);
    form.reset();
    onClose();
  };

  const handleSubmit = (data: UploadAssignmentFormData) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:w-[90vw] sm:max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[70vw] lg:max-w-[70vw] xl:w-[600px] xl:max-w-[600px] bg-slate-900 text-slate-50 p-0 rounded-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-4 border border-slate-700">
        <DialogHeader className="p-4 sm:p-6 pb-4 border-b border-slate-800 text-left">
          <DialogTitle className="text-base sm:text-lg text-left font-medium text-slate-50">
            Add assignment
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="p-4 sm:p-6 space-y-4 sm:space-y-5"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Assignment type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Assignment type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled
                    >
                      <SelectTrigger className="h-12 border-slate-700 bg-slate-950 text-slate-100">
                        <SelectValue placeholder="Upload document" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 text-slate-100 border-slate-700">
                        <SelectItem value="document">
                          Upload document
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Content</FormLabel>
                  <FormControl>
                      <CKEditorWrapper
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write something..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Upload attachment */}
            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-200">
                    Upload attachment
                  </FormLabel>
                  <FormControl>
                    <div
                      className="border-2 border-dashed bg-slate-900 border-slate-700 rounded-lg p-4 sm:p-8 text-center hover:border-slate-500 transition-colors cursor-pointer"
                      onClick={() => attachmentInputRef.current?.click()}
                    >
                      {!attachmentFile ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-800 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                            <Image
                              width={48}
                              height={48}
                              className="sm:w-16 sm:h-16"
                              alt="file"
                              src="/images/upload.png"
                            />
                          </div>
                          <h3 className="text-sm sm:text-lg font-medium text-slate-50 mb-2">
                            Drop or select a file
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 px-2">
                            Drop files here or click to{" "}
                            <span className="text-sky-400 hover:underline cursor-pointer">
                              browse
                            </span>{" "}
                            from your computer
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="text-xs sm:text-sm text-slate-400 mb-2 break-all px-2">
                            {attachmentFile.name}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className="text-xs sm:text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAttachmentFile(null);
                              field.onChange(null);
                              if (attachmentInputRef.current) {
                                attachmentInputRef.current.value = "";
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept=".pdf,.zip,.rar"
                        ref={attachmentInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAttachmentFile(file);
                            field.onChange(file);
                          }
                        }}
                        className="hidden"
                        id="attachment-upload"
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-slate-400 gap-1 mt-2 flex items-center">
                    <InfoCircle variant="Bold" size={16} color="#94a3b8" />
                    <span className="font-medium">Size:</span> 10MB.{" "}
                    <span className="font-medium">Supported files:</span> PDF, ZIP,
                    RAR
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Maximum duration */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Maximum duration</FormLabel>
                      <FormControl>
                        <Input placeholder="00" className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="opacity-0 sm:opacity-0">Hidden</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-12 border-slate-700 bg-slate-950 text-slate-100">
                            <SelectValue placeholder="Hours" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 text-slate-100 border-slate-700">
                            <SelectItem value="hour">Hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-xs mt-2 text-slate-400 flex items-center">
                <InfoCircle variant="Bold" size={16} color="#94a3b8" />
                <span className="ml-1">
                  Maximum time limit for submission.
                </span>
              </p>
            </div>
            {/* Passing score */}
            <FormField
              control={form.control}
              name="passScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Passing score (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="50" className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500" {...field} />
                  </FormControl>
                  <FormMessage />

                  <p className="text-xs text-slate-400 flex items-center">
                    <InfoCircle variant="Bold" size={16} color="#94a3b8" />
                    <span className="ml-1">
                      Minimum score students need to pass this assignment.
                    </span>
                  </p>
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                size="sm"
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs sm:text-sm border border-slate-600"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm"
              >
                Add assignment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
