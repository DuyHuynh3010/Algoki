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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Edit, InfoCircle } from "iconsax-react";
import QuizQuestionModal, {
  QuestionFormData,
  QuestionType,
} from "./QuizQuestionModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ToggleSwitch from "../ToggleSwitch";
import {
  useCreateLessonQuiz,
  useGetLessonById,
  useUpdateLessonQuiz,
} from "@/hooks/queries/course/useLessonCourse";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import CKEditorWrapper from "@/components/courses/editor/CKEditorWrapper";
import _ from "lodash";

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Summary is required"),
});
type QuizFormData = z.infer<typeof quizSchema>;

const settingsSchema = z.object({
  duration: z.number().gt(0, "Duration must be greater than 0"),
  durationUnit: z.string().optional().nullable(),
  isViewTimeLimit: z.boolean(),
  feedbackMode: z.enum(["default", "show", "retry"]),
  passingScore: z.number().gt(0, "Passing score must be greater than 0"),
  maxAttempts: z.number().gt(0, "Attempts must be greater than 0"),
  autoStart: z.boolean(),
  showQuestionCount: z.boolean(),
  questionLayout: z.enum(["random", "categorized", "ascending", "descending"]),
  questionViewMode: z.enum(["single", "paginated", "scrollable"]),
  shortAnswerCharLimit: z.number().optional().nullable(),
  essayCharLimit: z.number().optional().nullable(),
});
type SettingsFormData = z.infer<typeof settingsSchema>;

