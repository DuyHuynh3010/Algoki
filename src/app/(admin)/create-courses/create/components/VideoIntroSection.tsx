"use client";

import { FormProvider, useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { InfoCircle } from "iconsax-react";
import {
  fullCourseFormData,
  VideoIntroFormData,
  videoIntroSchema,
} from "@/app/(admin)/create-courses/create/schemas";
import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFile } from "@/hooks/queries/course/useUploadFile";
import Image from "next/image";

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
        <Card className="bg-white py-4 shadow-sm border border-gray-200">
          <div
            className="flex items-center justify-between p-4 cursor-pointer  transition-colors"
            onClick={() => setIsExpand(!isExpanded)}
          >
            <h3 className="text-base font-medium text-gray-900">
              Intro video
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {isExpanded && (
            <div className="p-4 border-t border-t-gray-300 space-y-4">
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Add your video URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add your video URL"
                        className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 flex items-center">
                      <InfoCircle
                        size={16}
                        color="#637381"
                        variant="Bold"
                        className="mr-1"
                      />
                      Example:{" "}
                      <a className="text-blue-500">
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Add your video thumbnail
                    </FormLabel>
                    <FormControl>
                      <div
                        className="border-2 border-dashed bg-[#919EAB]/8 border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onClick={() => inputRef.current?.click()}
                      >
                        {!field?.value ? (
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#919EAB]/8 rounded-full flex items-center justify-center mb-4">
                              <Image
                                width={64}
                                height={64}
                                alt="image"
                                src="/images/upload.png"
                              />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              Drop or select a file
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                              Drop files here or click to{" "}
                              <span className="text-blue-600 hover:underline cursor-pointer">
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
                    <p className="text-xs text-gray-500">
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
            className="px-6 text-primary-contrastText"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6 text-primary-contrastText"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={uploadFile.isPending}
            className="px-8 bg-[#212B36] hover:bg-blue-700 text-[#FFFFFF]"
          >
            Continue
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
