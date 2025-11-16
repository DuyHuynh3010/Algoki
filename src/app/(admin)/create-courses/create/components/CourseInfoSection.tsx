"use client";

import { COURSE_LABELS } from "@/api/utils/course";
import {
  fullCourseFormData,
  infoCourseSchema,
  InfoFormData,
} from "@/app/(admin)/create-courses/create/schemas";
import CKEditorWrapper from "@/components/courses/editor/CKEditorWrapper";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircle } from "iconsax-react";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ToggleSwitch from "./ToggleSwitch";

interface CourseInfoSectionProps {
  onNext: (data: InfoFormData) => void;
  onBack: () => void;
  initialData?: Partial<fullCourseFormData>;
}

export default function CourseInfoSection({
  onNext,
  onBack,
  initialData,
}: CourseInfoSectionProps) {
  const [infoExpanded, setInfoExpanded] = useState(true);
  const defaultValues: any = useMemo(() => ({
    requirements: initialData?.requirements || "",
    hourCourse: initialData?.hourCourse || 0,
    learningOutcomes: initialData?.learningOutcomes || "",
    minutesCourse: initialData?.minutesCourse || 0,
    description: initialData?.description || "",
    label: initialData?.label || "",
  }), [initialData]);
  const form = useForm<InfoFormData>({
    resolver: zodResolver(infoCourseSchema),
    defaultValues
  });

  useEffect(() => {
    if (!initialData) return;

    const currentValues: any = form.getValues();
    const needsUpdate = Object.keys(defaultValues).some(key => {
      return currentValues[key] !== defaultValues[key];
    });

    if (needsUpdate) {
      form.reset(defaultValues);
    }
  }, [initialData, defaultValues, form]);

  const onSubmit = (data: InfoFormData) => {
    // Call onNext to pass data back to parent component
    console.log("Step 2 form data:", data);
    onNext(data);
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-slate-900 py-4 shadow-sm border border-slate-800 text-slate-50">
          <div
            className="flex items-center justify-between p-4 cursor-pointer transition-colors"
            onClick={() => setInfoExpanded(!infoExpanded)}
          >
            <h3 className="text-base font-medium text-slate-50">
              Add Information
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                infoExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {infoExpanded && (
            <div className="p-4 border-t border-t-slate-800 space-y-6">
              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Short description
                    </FormLabel>
                    <FormControl>
                      <CKEditorWrapper
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Write a short summary of the course..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requirements Field */}
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Requirements
                    </FormLabel>
                    <FormControl>
                      <CKEditorWrapper
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Requirements"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Learning Outcomes Field */}
              <FormField
                control={form.control}
                name="learningOutcomes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Learning outcomes
                    </FormLabel>
                    <FormControl>
                      <CKEditorWrapper
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Learning outcomes"
                      />
                    </FormControl>
                    <p className="text-xs text-slate-400 flex items-center mt-1">
                      <InfoCircle variant="Bold" size={16} color="#94a3b8" />
                      <span className="ml-1">
                        Outcomes learners will achieve after completing the course
                      </span>
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration: hours and minutes */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hourCourse"
                  render={({ field,  }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-200">
                        Total duration
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="00"
                          className="h-10 border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-slate-400 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#94a3b8" />
                        <span className="ml-1">Hours</span>
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minutesCourse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-200 opacity-0">
                        Hidden
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="00"
                          className="h-10 border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-slate-400 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#94a3b8" />
                        <span className="ml-1">Minutes</span>
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Toggle Switches */}
              <div className="space-y-4 pt-4">
                {/* Sale Toggle */}
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-200">
                        Label
                      </FormLabel>
                      {COURSE_LABELS.map((item) => {
                        return (
                          <div
                            key={item.label}
                            className="flex items-center gap-4 mt-1"
                          >
                            <FormControl>
                              <ToggleSwitch
                                value={field.value === item.value}
                                onChange={() => {
                                  field.onChange(item.value);
                                }}
                                color="green"
                              />
                            </FormControl>
                            <div className="flex-1 px-4 py-2 text-sm border border-slate-700 rounded-lg bg-slate-800/70 text-slate-100">
                              {item.label}
                            </div>
                          </div>
                        );
                      })}
                    </FormItem>
                  )}
                />
              </div>
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
            className="px-8 bg-sky-500 hover:bg-sky-400 text-slate-950"
          >
            Continue
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
