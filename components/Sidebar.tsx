"use client";

import { Collection, Snippet } from "@/lib/types";
import { Folder, Code2, Plus, Search, FolderPlus } from "lucide-react";

interface SidebarProps {
  collections: Collection[];
  snippets: Snippet[];
  selectedSnippet: Snippet | null;
  onSelectSnippet: (snippet: Snippet) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCreateSnippet: () => void;
  onOpenCreateCollection: () => void;
}

export default function Sidebar({
  collections,
  snippets,
  selectedSnippet,
  onSelectSnippet,
  searchQuery,
  onSearchChange,
  onOpenCreateSnippet,
  onOpenCreateCollection,
}: SidebarProps) {
  return (
    <aside className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search snippets, tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
          onClick={onOpenCreateCollection}
        >
          <Plus className="h-4 w-4" /> New Snippet
        </button>
        <button
          onClick={onOpenCreateCollection}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
          title="New Collection"
        >
          <FolderPlus className="h-4 w-4" />
        </button>
      </div>

      {/* Collections & Snippets List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {collections.map((collection) => {
          const colSnippets = snippets.filter(
            (s) => s.collection?.id === collection.id || !s.collection,
          );

          return (
            <div key={collection.id} className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Folder className="h-3.5 w-3.5 text-indigo-400" />
                <span>{collection.name}</span>
              </div>

              <div className="space-y-0 5">
                {colSnippets.map((snippet) => {
                  const isSelected = selectedSnippet?.id === snippet.id;

                  return (
                    <button
                      key={snippet.id}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${isSelected ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-medium" : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100"}`}
                      onClick={() => onSelectSnippet(snippet)}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Code2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{snippet.title}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {snippet.language}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
