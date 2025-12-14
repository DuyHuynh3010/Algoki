import { useCallback, useEffect, useRef, useState } from "react";
import { useSubmitPracticeCode } from "@/hooks/queries/course/useSubmitPractice";
import { useSearchParams } from "next/navigation";
import { CourseDetail } from "@/api/types/course.type";
import { useQueryClient } from "@tanstack/react-query";
import CodeBlock from "@/components/lesson/StudyCode/CodeBlock";
import { useAuthStore } from "@/store/slices/auth.slice";

interface ExerciseData {
  title: string;
  description: string;
  requirements: string[];
  objectives: string[];
  initialCode: string;
  testCases: string[];
  language?: "java" | "cpp" | "javascript"; // Add language property
}

interface SubmissionResult {
  status: "WRONG" | "PASSED" | "RUNNING" | "ERROR";
  message?: string;
  output?: string;
  error?: string;
}

interface SubmissionData {
  lessonId: string;
  code: {
    id: string;
    submittedAt: string;
    isPassed: boolean;
    codeSnippet: string;
    language: string;
    submissionDetail: any;
    submissionResult: any;
    runtimeMs: number | null;
  };
}

const defaultExercise: ExerciseData = {
  title: "Section 1",
  description: "Hints will unlock after three attempts.",
  requirements: [
    'If no errors occur, you should "report" the file contents.',
    "If an error occurs, make the run_test function return a non-zero value, typically 1 or 2.",
  ],
  objectives: [
    'Familiarise yourself with different error-reporting strategies, how to read the results, and how to handle any potentially “critical” values.',
    "Evaluate different error-reporting techniques in terms of safety. As you’ll see, many of them aren’t perfect, so there’s still room for mistakes.",
  ],
  initialCode: `#ifndef EXERCISE_H
#define EXERCISE_H

#include <string>
struct Tester
{
    virtual ~Tester() = default;
    /**
     * @brief Report the result of the test by calling this method.
     * * Do NOT call this method unless you have correctly read the file contents.
     * * @param fileContent The contents of the file to report
     */
    virtual void reportResult(const std::string& fileContent) = 0;
};

}`,
  testCases: ["Unset: 0, Set: 0 across 0 tests"],
  language: "cpp",
};

// Java default exercise
const defaultJavaExercise: ExerciseData = {
  title: "Java Exercise - Hello World",
  description: "Create a simple Java program that prints Hello World.",
  requirements: [
    "Create a Main class with a main method.",
    "Use System.out.println to print to the console.",
  ],
  objectives: [
    "Get comfortable with basic Java syntax.",
    "Understand how the main method works in Java.",
  ],
  initialCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  testCases: ["Test 1: Prints Hello, World!"],
  language: "java",
};

