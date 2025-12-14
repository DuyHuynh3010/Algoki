import { useEffect, useState } from "react";

interface CodeSubmission {
  submittedAt: string; // ISO date string
  isPassed: boolean;
  codeSnippet: string;
  language: "PYTHON" | "JAVASCRIPT" | "JAVA" | "C++" | string;
  submissionDetail: string | null;
  submissionResult: string | null;
  runtimeMs: number | null;
}

interface FileSubmission {
  submittedAt: string;
  isPassed: boolean;
  fileUrl: string;
  fileName: string;
  score: number | null;
  comment: string | null;
}

interface WritingSubmission {
  submittedAt: string;
  isPassed: boolean;
  content: string;
  score: number | null;
  comment: string | null;
}

interface LessonSubmission {
  lessonId: string;
  submissionType: "CODE" | "FILE" | "WRITING";
  code: CodeSubmission[];
  file: FileSubmission;
  writing: WritingSubmission;
  status?: "overview" | "submit-active" | "submit-not-active";
}

interface ItemResultProps {
  status?: "overview" | "submit-active" | "submit-not-active";
  dataTracking?: LessonSubmission;
  dataLesson: any;
  changeTab: (tab: string) => void;
}

export default function ItemResultTracking(props: ItemResultProps) {
  const { dataTracking, dataLesson } = props;
  const [status, setStatus] = useState<string>("overview");

  useEffect(() => {
    if (dataTracking) {
      if (dataTracking?.status) {
        setStatus(dataTracking.status)
      }
    }
  }, [dataTracking]);

  const renderClassName = () => {
    switch (status) {
      case "overview":
        return "w-full p-6 bg-gray-800 rounded-2xl border border-dashed border-gray-700 mt-4 shadow";
      case "submit-active":
        return "w-full p-6 bg-green-900/20 rounded-2xl border border-dashed border-green-500 mt-4 shadow";
      case "submit-not-active":
        return "w-full p-6 bg-red-900/20 rounded-2xl border border-dashed border-red-500 mt-4 shadow";
      default:
        return "";
    }
  };

  return (
    <div className={renderClassName()}>
      <div className="flex justify-between">
        <div>
          <div className="text-lg font-semibold text-white">Điểm của bạn</div>
          <div className="text-sm font-normal text-gray-400">
            {status !== "overview"
              ? "Chúng tôi sẽ lưu lại điểm cao nhất của bạn."
              : "Bạn chưa nộp bài này"}
          </div>
          <div className="flex items-center gap-8 mt-4">
            <div
              className={`text-3xl font-bold ${status === "submit-active" && "text-success"} ${status === "submit-not-active" && "text-error-main"}`}
            >
              {dataLesson?.practiceType === "upload_file"
                ? dataTracking?.file?.score || "--"
                : dataTracking?.writing?.score || "--"}
            </div>
          </div>
        </div>
        {/*{dataTracking?.status !== "overview" && (*/}
        {/*  <div*/}
        {/*    onClick={() => changeTab("stepsExercise2")}*/}
        {/*    role="presentation"*/}
        {/*    className="cursor-pointer border border-gray-200 h-max px-4 py-2 rounded-xl font-semibold text-sm"*/}
        {/*  >*/}
        {/*    Xem lại bài*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </div>
  );
}
