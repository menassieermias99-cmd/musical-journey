"use client";

import { Snippet } from "@/lib/types";
import { useState, useEffect } from "react";
import { Copy, Check, Trash2, Calendar, Tag } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";

interface SnippetViewerProps {
  snippet: Snippet | null;
  onDeleteSnippet: (id: number) => void;
  isAuthenticated: boolean;
}

export default function SnippetViewer({
  snippet,
  onDeleteSnippet,
  isAuthenticated,
}: SnippetViewerProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [snippet]);

  if (!snippet) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
        <p className="text-base font-medium">
          Select a snippet from the sidebar or create a new one.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tagList = snippet.tags
    ? snippet.tags.split(",").map((t) => t.trim())
    : [];

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto">
      {/* Top header */}
      <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/30">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-100">
              {snippet.title}
            </h1>
            <span className="text-xs font-mono uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
              {snippet.language}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(snippet.createdAt).toLocaleDateString()}
            </span>
            {tagList.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-slate-500" />
                {tagList.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[11px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors">
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy Code"}
          </button>

          {isAuthenticated && (
            <button
              onClick={() => onDeleteSnippet(snippet.id)}
              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors"
              title="Delete Snippet"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Code Area */}
      <div className="p-6 flex-1">
        <div className="relative rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <pre className="p-4 text-sm font-mono overflow-x-auto m-0">
            <code className={`language-${snippet.language}`}>
              {snippet.code}
            </code>
          </pre>
        </div>
      </div>
    </main>
  );
}
