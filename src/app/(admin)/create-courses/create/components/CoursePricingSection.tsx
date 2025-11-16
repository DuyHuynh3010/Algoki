"use client";

import {
  fullCourseFormData,
  PricingCourseFormData,
  pricingCourseSchema,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ToggleSwitch from "./ToggleSwitch";

interface CoursePricingSectionProps {
  onNext: (data: PricingCourseFormData) => void;
  onBack: () => void;
  initialData?: Partial<fullCourseFormData>;
}

export default function CoursePricingSection({
  onNext,
  onBack,
  initialData,
}: CoursePricingSectionProps) {

  const defaultValues: any = useMemo(() => ({
    regularPrice: initialData?.regularPrice || 0,
    discountedPrice: initialData?.discountedPrice || 0,
    isFree: initialData?.isFree,
  }), [initialData]);

  const form = useForm<PricingCourseFormData>({
    resolver: zodResolver(pricingCourseSchema),
    defaultValues,
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

  const onSubmit = (data: PricingCourseFormData) => {
    // Call onNext to pass data back to parent component
    console.log("Step 2 form data:", data);
    onNext(data);
  };

  const isFree = form.watch("isFree");

  const formatCurrencyVND = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const parseVNDToNumber = (input: string): number => {
    const digitsOnly = input.replace(/[^\d]/g, "");
    return digitsOnly ? Number(digitsOnly) : 0;
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-slate-900 shadow-sm border border-slate-800 text-slate-50">
          {/*<div*/}
          {/*  className="flex items-center justify-between p-4 cursor-pointer transition-colors"*/}
          {/*  onClick={() => setPricingExpanded(!pricingExpanded)}*/}
          {/*>*/}
          {/*  <h3 className="text-base font-medium text-gray-900">*/}
          {/*    Course pricing*/}
          {/*  </h3>*/}
          {/*  <ChevronDown*/}
          {/*    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${*/}
          {/*      pricingExpanded ? "rotate-180" : ""*/}
          {/*    }`}*/}
          {/*  />*/}
          {/*</div>*/}

          <div className="p-4 border-t border-t-slate-800 space-y-4">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 p-3 rounded-lg">
                  <FormControl className="flex items-center">
                    <ToggleSwitch
                      value={field.value || false}
                      onChange={field.onChange}
                      color="gray"
                    />
                  </FormControl>
                <FormLabel className="text-sm font-medium text-slate-200 cursor-pointer">
                    Free course
                  </FormLabel>
                </FormItem>
              )}
            />

            {!isFree && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="regularPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-200">
                        Regular price
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="0"
                            type="text"
                            className="h-10 border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                            name={field.name}
                            ref={field.ref}
                            value={formatCurrencyVND(field.value || 0)}
                            onChange={(e) => field.onChange(parseVNDToNumber(e.target.value))}
                            onBlur={(e) => field.onChange(parseVNDToNumber(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-200">
                        Discounted price
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="0"
                            type="text"
                            className="h-10 border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                            name={field.name}
                            ref={field.ref}
                            value={formatCurrencyVND(field.value || 0)}
                            onChange={(e) => field.onChange(parseVNDToNumber(e.target.value))}
                            onBlur={(e) => field.onChange(parseVNDToNumber(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
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
