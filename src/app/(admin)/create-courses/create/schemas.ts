import { z } from "zod";

// Schema validation for Step 1
export const step1Schema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  thumbnail: z.any().optional(),
  overview: z.any().optional()
});

export const infoCourseSchema = z.object({
  description: z.string().min(10, "Detailed description must be at least 10 characters"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  learningOutcomes: z.string().min(10, "Learning outcomes must be at least 10 characters"),
  hourCourse: z.any().optional(),
  minutesCourse: z.any().optional(),
  label: z.string().optional(),
});

export const settingCourseSchema = z.object({
  difficulty: z.string().min(1, "Please choose a level"),
  isPublic: z.boolean().optional(),
  enableQA: z.boolean().optional(),
  enableDrip: z.boolean().optional(),
})

export const videoIntroSchema = z.object({
  previewVideo: z.any().optional(),
  previewImg: z.any().optional(),
})

export const pricingCourseSchema = z.object({
  regularPrice: z.number().min(0, "Regular price cannot be negative"),
  discountedPrice: z.number().optional(),
  isFree: z.boolean().optional()
})
export const fullCourseSchema = step1Schema.merge(infoCourseSchema).merge(settingCourseSchema).merge(videoIntroSchema).merge(pricingCourseSchema)

export const moduleCourseSchema = z.object({
  title: z.string().min(1, "Module title cannot be empty"),
  shortDescription: z.string().min(1, "Module short description cannot be empty"),
  order: z.number().optional()
})

export const lessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Summary is required"),
  videoUrl: z.string().url("Invalid video URL").optional().nullable(),
  duration: z.number().optional().nullable(),
  attachmentUrl: z.any().optional(),
  isPreviewable: z.boolean().optional(),
  htmlContent: z.any().optional(),
  sampleImageUrl: z.any().optional(),
  type: z.string().optional()
});

export const uploadAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  practiceType: z.string().min(1, "Please choose an assignment type"),
  language: z.string().min(1, "Please choose a language"),
  htmlContent: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  attachmentUrl: z.any().optional(),
  passingScore: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  inputFile: z.any().optional(),
  outputFile: z.any().optional(),
  suggestion: z.string().optional(),
  sampleContent: z.string().optional(),
  answerContent: z.string().optional(),
});

// Type definitions
export type Step1FormData = z.infer<typeof step1Schema>;
export type InfoFormData = z.infer<typeof infoCourseSchema>;
export type SettingCourseFormData = z.infer<typeof settingCourseSchema>;
export type VideoIntroFormData = z.infer<typeof videoIntroSchema>;
export type PricingCourseFormData = z.infer<typeof pricingCourseSchema>;
export type fullCourseFormData = z.infer<typeof fullCourseSchema>
export type ModuleCourseFormData = z.infer<typeof moduleCourseSchema>;
export type LessonFormData = z.infer<typeof lessonSchema>;
export type UploadAssignmentFormData = z.infer<typeof uploadAssignmentSchema>;
