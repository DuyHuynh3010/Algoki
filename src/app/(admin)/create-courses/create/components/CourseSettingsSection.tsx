"use client";

import { DIFFICULTY_LEVEL } from "@/api/utils/course";
import {
    fullCourseFormData,
    SettingCourseFormData,
    settingCourseSchema,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircle } from "iconsax-react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ToggleSwitch from "./ToggleSwitch";
import { Input } from "@/components/ui/input";

interface CourseSettingsSectionProps {
  onNext: (data: SettingCourseFormData) => void;
  onBack: () => void;
  initialData?: Partial<fullCourseFormData>;
}

export default function CourseSettingsSection({
  onNext,
  onBack,
  initialData,
}: CourseSettingsSectionProps) {
  const [courseSettingsExpanded, setCourseSettingsExpanded] = useState(true);
  const defaultValues: any = useMemo(() => ({
    difficulty: initialData?.difficulty || "",
    isPublic: initialData?.isPublic || false,
    enableQA: initialData?.enableQA || true,
    enableDrip: initialData?.enableDrip || true,
  }), [initialData]);

  const form = useForm<SettingCourseFormData>({
    resolver: zodResolver(settingCourseSchema),
    defaultValues
  });

  const [studentCount, setStudentCount] = useState(100);

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

  const onSubmit = (data: SettingCourseFormData) => {
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
            onClick={() => setCourseSettingsExpanded(!courseSettingsExpanded)}
          >
            <h3 className="text-base font-medium text-slate-50">
              Course settings
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                courseSettingsExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {courseSettingsExpanded && (
            <div className="p-4 border-t border-t-slate-800 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Difficulty Level */}
                <div className="col-span-1 md:col-span-2">
                  <FormLabel className="text-sm font-medium text-slate-200 mb-2 block">
                    Difficulty level
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-lg border-slate-700 bg-slate-950 text-slate-100 focus:border-sky-500 focus:ring-sky-500">
                              <SelectValue placeholder="All levels" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 text-slate-100 border-slate-700">
                            {DIFFICULTY_LEVEL.map((level) => (
                              <SelectItem
                                key={level?.value}
                                value={level?.value}
                              >
                                {level?.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-xs text-slate-400 flex items-center mt-1">
                    <InfoCircle variant="Bold" size={16} color="#94a3b8" />
                    <span className="ml-1">Title can be up to 30 characters long.</span>
                  </p>
                </div>

                {/* Student Count */}
                <div>
                  <FormLabel className="text-sm font-medium text-slate-200 mb-2 block">
                    Maximum students
                  </FormLabel>
                  <div className="flex items-center justify-between h-11 w-full rounded-lg bg-slate-800 px-2 border border-slate-700">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setStudentCount(Math.max(0, studentCount - 1))
                      }
                      className="h-8 w-8 text-slate-300 hover:bg-slate-700"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      value={studentCount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setStudentCount(0);
                        } else {
                          setStudentCount(parseInt(value));
                        }
                      }}
                      className="w-16 text-center bg-transparent! border-none! outline-none! text-slate-50!"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setStudentCount(studentCount + 1)}
                      className="h-8 w-8 text-slate-300 hover:bg-slate-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center mt-1">
                    <InfoCircle variant="Bold" size={16} color="#94a3b8" />
                    <span className="ml-1">Set 0 for unlimited capacity.</span>
                  </p>
                </div>
              </div>
              <hr className="border-dashed border-slate-700/60" />
              Toggle Options
              <div className="space-y-4 flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center justify-between">
                      <FormLabel className="mb-0 text-sm font-medium text-slate-200 cursor-pointer">
                        Make course public
                      </FormLabel>
                      <FormControl>
                        <ToggleSwitch
                          value={field.value || false}
                          onChange={field.onChange}
                          color="blue"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableQA"
                  render={({ field }) => (
                    <FormItem className="gap-2 flex items-center justify-between">
                      <FormLabel className="mb-0 text-sm font-medium text-slate-200 cursor-pointer">
                        Q&A
                      </FormLabel>
                      <FormControl>
                        <ToggleSwitch
                          value={field.value || false}
                          onChange={field.onChange}
                          color="blue"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableDrip"
                  render={({ field }) => (
                    <FormItem className="gap-2 flex items-center justify-between">
                      <FormLabel className="mb-0 text-sm font-medium text-slate-200 cursor-pointer">
                        Drip content
                      </FormLabel>
                      <FormControl>
                        <ToggleSwitch
                          value={field.value || false}
                          onChange={field.onChange}
                          color="blue"
                        />
                      </FormControl>
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
