import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import React, { useEffect, useMemo, useRef, useState } from "react";
import CKEditorWrapper from "@/components/courses/editor/CKEditorWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { InfoCircle } from "iconsax-react";
import {
  UploadAssignmentFormData,
  uploadAssignmentSchema,
} from "../../../schemas";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import {
  useCreateLessonPractice,
  useGetLessonById,
  useUpdateLessonPractice,
} from "@/hooks/queries/course/useLessonCourse";
import { useUploadFile } from "@/hooks/queries/course/useUploadFile";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";

interface UploadCodeAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UploadAssignmentFormData) => void;
}

export const UploadCodeAssignment = ({
  isOpen,
  onClose,
  onSubmit,
}: UploadCodeAssignmentProps) => {
  const [inputDataFile, setInputDataFile] = useState<File | null>(null);
  const [outputDataFile, setOutputDataFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const inputDataInputRef = useRef<HTMLInputElement>(null);
  const outputDataInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const { courseData, lessonSelected, moduleSelected } =
    useCreateCourseContext();
  const isEdit = Boolean(lessonSelected?.id);
  const { data: initValue, refetch } = useGetLessonById(
    courseData?.id as string,
    moduleSelected?.id as string,
    lessonSelected?.id as string,
  );

  const form = useForm<UploadAssignmentFormData>({
    resolver: zodResolver(uploadAssignmentSchema),
    defaultValues: {
      title: "",
      practiceType: "coding",
      htmlContent: "",
      description: "",
      inputFile: undefined,
      outputFile: undefined,
      suggestion: "",
      sampleContent: "",
      answerContent: "",
      attachmentUrl: undefined,
      passingScore: undefined,
      duration: undefined,
    },
  });

  useEffect(() => {
    if (lessonSelected) {
      form.reset(initValue);
      setInputDataFile(null);
      setOutputDataFile(null);
      setAttachmentFile(null);
    } else {
      form.reset({
        title: "",
        practiceType: "coding",
        language: "JAVA", // Default language
        htmlContent: "",
        description: "",
        inputFile: undefined,
        outputFile: undefined,
        suggestion: "",
        sampleContent: "",
        answerContent: "",
        attachmentUrl: undefined,
        passingScore: undefined,
        duration: undefined,
      });
      setInputDataFile(null);
      setOutputDataFile(null);
      setAttachmentFile(null);
    }
  }, [lessonSelected, initValue]);

  console.log("UploadCodeAssignment render", form.formState.errors);

  const practiceType = form.watch("practiceType");
  const language = form.watch("language");

  const createPractice = useCreateLessonPractice(
    courseData?.id as string,
    moduleSelected?.id as string,
  );
  const updatePractice = useUpdateLessonPractice(
    courseData?.id as string,
    moduleSelected?.id as string,
    lessonSelected?.id as string,
  );

  const handleClose = () => {
    form.reset();
    setInputDataFile(null);
    setOutputDataFile(null);
    setAttachmentFile(null);
    onClose();
  };

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
    });
  };

  const handleSubmit = (data: UploadAssignmentFormData) => {
    const formRequest = {
      ...data,
      attachmentUrl: data.attachmentUrl || "",
      duration: data.duration ? Number(data.duration) : 0,
      passingScore: data.passingScore ? Number(data.passingScore) : 0,
    };
    if (isEdit) {
      updatePractice.mutate(formRequest as any, {
        onSuccess: (res) => {
          refetch();
          onSubmit(res);
          handleClose();
        },
      });
      return;
    }
    createPractice.mutate(formRequest as any, {
      onSuccess: (res) => {
        onSubmit(res);
        handleClose();
      },
    });
  };

  const acceptFiles = useMemo(() => {
    switch (language) {
      case "C++":
        return ".cpp,.h,.txt,.json";
      case "JAVA":
        return ".java,.txt,.json";
      default:
        return ".txt,.json"; // Default for other languages
    }
  }, [language]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:w-[90vw] sm:max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[70vw] lg:max-w-[70vw] xl:w-[60vw] xl:max-w-[60vw] bg-white p-0 rounded-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
        <DialogHeader className="p-4 sm:p-6 pb-4 border-b border-[#919EAB52] text-left">
          <DialogTitle className="text-base sm:text-lg text-left font-medium text-gray-900">
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Assignment type */}
            <FormField
              control={form.control}
              name="practiceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Coding" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coding">Coding</SelectItem>
                        {/*<SelectItem value="upload_file">*/}
                        {/*  Upload document*/}
                        {/*</SelectItem>*/}
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
              name="htmlContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <CKEditorWrapper
                      value={field?.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Write something..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <CKEditorWrapper
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Detailed description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fields cho practiceType = "coding" */}
            {practiceType === "coding" && (
              <>
                {/* Language */}
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="C++">C++</SelectItem>
                            <SelectItem value="JAVA">JAVA</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Input data */}
                <FormField
                  control={form.control}
                  name="inputFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Input data
                      </FormLabel>
                      <FormControl>
                        <div
                          className="border-2 border-dashed bg-[#919EAB]/8 border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                          onClick={() => inputDataInputRef.current?.click()}
                        >
                          {!field.value ? (
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#919EAB]/8 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                <Image
                                  width={48}
                                  height={48}
                                  className="sm:w-16 sm:h-16"
                                  alt="file"
                                  src="/images/upload.png"
                                />
                              </div>
                              <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-2">
                                Drop or select a file
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 px-2">
                                Drop files here or click to{" "}
                                <span className="text-blue-600 hover:underline cursor-pointer">
                                  browse
                                </span>{" "}
                                from your computer
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <p className="text-xs sm:text-sm text-gray-500 mb-2 break-all px-2">
                                {inputDataFile?.name}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                className="text-xs sm:text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInputDataFile(null);
                                  field.onChange(null);
                                  if (inputDataInputRef.current) {
                                    inputDataInputRef.current.value = "";
                                  }
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                          <input
                            type="file"
                            accept={acceptFiles}
                            ref={inputDataInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setInputDataFile(file);
                                handleUploadFile(file, field);
                              }
                            }}
                            className="hidden"
                            id="input-data-upload"
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500 gap-1 mt-2 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="font-medium">
                          Size:
                        </span> 10MB.{" "}
                        <span className="font-medium">Supported files:</span> TXT,
                        JSON
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Output data */}
                <FormField
                  control={form.control}
                  name="outputFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Output data
                      </FormLabel>
                      <FormControl>
                        <div
                          className="border-2 border-dashed bg-[#919EAB]/8 border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                          onClick={() => outputDataInputRef.current?.click()}
                        >
                          {!field.value ? (
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#919EAB]/8 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                <Image
                                  width={48}
                                  height={48}
                                  className="sm:w-16 sm:h-16"
                                  alt="file"
                                  src="/images/upload.png"
                                />
                              </div>
                              <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-2">
                                Drop or select a file
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 px-2">
                                Drop files here or click to{" "}
                                <span className="text-blue-600 hover:underline cursor-pointer">
                                  browse
                                </span>{" "}
                                from your computer
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <p className="text-xs sm:text-sm text-gray-500 mb-2 break-all px-2">
                                {outputDataFile?.name}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                className="text-xs sm:text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOutputDataFile(null);
                                  field.onChange(null);
                                  if (outputDataInputRef.current) {
                                    outputDataInputRef.current.value = "";
                                  }
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                          <input
                            type="file"
                            accept={acceptFiles}
                            ref={outputDataInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setOutputDataFile(file);
                                handleUploadFile(file, field);
                              }
                            }}
                            className="hidden"
                            id="output-data-upload"
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500 gap-1 mt-2 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="font-medium">
                          Size:
                        </span> 10MB.{" "}
                        <span className="font-medium">Supported files:</span> TXT,
                        JSON
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Hint */}
                <FormField
                  control={form.control}
                  name="suggestion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hint</FormLabel>
                      <FormControl>
                        <CKEditorWrapper
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Hint"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sampleContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sample data (optional)</FormLabel>
                      <FormControl>
                        <div className="w-full overflow-x-auto">
                          <CodeMirror
                            value={field.value || ""}
                            height="150px"
                            extensions={[java()]}
                            theme="light"
                            onChange={field.onChange}
                            basicSetup={{ lineNumbers: true }}
                            className="text-xs sm:text-sm"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="answerContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer key</FormLabel>
                      <FormControl>
                        <div className="w-full overflow-x-auto">
                          <CodeMirror
                            value={field.value || ""}
                            height="150px"
                            extensions={[java()]}
                            theme="light"
                            onChange={field.onChange}
                            basicSetup={{ lineNumbers: true }}
                            className="text-xs sm:text-sm"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Fields cho practiceType = "upload_file" */}
            {practiceType === "upload_file" && (
              <>
                {/* Upload attachment */}
                <FormField
                  control={form.control}
                  name="attachmentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Upload attachment
                      </FormLabel>
                      <FormControl>
                        <div
                          className="border-2 border-dashed bg-[#919EAB]/8 border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                          onClick={() => attachmentInputRef.current?.click()}
                        >
                          {!field?.value ? (
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#919EAB]/8 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                <Image
                                  width={48}
                                  height={48}
                                  className="sm:w-16 sm:h-16"
                                  alt="file"
                                  src="/images/upload.png"
                                />
                              </div>
                              <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-2">
                                Drop or select a file
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 px-2">
                                Drop files here or click to{" "}
                                <span className="text-blue-600 hover:underline cursor-pointer">
                                  browse
                                </span>{" "}
                                from your computer
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <p className="text-xs sm:text-sm text-gray-500 mb-2 break-all px-2">
                                {attachmentFile?.name}
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
                            accept="/*"
                            ref={attachmentInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setAttachmentFile(file);
                                handleUploadFile(file, field);
                              }
                            }}
                            className="hidden"
                            id="attachment-upload"
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500 gap-1 mt-2 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="font-medium">
                          Size:
                        </span> 10MB.{" "}
                        <span className="font-medium">Supported files:</span> PDF,
                        DOC, DOCX, TXT
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Maximum duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter the maximum duration"
                          value={field.value || undefined}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Passing score */}
                <FormField
                  control={form.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passing score</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter the passing score"
                          {...field}
                          value={field.value || undefined}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-[#919EAB52]">
              <Button
                type="button"
                size="sm"
                className="w-full sm:w-auto bg-[#FFF1F1] hover:bg-[#FEE2E2] text-[#E53935] text-xs sm:text-sm"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-[#FFFFFF] text-xs sm:text-sm"
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
