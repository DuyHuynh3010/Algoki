import CKEditorWrapper from "@/components/courses/editor/CKEditorWrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "iconsax-react";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import ToggleSwitch from "../ToggleSwitch";

export enum QuestionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  SHORT_ANSWER = "SHORT_ANSWER",
}

const answerSchema = z.object({
  content: z.string().optional(),
  isCorrect: z.boolean().optional(),
}).refine((data) => data.content && data.content.trim().length > 0, {
  message: "Answer content cannot be empty",
  path: ["content"],
});

export const questionSchema = z
  .object({
    content: z.string().min(1, "Question is required"),
    type: z.string().min(1, "Select a question type"),
    point: z.string().min(1, "Enter points for this question"),
    isRandom: z.boolean().optional(),
    isRequiredAnswer: z.boolean().optional(),
    description: z.string().optional(),
    options: z.array(answerSchema).optional(),
    correctExplanation: z.string().optional(),
    answer: z.any(),
    incorrectHint: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate options for question types that require them
    if (data.options && Array.isArray(data.options) && data.options.length > 0) {
      if (data.type === QuestionType.MULTIPLE_CHOICE) {
        const correctOptions = data.options.filter((option) => option.isCorrect);
        if (correctOptions.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Multiple-answer questions require at least two correct choices",
            path: ["options"],
          });
        }
      }

      if (data.type === "SINGLE_CHOICE") {
        const correctOptions = data.options.filter((option) => option.isCorrect);
        if (correctOptions.length !== 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This question must have exactly one correct answer",
            path: ["options"],
          });
        }
      }
    }
  })
  .refine(
    (data) => {
      // Validation for short-answer questions
      if (data.type === QuestionType.SHORT_ANSWER) {
        return data.answer && data.answer.trim().length > 0;
      }
      return true;
    },
    {
      message: "Short answer cannot be empty",
      path: ["answer"],
    },
  );

export type QuestionFormData = z.infer<typeof questionSchema>;

interface QuizQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuestionFormData) => void;
  defaultValues?: Partial<QuestionFormData>;
}

export default function QuizQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}: QuizQuestionModalProps) {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: defaultValues || {
      content: "",
      type: "SINGLE_CHOICE",
      point: "10",
      isRandom: false,
      isRequiredAnswer: false,
      description: "",
      options: [],
      correctExplanation: "",
      incorrectHint: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...defaultValues,
        point: defaultValues.point?.toString(),
      })
    } else {
      form.reset({
        content: "",
        type: "SINGLE_CHOICE",
        point: "10",
        isRandom: false,
        isRequiredAnswer: false,
        description: "",
        options: [],
        correctExplanation: "",
        incorrectHint: "",
      });
    }
  }, [defaultValues]);

  console.log("QuizQuestionModal defaultValues:", form.formState.errors, form.getValues());

  const handleSubmit = (value: QuestionFormData) => {
    onSubmit(value);
    onClose();
    form.reset();
  };

  const handleClose = () => {
    onClose();
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-slate-900 text-slate-50 p-0 rounded-lg max-h-[90vh] overflow-y-auto border border-slate-700">
        <DialogHeader className="p-6 pb-4 border-b border-slate-800 text-left">
          <DialogTitle className="text-lg text-left font-medium text-slate-50">
            {defaultValues ? "Edit question" : "Add question"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="p-6 space-y-5"
          >
            {/* Question input */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the question" className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Question type & points */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Question type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 border-slate-700 bg-slate-950 text-slate-100 focus:border-sky-500 focus:ring-sky-500">
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 text-slate-100 border-slate-700">
                          <SelectItem value={QuestionType.SINGLE_CHOICE}>
                            Single answer
                          </SelectItem>
                          <SelectItem value={QuestionType.MULTIPLE_CHOICE}>
                            Multiple answers
                          </SelectItem>
                          <SelectItem value={QuestionType.SHORT_ANSWER}>
                            Short answer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="point"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Points</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10" className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Toggles */}
            <div className="grid grid-cols-2 gap-8 mb-2">
              <FormField
                control={form.control}
                name="isRandom"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <ToggleSwitch
                        value={field.value || false}
                        onChange={field.onChange}
                        color="green"
                      />
                    </FormControl>
                    <FormLabel className="text-slate-200">Randomize order</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isRequiredAnswer"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <ToggleSwitch
                        value={field.value || false}
                        onChange={field.onChange}
                        color="green"
                      />
                    </FormControl>
                    <FormLabel className="text-slate-200">Required answer</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Description (optional)</FormLabel>
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
            {/* Answers - hidden for short answer type */}
            {form.watch("type") !== QuestionType.SHORT_ANSWER && (
              <div>
                <div className="mb-2 font-medium text-slate-200">Answers</div>
                {/* Answer validation */}
                <div className="space-y-2">
                  {fields.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`options.${idx}.content` as const}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder={`Answer ${String.fromCharCode(65 + idx)}`}
                                className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Correct checkbox */}
                      <FormField
                        control={form.control}
                        name={`options.${idx}.isCorrect` as const}
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-center">
                            <FormControl>
                              <Checkbox
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Remove answer */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(idx)}
                      >
                        <Trash size={24} color="#637381" />
                      </Button>
                    </div>
                  ))}
                  {form.formState.errors.options && (
                    <div className="text-red-400">
                      {form.formState.errors.options.root?.message}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-50 border-slate-600"
                  onClick={() => append({ content: "", isCorrect: false })}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add answer
                </Button>
              </div>
            )}

            {/* Short answer - visible only for short answer type */}
            {form.watch("type") === QuestionType.SHORT_ANSWER && (
              <div>
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Correct answer</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the correct answer for this question..."
                          className="min-h-[100px] border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-sky-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Short answer error */}
                {form.formState.errors.answer && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Short answer cannot be empty
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            {/* Correct answer explanation */}
            <FormField
              control={form.control}
              name="correctExplanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Correct answer explanation</FormLabel>
                  <FormControl>
                    <CKEditorWrapper
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Write something..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Incorrect answer hint */}
            <FormField
              control={form.control}
              name="incorrectHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Incorrect answer hint</FormLabel>
                  <FormControl>
                    <CKEditorWrapper
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Write something..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Footer */}
            <div className="flex justify-between gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose} className="border-slate-600 text-slate-100 hover:bg-slate-800">
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950"
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}