export default function StudyCode({
  exercise = defaultExercise,
  course,
  initValue,
}: {
  exercise?: ExerciseData;
  course?: CourseDetail;
  initValue?: any;
}) {
  const [currentCode, setCurrentCode] = useState(initValue?.sampleContent ?? exercise.initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [activeResultTab, setActiveResultTab] = useState("content");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lesson");
  // Java compiler iframe ref
  const javaIframeRef = useRef<HTMLIFrameElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  // Get auth token
  const { token } = useAuthStore();

  const queryClient = useQueryClient();

  const refetchPracticeTracking = () => {
    queryClient.invalidateQueries({
      queryKey: ["PracticeTracking", course?.id, lessonId],
    });
  };


  const submitCode = useSubmitPracticeCode(
    course?.id as string,
    lessonId as string,
  );

  // SSE connection for real-time results using fetch with proper Authorization header
  const connectToSSE = useCallback(async (submissionId: string) => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    if (!token) {
      console.error("No access token available for SSE connection");
      setIsRunning(false);
      return;
    }

    const sseUrl = `https://lmscode2.nguyenmanh.io.vn/courses/${course?.id}/lessons/practice-submissions/${lessonId}/sse/${submissionId}`;

    try {
      const response = await fetch(sseUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      console.log("SSE connection opened");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Store the reader for cleanup
      eventSourceRef.current = { close: () => reader.cancel() } as any;

      const readStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log("SSE stream ended");
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6); // Remove 'data: ' prefix
                
                if (data.trim() === '') continue; // Skip empty data
                
                console.log("SSE message received:", data);
                
                try {
                  const result: SubmissionResult = JSON.parse(data);
                  setSubmissionResult(result);
                  setIsRunning(false);
                  
                  if (result.status === "WRONG") {
                    setFailedAttempts(prev => {
                      const newCount = prev + 1;
                      if (newCount >= 3) {
                        setShowAnswer(true);
                      }
                      return newCount;
                    });
                  } else if (result.status === "PASSED") {
                    setFailedAttempts(0);
                  }
                } catch (error) {
                  console.error("Error parsing SSE data:", error, "Raw data:", data);
                }
              }
            }
          }
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error("Error reading SSE stream:", error);
          }
        } finally {
          setIsRunning(false);
        }
      };

      readStream();

      // Auto close after 30 seconds
      setTimeout(() => {
        reader.cancel();
      }, 30000);

    } catch (error) {
      console.error("SSE connection error:", error);
      setIsRunning(false);
    }
  }, [course?.id, lessonId, token]);

  const handleSubmitCoding = async () => {
    setIsRunning(true);
    setSubmissionResult(null);
    
    console.log("Current code state before submit:", currentCode);
    
    // Use current code state directly since we're polling for updates
    const codeToSubmit = currentCode;
    console.log("Submitting code:", codeToSubmit);
    
    submitCode.mutate(
      {
        codeSnippet: codeToSubmit,
        language: exercise.language?.toUpperCase(),
      },
      {
        onSuccess: (response) => {
          console.log("Code submitted successfully:", response);
          setSubmissionData(response.data);
          
          // Connect to SSE for real-time results
          if (response.data?.code?.id) {
            connectToSSE(response.data.code.id);
          }
          
          refetchPracticeTracking();
        },
        onError: (error) => {
          console.error("Error submitting code:", error);
          setIsRunning(false);
        },
      },
    );
  };

  // Load initial code into Java iframe
  const loadJavaCode = useCallback(() => {
    if (javaIframeRef.current && exercise.language === "java") {
      console.log("Loading Java code:", currentCode);
      javaIframeRef.current.contentWindow?.postMessage(
        {
          eventType: "populateCode",
          language: "java",
          files: [
            {
              name: "Main.java",
              content: currentCode,
            },
          ],
        },
        "*",
      );
    }
  }, [currentCode, exercise.language]);

  useEffect(() => {
    if (exercise.language === "java") {
      // Delay to ensure iframe is loaded
      const timer = setTimeout(() => {
        loadJavaCode();
      }, 2000); // Increase polling delay

      return () => clearTimeout(timer);
    }
  }, [loadJavaCode, exercise.language]);

  // Listen for iframe load event
  const handleIframeLoad = useCallback(() => {
    console.log("Java iframe loaded");
    if (exercise.language === "java") {
      // Load code when iframe is ready
      setTimeout(() => {
        console.log("Attempting to load code after iframe load");
        loadJavaCode();
      }, 500);
    }
  }, [exercise.language, loadJavaCode]);

  useEffect(() => {
    // Listen for messages from OneCompiler iframe for Java
    const handleMessage = (event: MessageEvent) => {
      console.log("Received message from iframe:", event.data);

      // Handle code changes
      if (event.data && event.data.language === "java") {
        console.log("Java code changed:", event.data);
        if (event.data.files && event.data.files[0]) {
          console.log("Updating currentCode with:", event.data.files[0].content);
          setCurrentCode(event.data.files[0].content);
        }
      }

      // Handle different event types
      if (event.data && event.data.eventType) {
        switch (event.data.eventType) {
          case "ready":
            console.log("OneCompiler is ready, loading code...");
            setTimeout(loadJavaCode, 100);
            break;
          case "codeChange":
            console.log("Code change event:", event.data);
            if (event.data.files && event.data.files[0]) {
              console.log("Updating currentCode from codeChange:", event.data.files[0].content);
              setCurrentCode(event.data.files[0].content);
            }
            break;
          case "codeResponse":
            console.log("Code response received:", event.data);
            if (event.data.files && event.data.files[0]) {
              console.log("Updating currentCode from response:", event.data.files[0].content);
              setCurrentCode(event.data.files[0].content);
            }
            break;
          default:
            break;
        }
      }
    };

    if (exercise.language === "java") {
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }
  }, [exercise.language, loadJavaCode]);

  // Poll for code changes every 2 seconds to ensure we have the latest code
  useEffect(() => {
    if (exercise.language === "java" && javaIframeRef.current) {
      const pollInterval = setInterval(() => {
        // Request current code from iframe
        javaIframeRef.current?.contentWindow?.postMessage(
          {
            eventType: "getCode",
            requestId: Date.now(),
          },
          "*",
        );
      }, 2000);

      return () => clearInterval(pollInterval);
    }
  }, [exercise.language]);

  // Cleanup SSE connection on component unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const renderCodeEditor = () => {
    if (exercise.language === "java") {
      return (
        <div className="relative border-2 border-[#7c4dff] m-2 rounded">
          <iframe
            ref={javaIframeRef}
            src="https://onecompiler.com/embed/java?listenToEvents=true&codeChangeEvent=true&theme=dark"
            width="100%"
            height="50vh"
            frameBorder="0"
            title="Java Compiler"
            onLoad={handleIframeLoad}
            style={{ height: "50vh" }}
          />
        </div>
      );
    }
  };

  return (
    <div className="flex bg-[#1e1e1e] h-screen">
      {/* Left Panel - Navigation & Content */}
      <div className="w-[380px] bg-[#2d2d30] border-r border-gray-600 flex flex-col">
        {/* Top Navigation Tabs */}
        <div className="flex border-b border-gray-600">
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-3 text-sm flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "content"
                ? "border-white text-white bg-[#1e1e1e]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-white">Content</span>
          </button>
          <button
            onClick={() => setActiveTab("hints")}
            className={`px-4 py-3 text-sm flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "hints"
                ? "border-white text-white bg-[#1e1e1e]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-white">Hints</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("answer");
            }}
            className={`px-4 py-3 text-sm flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "answer"
                ? "border-white text-white bg-[#1e1e1e]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-white">Solution</span>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "content" && (
            <div className="p-4">
              {/* Dropdown Section */}
              <div className="mb-4">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full text-left text-white"
                >
                  <h2 className="text-sm font-medium text-white">
                    {exercise.title}
                  </h2>
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="mt-2 text-xs text-white">
                    <p>{exercise.description}</p>
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="text-sm text-white space-y-4">
                <p className="text-white">{initValue?.title}</p>
                <div
                  style={{ color: '#fff' }}
                  className="text-white"
                  dangerouslySetInnerHTML={{ __html: initValue?.htmlContent }}
                />
              </div>
            </div>
          )}

          {activeTab === "hints" && (
            <div className="p-4">
              <p className="text-sm text-white">
                {initValue?.suggestion}
              </p>
            </div>
          )}

          {activeTab === "answer" && (
            <div className="p-4">
              {showAnswer || failedAttempts >= 3 ? (
                <div>
                  <p className="text-sm text-yellow-400 mb-4">
                    {failedAttempts >= 3 
                      ? "You’ve tried three times. Here’s the solution:" 
                      : "Solution:"}
                  </p>
                  <CodeBlock code={initValue?.answerContent} language="java" />
                </div>
              ) : (
                <p className="text-sm text-white">
                  The solution will appear after three attempts or once you finish the exercise.
                  <br />
                  <span className="text-yellow-400">Attempts used: {failedAttempts}/3</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#2d2d30] border-b border-gray-600 px-4 py-3 flex items-center justify-between">
          <h1 className="text-white font-medium">
            Exercise {exercise.language === "java" ? "(Java)" : "(C++)"}
          </h1>
        </div>

        {/* Code Editor */}
        {renderCodeEditor()}

        {/* Bottom Results Section */}
        <div className="h-96 bg-[#2d2d30] border-t border-gray-600">
          {/* Results Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-600">
            <div className="flex space-x-6">
              <h3 className="text-white font-medium">Results</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveResultTab("content")}
                  className={`text-sm transition-colors ${
                    activeResultTab === "content"
                      ? "text-white border-b border-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Details
                </button>
              </div>
            </div>
            <button
              onClick={handleSubmitCoding}
              disabled={isRunning}
              className={`px-4 py-1 text-sm bg-gray-700 text-white rounded transition-colors hover:bg-gray-600 ${
                isRunning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isRunning ? "Checking..." : "Run tests"}
            </button>
          </div>

          {/* Results Content */}
          <div className="p-4 h-full overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Left Column - Submission Status */}
              <div className="text-sm text-gray-300">
                {activeResultTab === "content" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Submission status:</h4>
                      {isRunning ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          <span className="text-blue-400">Processing...</span>
                        </div>
                      ) : submissionResult ? (
                        <div className={`p-3 rounded ${submissionResult.status === 'PASSED' 
                          ? 'bg-green-900 text-green-200' 
                          : submissionResult.status === 'WRONG'
                          ? 'bg-red-900 text-red-200'
                          : 'bg-yellow-900 text-yellow-200'
                        }`}>
                          <div className="font-medium text-white">
                            {submissionResult.status === 'PASSED' && '✅ Correct!'}
                            {submissionResult.status === 'WRONG' && '❌ Incorrect.'}
                            {submissionResult.status === 'ERROR' && '⚠️ Error.'}
                          </div>
                          {submissionResult.message && (
                            <div className="mt-1 text-sm">{submissionResult.message}</div>
                          )}
                          {submissionResult.output && (
                            <div className="mt-2">
                              <div className="text-sm font-medium">Output:</div>
                              <pre className="mt-1 text-xs bg-black bg-opacity-30 p-2 rounded overflow-x-auto">
                                {submissionResult.output}
                              </pre>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400">No result yet. Press “Run tests” to submit.</p>
                      )}
                    </div>
                    
                    {failedAttempts > 0 && (
                      <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 rounded">
                        <p className="text-yellow-400 text-sm">
                          Incorrect attempts: {failedAttempts}/3
                          {failedAttempts >= 3 && " – The solution is now unlocked."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Right Column - Submission Details */}
              <div className="text-sm text-gray-300">
                {submissionData && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Submission details:</h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-gray-400">ID:</span>
                        <span className="ml-2 font-mono text-white">{submissionData.code.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Submitted at:</span>
                        <span className="ml-2 text-white">
                          {new Date(submissionData.code.submittedAt).toLocaleString('en-US')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Language:</span>
                        <span className="ml-2 text-white">{submissionData.code.language}</span>
                      </div>
                      {submissionData.code.runtimeMs && (
                        <div>
                          <span className="text-gray-400">Runtime:</span>
                          <span className="ml-2 text-white">{submissionData.code.runtimeMs}ms</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the Java exercise for testing
export { defaultJavaExercise };
