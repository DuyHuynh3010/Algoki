import { ArrowRight } from "lucide-react";
import { useQuizStore } from "@/store/slices/lesson.slice";
import { useCreateAttemptsQuiz } from "@/hooks/queries/tracking/useTracking";
import { ArrowRotateLeft } from "iconsax-react";
import { useMemo } from "react";

interface ItemQuizProps {
  changeTab: (tab: string) => void;
  type?: "QUIZ" | "PRACTICE";
  data?: any; // Adjust type as needed
  dataTracking?: any;
  dataCourse?: any;
  setAttemptId?: any;
}

export default function ItemQuiz({
  changeTab,
  type,
  data,
  dataCourse,
  setAttemptId,
  dataTracking,
}: ItemQuizProps) {
  const setQuizStarted = useQuizStore((state) => state.setQuizStarted);

  const createLessonQuiz = useCreateAttemptsQuiz(
    dataCourse?.id as string,
    data?.id || "",
  );

  const handleStartQuiz = () => {
    if (type !== "PRACTICE") {
      createLessonQuiz.mutate(undefined, {
        onSuccess: (data) => {
          setAttemptId(data.id);
          setQuizStarted(true);
          changeTab("quizStep2");
        },
      });
    } else {
      setQuizStarted(true);
      changeTab("stepsExercise2");
    }
  };

  const sortedQuestions = useMemo(() => {
    if (!data?.questions) return [];
    return [...data.questions].sort((a, b) => a.order - b.order);
  }, [data?.questions]);

  const maxPossibleScore = sortedQuestions.reduce((sum, question) => sum + (question.point || 0), 0);


  return (
    <div className="w-full p-6 bg-gray-800 rounded-2xl shadow-md border border-gray-700 flex-shrink-0">
      <div className="flex justify-between flex-shrink-0">
        <div>
          <div className="text-lg font-semibold text-white">{data?.title}</div>
          <div className="text-sm font-normal text-gray-400">
            Bạn cần ít nhất{" "}
            {data?.passingScore}
            % điểm để vượt qua.
          </div>
          <div className="flex items-center gap-8 mt-4">
            <div>
              <div className="text-sm font-semibold text-gray-300">
                Điểm tối đa
              </div>
              <div className="text-sm font-normal text-gray-400">
                {type === "PRACTICE" ? 100 : maxPossibleScore} điểm
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-300">
                Thời gian
              </div>
              <div className="text-sm font-normal text-gray-400">
                {data?.duration} phút
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            handleStartQuiz();
          }}
          role="presentation"
          className="bg-[#16A1FF] cursor-pointer px-4 py-2 h-max gap-1 flex-shrink-0 flex rounded-xl text-white text-sm font-semibold"
        >
          {dataTracking?.totalAttempt > 0 ? "Thử lại" : "Bắt đầu"}
          {dataTracking?.totalAttempt > 0 ? (
            <ArrowRotateLeft size="20" color="#fff" />
          ) : (
            <ArrowRight size="20" color="#fff" />
          )}
        </div>
      </div>
    </div>
  );
}