export const CreateQuizModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateQuizModalProps) => {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<QuestionFormData[]>([]);
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { courseData, moduleSelected, lessonSelected } =
    useCreateCourseContext();
  const isEdit = Boolean(lessonSelected?.id);
  const { data: initValue, refetch } = useGetLessonById(
    courseData?.id as string,
    moduleSelected?.id as string,
    lessonSelected?.id as string,
  );
  // Ensure ids are only passed when course data and module are available
  const createLessonQuiz = useCreateLessonQuiz(
    courseData?.id || "",
    moduleSelected?.id || "",
  );

  const updateLessonQuiz = useUpdateLessonQuiz(
    courseData?.id || "",
    moduleSelected?.id || "",
    lessonSelected?.id || "",
  );
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const settingsForm = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      duration: 60,
      durationUnit: "second",
      isViewTimeLimit: false,
      feedbackMode: "default",
      passingScore: 50,
      maxAttempts: 10,
      autoStart: false,
      showQuestionCount: false,
      questionLayout: "random",
      questionViewMode: "single",
      shortAnswerCharLimit: 200,
      essayCharLimit: 500,
    },
  });

  const steps = [
    { label: "Quiz" },
    { label: "Questions" },
    { label: "Settings" },
  ];

  useEffect(() => {
    // Reset step and forms when modal opens
    if (lessonSelected) {
      setStep(1);
      form.reset(initValue);
      settingsForm.reset(initValue);
      setQuestions(initValue?.questions || []);
    } else {
      form.reset();
      settingsForm.reset({
        duration: 60,
        durationUnit: "second",
        isViewTimeLimit: false,
        feedbackMode: "default",
        passingScore: 50,
        maxAttempts: 10,
        autoStart: false,
        showQuestionCount: false,
        questionLayout: "random",
        questionViewMode: "single",
        shortAnswerCharLimit: 200,
        essayCharLimit: 500,
      });
      setQuestions([]);
      setStep(1);
    }
  }, [lessonSelected, initValue, isOpen]);

  console.log("form---", questions);
  console.log("settingsForm---", settingsForm.formState.errors);

  const handleNext = async () => {
    if (step === 1) {
      const valid = await form.trigger();
      if (!valid) return;
    }
    if (step === 3) {
      const valid = await settingsForm.trigger();
      if (valid) {
        handleSubmit();
      }
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleClose = () => {
    setStep(1);
    form.reset();
    settingsForm.reset();
    onClose();
  };

  const handleSubmit = async () => {
    const data = {
      title: form.getValues().title.trim(),
      description: form.getValues().description.trim(),
      isViewTimeLimit: settingsForm.getValues().isViewTimeLimit,
      feedbackMode: settingsForm.getValues().feedbackMode,
      autoStart: settingsForm.getValues().autoStart,
      showQuestionCount: settingsForm.getValues().showQuestionCount,
      questionLayout: settingsForm.getValues().questionLayout,
      questionViewMode: settingsForm.getValues().questionViewMode,
      shortAnswerCharLimit: settingsForm.getValues().shortAnswerCharLimit,
      essayCharLimit: settingsForm.getValues().essayCharLimit,
      duration: Number(settingsForm.getValues().duration),
      timeLimitMin: Number(settingsForm.getValues().duration),
      questions: questions,
      passingScore: Number(settingsForm.getValues().passingScore),
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      maxAttempts: settingsForm.getValues().maxAttempts,
    } as any;

    if (isEdit) {
      updateLessonQuiz.mutate(data, {
        onSuccess: () => {
          onSubmit();
          refetch();
          handleClose();
        },
      });
      return;
    }

    createLessonQuiz.mutate(data, {
      onSuccess: () => {
        onSubmit();
        handleClose();
      },
    });
  };

  const handleSubmitCreateQuiz = (value: QuestionFormData) => {

    if (editIndex || editIndex === 0) {
      const updatedQuestions = _.clone(questions);
      updatedQuestions[editIndex] = value;
      setQuestions(updatedQuestions);
      setEditIndex(null);
      return;
    }

    setQuestions((prev) => {
      return [...prev, value];
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[60vw] bg-white p-0 rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b border-[#919EAB52] text-left">
          <DialogTitle className="text-lg text-left font-medium text-gray-900">
            Add quiz
          </DialogTitle>
        </DialogHeader>
        {/* Stepper */}
        <div className="flex items-start px-6 pt-6 pb-2 w-full">
          {steps.map((item, idx) => (
            <>
              <div
                key={item.label}
                className="flex flex-col items-center min-w-[80px]"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-200
                    ${
                      step >= idx + 1
                        ? "border-primary-main bg-primary-main text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }
                  `}
                >
                  {idx + 1}
                </div>
                <span
                  className={`mt-2 text-base transition-all duration-200
                    ${
                      step >= idx + 1
                        ? "text-black font-bold"
                        : "text-gray-400 font-normal"
                    }
                  `}
                >
                  {item.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mt-4 ${step >= idx + 2 ? "bg-primary-main" : "bg-gray-200"}`}
                  style={{ minWidth: 32 }}
                />
              )}
            </>
          ))}
        </div>
        {/* Step content */}
        <div className="p-6 space-y-5">
          {step === 1 && (
            <Form {...form}>
              <form className="space-y-5">
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
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
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
              </form>
            </Form>
          )}
          {step === 2 && (
            <div className="space-y-3">
              {/* Question list */}
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                  >
                    <span className="text-base font-medium text-gray-900">
                      {q.content}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {q.type === QuestionType.SINGLE_CHOICE && "Single answer"}
                        {q.type === QuestionType.SHORT_ANSWER &&
                          "Short answer"}
                        {q.type === QuestionType.MULTIPLE_CHOICE &&
                          "Multiple answers"}
                      </span>
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-gray-100"
                        onClick={() => {
                          setEditIndex(idx);
                          setOpenQuestionModal(true);
                        }}
                      >
                        <Edit color="#637381" size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Add question button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-50 text-gray-900 font-medium text-base mt-2 hover:bg-gray-100 transition"
                onClick={() => {
                  setEditIndex(null);
                  setOpenQuestionModal(true);
                }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#637381"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add question
              </button>
              {/* Add/Edit question modal */}
              <QuizQuestionModal
                isOpen={openQuestionModal}
                onClose={() => setOpenQuestionModal(false)}
                defaultValues={
                  editIndex !== null ? questions[editIndex] : undefined
                }
                onSubmit={(data) => {
                  handleSubmitCreateQuiz(data);
                }}
              />
            </div>
          )}
          {step === 3 && (
            <Form {...settingsForm}>
              <form className="space-y-6">
                {/* Maximum duration */}
                <div>
                  <FormLabel className="mb-2 block">Maximum duration</FormLabel>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <FormField
                      control={settingsForm.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type={"number"}
                              className="flex-1"
                              placeholder="00"
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
                    <FormField
                      control={settingsForm.control}
                      name="durationUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              value={field.value || undefined}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                style={{ marginBlockEnd: 0 }}
                                className="h-12 flex-1 space-y-0"
                              >
                                <SelectValue placeholder="Seconds" />
                              </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="second">Seconds</SelectItem>
                                <SelectItem value="minute">Minutes</SelectItem>
                                <SelectItem value="hour">Hours</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={settingsForm.control}
                      name="isViewTimeLimit"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 flex-1">
                          <FormControl>
                            <ToggleSwitch
                              value={field.value}
                              onChange={field.onChange}
                              color="blue"
                            />
                          </FormControl>
                          <span className="text-sm text-gray-600">
                            Show/hide quiz timer
                          </span>
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <InfoCircle variant="Bold" size={16} color="#637381" />
                    <span className="ml-1">
                      Set a time limit for this quiz. Use 0 for no limit.
                    </span>
                  </p>
                </div>
                {/* Feedback mode */}
                <FormField
                  control={settingsForm.control}
                  name="feedbackMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1 block">
                        Question feedback mode
                      </FormLabel>
                      <div className="mt-1 text-[#637381] text-xs">
                        (Choose how the quiz behaves when showing answers.)
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="default"
                            checked={field.value === "default"}
                            onChange={() => field.onChange("default")}
                            className="accent-blue-600"
                          />
                          <span className="font-medium text-xs">Default</span>
                          <span className="text-xs text-gray-500">
                            (Show answers after the quiz ends)
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="show"
                            checked={field.value === "show"}
                            onChange={() => field.onChange("show")}
                            className="accent-blue-600"
                          />
                          <span className="font-medium text-xs">
                            Show mode
                          </span>
                          <span className="text-xs text-gray-500">
                            (Display results immediately after each attempt)
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="retry"
                            checked={field.value === "retry"}
                            onChange={() => field.onChange("retry")}
                            className="accent-blue-600"
                          />
                          <span className="font-medium text-xs">
                            Retry mode
                          </span>
                          <span className="text-xs text-gray-500">
                            (Allow unlimited retries. Set the limit below.)
                          </span>
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Passing score */}
                <FormField
                  control={settingsForm.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1 block">Passing score (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="flex-1"
                          placeholder="50"
                          {...field}
                          value={field.value || undefined}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="ml-1">Set 0 for no minimum score.</span>
                      </p>
                    </FormItem>
                  )}
                />
                {/* Maximum attempts */}
                <FormField
                  control={settingsForm.control}
                  name="maxAttempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1 block">
                        Maximum attempts allowed
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="flex-1"
                          placeholder="10"
                          {...field}
                          value={field.value || undefined}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="ml-1">
                          Number of attempts students can make. If this is higher than the available questions, learners can answer all questions.
                        </span>
                      </p>
                    </FormItem>
                  )}
                />
                {/* Advanced accordion */}
                <Accordion type="single" collapsible className="rounded-lg">
                  <AccordionItem value="advanced">
                    <AccordionTrigger className="px-4 py-3 font-semibold">
                      Advanced settings
                    </AccordionTrigger>
                    <AccordionContent className="space-y-8 px-4 pb-4">
                      <FormField
                        control={settingsForm.control}
                        name="autoStart"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <ToggleSwitch
                                value={field.value}
                                onChange={field.onChange}
                                color="blue"
                              />
                            </FormControl>
                            <span className="text-sm">
                              Auto-start quiz
                            </span>
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={settingsForm.control}
                          name="questionLayout"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question layout</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Random" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="random">
                                      Random
                                    </SelectItem>
                                    <SelectItem value="categorized">
                                      By topic
                                    </SelectItem>
                                    <SelectItem value="ascending">
                                      Ascending
                                    </SelectItem>
                                    <SelectItem value="descending">
                                      Descending
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={settingsForm.control}
                          name="questionViewMode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question display</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Choose how to show questions" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="paginated">
                                      Paginated
                                    </SelectItem>
                                    <SelectItem value="single">
                                      Single question
                                    </SelectItem>
                                    <SelectItem value="scrollable">
                                      Scrollable
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={settingsForm.control}
                        name="showQuestionCount"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <ToggleSwitch
                                value={field.value}
                                onChange={field.onChange}
                                color="blue"
                              />
                            </FormControl>
                            <span className="text-sm">
                              Randomize question count for each attempt
                            </span>
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={settingsForm.control}
                          name="shortAnswerCharLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Short-answer character limit</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="200"
                                  {...field}
                                  value={field.value || undefined}
                                  onChange={(event) => {
                                    field.onChange(Number(event.target.value));
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={settingsForm.control}
                          name="essayCharLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Essay/comment character limit
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="500"
                                  {...field}
                                  value={field.value || undefined}
                                  onChange={(event) => {
                                    field.onChange(Number(event.target.value));
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </form>
            </Form>
          )}
        </div>
        <DialogFooter className="px-6 py-4 flex justify-between space-x-3 rounded-b-lg border-t border-[#919EAB52]">
          {/* Left: back button */}
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                className="text-primary-contrastText border-[#919EAB52]"
              >
                Back
              </Button>
            )}
          </div>
          {/* Right: cancel and continue */}
          <div className="flex gap-4 items-end">
            <Button
              type="button"
              size="sm"
              onClick={handleClose}
              className="bg-[#FFF1F1] hover:bg-[#FEE2E2] text-[#E53935]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save & Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};