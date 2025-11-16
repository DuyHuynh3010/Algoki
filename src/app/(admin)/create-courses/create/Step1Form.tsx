"use client";

import CKEditorWrapper from "@/components/courses/editor/CKEditorWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { useCategory } from "@/hooks/queries/category/useCategory";
import { useUploadFile } from "@/hooks/queries/course/useUploadFile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select as SelectMode } from "antd";
import { Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Step1FormData, step1Schema } from "./schemas";
import "./step1.css";

interface Step1FormProps {
  onNext: (data: Step1FormData) => void;
  initialData?: Partial<Step1FormData>;
  schema?: z.ZodSchema<Step1FormData>;
}

export default function Step1Form({ onNext, initialData }: Step1FormProps) {
  const { data: categories } = useCategory();

  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize defaultValues to avoid creating a new object on every render
  const defaultValues: any = useMemo(
    () => ({
      title: initialData?.title || "",
      categoryId: initialData?.categoryId || "",
      slug: initialData?.slug || "",
      shortDescription: initialData?.shortDescription || "",
      thumbnail: initialData?.thumbnail || "",
      overview: initialData?.overview || [],
    }),
    [initialData],
  );

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues, // Use defaultValues from the initial render
  });

  // Only reset the form when initialData truly changes and differs from current values
  useEffect(() => {
    if (!initialData) return;

    const currentValues: any = form.getValues();
    const needsUpdate = Object.keys(defaultValues).some((key) => {
      return currentValues[key] !== defaultValues[key];
    });

    if (needsUpdate) {
      console.log("Initial data changed --- updating form");
      form.reset(defaultValues);
    }
  }, [initialData, defaultValues, form]);

  console.log("Value Step 1", form.getValues());

  const onSubmit = (data: Step1FormData) => {
    console.log("Submitted data:", data);
    onNext(data as any);
  };

  const { uploadFile } = useUploadFile();

  const handleUploadFile = (file: File, field: any) => {
    const formData = new FormData();
    formData.append("file", file);
    uploadFile.mutate(formData, {
      onSuccess: (response) => {
        console.log("response---", response);
        field.onChange(response.url);
      },
      onError: (error) => {
        console.error("Error uploading file:", error);
      },
    });
  };

  return (
    <Form {...form}>
      <Card className="p-8 bg-slate-900 shadow-sm border border-slate-800 text-slate-50">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-50 mb-2">Details</h2>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
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
                    placeholder="e.g. Web design course"
                    className="h-12 border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-slate-400 flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  Title can be up to 255 characters long
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-200">
                    Category
                  </FormLabel>
                  <FormControl>
                      <Select
                      onValueChange={field.onChange}
                      value={field.value || ""} // Ensure value is never undefined
                    >
                      <SelectTrigger className="h-12 border-slate-700 bg-slate-950 text-slate-100 focus:border-sky-500 focus:ring-sky-500">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 text-slate-100 border-slate-700">
                        {categories?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Slug Field */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-200">
                    Slug
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="new-course"
                    className="h-12 border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-slate-400">
                  Preview:{" "}
                  <span className="text-sky-400">
                    https://example.com/{field.value || "new-course"}
                  </span>
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overview"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-200">
                  Overview
                </FormLabel>
                <FormControl>
                  <SelectMode
                    mode="tags"
                    size="large"
                    style={{ width: "100%" }}
                    className="dark-tags-select"
                    popupClassName="dark-tags-select-dropdown"
                    placeholder="Tags Mode"
                    value={field.value || []} // Ensure value is never undefined
                    onChange={(value) => field.onChange(value)}
                    options={[]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-200">
                  Introduction
                </FormLabel>
                <FormControl>
                  <CKEditorWrapper
                    value={field.value || ""} // Ensure value is never undefined
                    onChange={field.onChange}
                    placeholder="Introduction"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thumbnail Upload */}
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-200">
                  Thumbnail
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
                            field.onChange("");
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

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="px-8 border-slate-600 text-slate-100 hover:bg-slate-800"
              onClick={() => form.reset(defaultValues)} // Reset to defaultValues instead of form.reset()
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
      </Card>
    </Form>
  );
}
