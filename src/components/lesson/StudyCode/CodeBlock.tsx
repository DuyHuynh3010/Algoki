"use client";
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function CodeBlock({ code, language = "java" }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-700">
      <div className="bg-gray-900 text-white px-4 py-2 font-mono text-sm border-b border-gray-700">
        {language.toUpperCase()}
      </div>
      <SyntaxHighlighter
        language={language}
        style={prism}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "14px",
          background: "white",
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
