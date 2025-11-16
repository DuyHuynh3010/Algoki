import {
    LessonFormData,
    lessonSchema,
} from "@/app/(admin)/create-courses/create/schemas";
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
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import {
    useCreateLessonArticle,
    useCreateLessonVideo, useGetLessonById,
    useUpdateLessonArticle,
    useUpdateLessonVideo,
} from "@/hooks/queries/course/useLessonCourse";
import { useUploadFile } from "@/hooks/queries/course/useUploadFile";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircle } from "iconsax-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ToggleSwitch from "../ToggleSwitch";
import './index.css';

interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const CreateLessonModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateLessonModalProps) => {
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const { courseData, lessonSelected, moduleSelected } =
    useCreateCourseContext();
  const isEdit = Boolean(lessonSelected?.id);

  const { data: initValue, refetch } = useGetLessonById(courseData?.id as string, moduleSelected?.id as string, lessonSelected?.id as string)

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lessonSelected?.title || "",
      description: lessonSelected?.description || "",
      type: lessonSelected?.type || "VIDEO",
      videoUrl: lessonSelected?.videoUrl || null,
      duration: lessonSelected?.duration || 0,
      htmlContent: lessonSelected?.htmlContent || "",
      sampleImageUrl: lessonSelected?.sampleImageUrl || "",
      attachmentUrl: null,
      isPreviewable: lessonSelected?.isPreviewable || true,
    },
  });

  useEffect(() => {
    if (lessonSelected) {
      form.reset(initValue);
      setAttachmentFile(null);
    } else {
      form.reset({
        title: "",
        description: "",
        type: "VIDEO",
        videoUrl: null,
        duration: undefined,
        htmlContent: "",
        sampleImageUrl: "",
        attachmentUrl: null,
        isPreviewable: true,
      });
    }
  }, [lessonSelected, initValue]);

  const handleClose = () => {
    setAttachmentFile(null);
    form.reset();
    onClose();
  };

  const createLessonVideo = useCreateLessonVideo(
    courseData?.id as string,
    moduleSelected?.id as string,
  );
  const updateLessonVideo = useUpdateLessonVideo(
    courseData?.id as string,
    moduleSelected?.id as string,
    lessonSelected?.id as string,
  );
  const createLessonArticle = useCreateLessonArticle(
    courseData?.id as string,
    moduleSelected?.id as string,
  );
  const updateLessonArticle = useUpdateLessonArticle(
    courseData?.id as string,
    moduleSelected?.id as string,
    lessonSelected?.id as string,
  );
  const handleCreateLesson = (data: LessonFormData) => {
    if (lessonType === "VIDEO") {
      const formData = {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        duration: Number(data.duration),
        attachmentUrl: data.attachmentUrl,
        sampleImageUrl: data.sampleImageUrl,
        isPreviewable: data.isPreviewable,
      };
      if (isEdit) {
        updateLessonVideo.mutate(formData as any, {
          onSuccess: () => {
            form.reset();
            onSubmit();
            refetch();
            onClose();
          },
        });
        return;
      }
      createLessonVideo.mutate(formData as any, {
        onSuccess: () => {
          form.reset();
          onSubmit();
          onClose();
        },
      });
    } else {
      const formData = {
        title: data.title,
        description: data.description,
        htmlContent: data.htmlContent,
        sampleImageUrl: data.sampleImageUrl,
        duration: Number(data.duration),
      };
      if (isEdit) {
        updateLessonArticle.mutate(formData, {
          onSuccess: () => {
            form.reset();
            onSubmit();
            onClose();
          },
        });
        return;
      }
      createLessonArticle.mutate(formData, {
        onSuccess: () => {
          onSubmit();
          onClose();
          form.reset();
        },
      });
    }
  };
  const lessonType = form.watch("type");

  const { uploadFile } = useUploadFile();

  const handleUploadFile = (file: File, field: any) => {
    const formData = new FormData();
    formData.append("file", file);
    uploadFile.mutate(formData, {
      onSuccess: (response) => {
        field.onChange(response.url); // Assuming the API returns the file URL
      },
      onError: (error) => {
        console.error("Error uploading file:", error);
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-slate-900 text-slate-50 p-0 rounded-lg max-h-[90vh] overflow-y-auto border border-slate-700">
        <DialogHeader className="p-6 pb-4 border-b border-slate-800 text-left">
          <DialogTitle className="text-lg text-left font-medium text-slate-50">
            Add lesson
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateLesson)}
            className="p-6 space-y-5"
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
            {/* Lesson type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Lesson type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="border-slate-700 bg-slate-950 text-slate-100 focus:border-sky-500 focus:ring-sky-500">
                        <SelectValue placeholder="Select lesson type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 text-slate-100 border-slate-700">
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="ARTICLE">Article</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Summary */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Summary</FormLabel>
                  <FormControl>
                    <CKEditorWrapper
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Summary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Content */}
            {lessonType === "ARTICLE" && (
              <FormField
                control={form.control}
                name="htmlContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Content</FormLabel>
                    <FormControl>
                      <CKEditorWrapper
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Write something..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Thumbnail */}
            <FormField
              control={form.control}
              name="sampleImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-200">
                    Thumbnail
                  </FormLabel>
                  <FormControl>
                    <div
                      className="border-2 border-dashed bg-slate-900 border-slate-700 rounded-lg p-8 text-center hover:border-slate-500 transition-colors cursor-pointer"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      {!field?.value ? (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Image
                              width={64}
                              height={64}
                              alt="image"
                              src="/images/upload.png"
                            />
                          </div>
                          <h3 className="text-lg font-medium text-slate-50 mb-2">
                            Drop or select a file
                          </h3>
                          <p className="text-sm text-slate-400 mb-4">
                            Drop files here or click to{" "}
                            <span className="text-sky-400 hover:underline cursor-pointer">
                          browse
                        </span>{" "}
                            from your computer
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Image
                            src={field?.value}
                            alt="Thumbnail Preview"
                            width={1000}
                            height={600}
                            className="rounded-lg mb-4"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(null);
                              if (thumbnailInputRef.current) {
                                thumbnailInputRef.current.value = "";
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                      {uploadFile.isPending ? (
                        <div>Loading...</div>
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          ref={thumbnailInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleUploadFile(file, field);
                            }
                          }}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                      )}
                    </div>
                  </FormControl>
                  <p className="text-xs text-slate-400">
                    <span className="font-medium">Dimensions:</span> 700x430 pixels,{" "}
                    <span className="font-medium">Supported files:</span> JPG, JPEG, PNG,
                    GIF, WEBP
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Duration
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="00"
                        className="h-10 border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                        {...field}
                        value={field.value || undefined}
                        onChange={(event) => {
                          field.onChange(Number(event.target.value));
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-slate-400 flex items-center">
                      <InfoCircle
                        variant="Bold"
                        size={16}
                        color="#94a3b8"
                      />
                      <span className="ml-1">Hours</span>
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Add video URL */}
            {lessonType === "VIDEO" && (
              <>

                <FormField control={form.control} name="videoUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Add your video URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://youtube.com/..."
                        className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                        {...field as any}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-slate-400 mt-1">
                      Example:{" "}
                      <span className="text-sky-400 underline">
                          https://www.youtube.com/watch?v=your-video-id
                        </span>
                    </p>
                  </FormItem>
                )}/>
                {/* Video playback duration */}

                {/* Attachment */}
                <FormField
                  control={form.control}
                  name="attachmentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-200">
                        Upload attachment
                      </FormLabel>
                      <FormControl>
                        <div
                          className="border-2 border-dashed bg-slate-900 border-slate-700 rounded-lg p-8 text-center hover:border-slate-500 transition-colors cursor-pointer"
                          onClick={() => attachmentInputRef.current?.click()}
                        >
                          {!field?.value ? (
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Image
                                  width={64}
                                  height={64}
                                  alt="file"
                                  src="/images/upload.png"
                                />
                              </div>
                              <h3 className="text-lg font-medium text-slate-50 mb-2">
                                Drop or select a file
                              </h3>
                              <p className="text-sm text-slate-400 mb-4">
                                Drop files here or click to{" "}
                                <span className="text-sky-400 hover:underline cursor-pointer">
                                  browse
                                </span>{" "}
                                from your computer
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <p className="text-sm text-slate-400 mb-2">
                                {attachmentFile?.name}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
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
                            accept="/*"
                            ref={attachmentInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setAttachmentFile(file);
                                handleUploadFile(file,  field)
                              }
                            }}
                            className="hidden"
                            id="attachment-upload"
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-slate-400">
                        <span className="font-medium">Maximum size:</span>{" "}
                        100MB. <span className="font-medium">Supported:</span> PDF,
                        ZIP, RAR
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Enable course preview */}
                <FormField
                  control={form.control}
                  name="isPreviewable"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <ToggleSwitch
                          value={field.value || false}
                          onChange={field.onChange}
                          color="green"
                        />
                      </FormControl>
                      <FormLabel className="text-slate-200">
                        Enable course preview
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
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
                disabled={uploadFile.isPending}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950"
              >
                Save lesson
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
