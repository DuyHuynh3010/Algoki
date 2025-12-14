import { useQuizStore } from "@/store/slices/lesson.slice";
import he from "he";
import { useEffect } from "react";

interface IDocumentLessonProps {
  data: any;
}

export default function DocumentLesson({ data }: IDocumentLessonProps) {
  const setQuizStarted = useQuizStore((state) => state.setQuizStarted);

  useEffect(() => {
    setQuizStarted(false);
  }, []);

  return (
    <div className="md:mx-20 mx-4 h-[60vh] overflow-auto">
      <h1 className="text-2xl font-bold mb-4 text-white">{data?.title}</h1>
      <p className="text-gray-300">
        {data?.htmlContent && (
          <div
            className="text-gray-300 [&_*]:text-gray-300"
            dangerouslySetInnerHTML={{ __html: he.decode(data?.htmlContent) }}
          />
        )}
      </p>
    </div>
  );
}
