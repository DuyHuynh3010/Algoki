"use client";

import {
    fullCourseFormData,
    VideoIntroFormData,
    videoIntroSchema,
} from "@/app/(admin)/create-courses/create/schemas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUploadFile } from "@/hooks/queries/course/useUploadFile";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircle } from "iconsax-react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

// const typeSource = [
//   {
//     value: "image",
//     label: "Image",
//   },
//   {
//     value: "video",
//     label: "Video",
//   },
// ];

interface VideoIntroSectionProps {
  onNext: (data: VideoIntroFormData) => void;
  onBack: () => void;
  initialData?: Partial<fullCourseFormData>;
}

export default function VideoIntroSection({
  onNext,
  onBack,
  initialData,
}: VideoIntroSectionProps) {
  const [isExpanded, setIsExpand] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultValues: any = useMemo(() => ({
    previewVideo: initialData?.previewVideo || "",
    previewImg: initialData?.previewImg || "",
  }), [initialData]);
  const form = useForm<VideoIntroFormData>({
    resolver: zodResolver(videoIntroSchema),
    defaultValues
  });

  useEffect(() => {
    if (!initialData) return;

    const currentValues: any = form.getValues();
    const needsUpdate = Object.keys(defaultValues).some(key => {
      return currentValues[key] !== defaultValues[key];
    });

    if (needsUpdate) {
      console.log("Initial data changed --- updating form");
      form.reset(defaultValues);
    }
  }, [initialData, defaultValues, form]);

  const onSubmit = (data: VideoIntroFormData) => {
    // Call onNext to pass data back to parent component
    console.log("Step 4 form data:", data);
    onNext(data);
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

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-slate-900 py-4 shadow-sm border border-slate-800 text-slate-50">
          <div
            className="flex items-center justify-between p-4 cursor-pointer  transition-colors"
            onClick={() => setIsExpand(!isExpanded)}
          >
            <h3 className="text-base font-medium text-slate-50">
              Intro video
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {isExpanded && (
            <div className="p-4 border-t border-t-slate-800 space-y-4">
              {/*<FormItem>*/}
              {/*  <FormLabel className="text-sm font-medium text-gray-700">*/}
              {/*    Type*/}
              {/*  </FormLabel>*/}
              {/*  <Select*/}
              {/*    onValueChange={(value) => setTypeSource(value)}*/}
              {/*    defaultValue={type}*/}
              {/*  >*/}
              {/*    <FormControl>*/}
              {/*      <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">*/}
              {/*        <SelectValue placeholder="Youtube" />*/}
              {/*      </SelectTrigger>*/}
              {/*    </FormControl>*/}
              {/*    <SelectContent>*/}
              {/*      {typeSource.map((item) => {*/}
              {/*        return (*/}
              {/*          <SelectItem key={item.value} value={item.value}>*/}
              {/*            {item.label}*/}
              {/*          </SelectItem>*/}
              {/*        );*/}
              {/*      })}*/}
              {/*    </SelectContent>*/}
              {/*  </Select>*/}
              {/*  <FormMessage />*/}
              {/*</FormItem>*/}

              <FormField
                control={form.control}
                name="previewVideo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Add your video URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add your video URL"
                        className="h-10 border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-slate-400 flex items-center">
                      <InfoCircle
                        size={16}
                        color="#94a3b8"
                        variant="Bold"
                        className="mr-1"
                      />
                      Example:{" "}
                      <a className="text-sky-400">
                        https://www.youtube.com/watch?v=yourvideoid
                      </a>
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="previewImg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Add your video thumbnail
                    </FormLabel>
                    <FormControl>
                      <div
                        className="border-2 border-dashed bg-slate-900 border-slate-700 rounded-lg p-8 text-center hover:border-slate-500 transition-colors cursor-pointer"
                        onClick={() => inputRef.current?.click()}
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
                                if (inputRef.current) {
                                  inputRef.current.value = "";
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
                            ref={inputRef}
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
                      <span className="font-medium">Supported files:</span> JPG, JPEG, PNG, GIF, WEBP
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </Card>
        <div className="flex items-center justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6 border-slate-600 text-slate-100 hover:bg-slate-800"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6 border-slate-600 text-slate-100 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={uploadFile.isPending}
            className="px-8 bg-sky-500 hover:bg-sky-400 text-slate-950"
          >
            Continue
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
