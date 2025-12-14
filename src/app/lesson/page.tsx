import { Suspense } from "react";
import LessonClient from "./LessonClient";

export default function LessonPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#161C24]"><div className="text-lg text-white">Loading...</div></div>}>
      <LessonClient />
    </Suspense>
  )
}