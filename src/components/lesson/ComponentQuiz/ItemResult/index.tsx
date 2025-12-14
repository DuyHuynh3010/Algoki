import { useEffect, useState } from "react";

interface ItemResultProps {
  status?: "overview" | "submit-active" | "submit-not-active";
  dataTracking?: {
    maxScore: number;
    maxScoreAttempt: number;
    totalAttempt: number;
    status: string
  };
  changeTab: (tab: string) => void;
}

export default function ItemResult(props: ItemResultProps) {
  const { dataTracking } = props;
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
            {dataTracking?.totalAttempt && dataTracking.totalAttempt > 0
              ? "Chúng tôi sẽ lưu lại điểm cao nhất của bạn."
              : "Bạn chưa nộp bài này"}
          </div>
          <div className="flex items-center gap-8 mt-4">
            <div
              className={`text-3xl font-bold ${status === "submit-active" && "text-success"} ${status === "submit-not-active" && "text-error-main"}`}
            >
              {dataTracking?.maxScoreAttempt && dataTracking?.maxScore
                ? `${dataTracking.maxScoreAttempt}/${dataTracking.maxScore}`
                : "--"}
            </div>
          </div>
        </div>
        {/*{dataTracking?.totalAttempt && dataTracking.totalAttempt > 0 && (*/}
        {/*  <div*/}
        {/*    onClick={() => {*/}
        {/*      setQuizStarted(true)*/}
        {/*      changeTab("quizStep2");*/}
        {/*    }}*/}
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
