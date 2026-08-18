"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { Collection, Snippet } from "@/lib/types";
import { X } from "lucide-react";

interface SnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  onCreated: (snippet: Snippet) => void;
}

export default function SnippetModal({
  isOpen,
  onClose,
  collections,
  onCreated,
}: SnippetModalProps) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [tags, setTags] = useState("");
  const [collectionId, setCollectionId] = useState<number>(
    collections[0]?.id || 1,
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const snippet = await fetchApi<Snippet>("/snippets", {
        method: "POST",
        body: JSON.stringify({ title, code, language, tags, collectionId }),
      });
    } catch (err: any) {
      alert("Failed to create snippet: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return;
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-slate-400 hover:text-slate-200"
      >
        <X className="h-5 w-5" />
      </button>

      <h2 className="text-xl font-bold text-slate-100 mb-4">
        New Code Snippet
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor=""
            className="block text-xs font-semibold text-slate-300 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., JWT Authentication Filter"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor=""
              className="block text-xs font-semibold text-slate-300 mb-1"
            >
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="sql">SQL</option>
              <option value="bash">Bash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Collection
            </label>
            <select
              value={collectionId}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-indigo-500"
              onChange={(e) => setCollectionId(Number(e.target.value))}
            >
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs">Tags (comma-separated)</label>

          <input
            type="text"
            value={tags}
            placeholder="spring, security, jwt"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor=""
            className="block text-xs font-semibold text-slate-300 mb-1"
          >
            Code
          </label>
          <textarea
            required
            rows={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste snippet code here ..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <button
          className="block text-xs font-semibold text-slate-300 mb-1"
          type="submit"
        >
          {loading ? "Saving... " : "Save Snippet"}
        </button>
      </form>
    </div>
  </div>;
}
