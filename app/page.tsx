"use client";

import { useState, useEffect, cloneElement } from "react";
import Sidebar from "@/components/Sidebar";
import SnippetViewer from "@/components/SnippetViewer";
import AuthModal from "@/components/AuthModal";
import SnippetModal from "@/components/SnippetModal";

import { fetchApi, getAuthToken, removeAuthToken } from "@/lib/api";
import { Collection, Snippet } from "@/lib/types";
import { LogIn, LogOut, Search, Terminal } from "lucide-react";

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);

  useEffect(() => {
    loadData();
    if (getAuthToken()) {
      setUserEmail("Authenticated User");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchApi<Snippet[]>(`/snippets?q=${encodeURIComponent(searchQuery)}`)
          .then(setSnippets)
          .catch(console.error);
      } else {
        loadSnippets();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadData = async () => {
    try {
      const cols = await fetchApi<Collection[]>("/collections");
      setCollections(cols);
      await loadSnippets();
    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  };

  const loadSnippets = async () => {
    const data = await fetchApi<Snippet[]>("/snippets");
    setSnippets(data);
    if (data.length > 0 && !selectedSnippet) {
      setSelectedSnippet(data[0]);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setUserEmail(null);
  };

  const handleDeleteSnippet = async (id: number) => {
    try {
      await fetchApi(`/snippets/${id}`, { method: "DELELTE" });
      const updated = snippets.filter((s) => s.id !== id);
      setSnippets(updated);
      setSelectedSnippet(updated[0] || null);
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-500 text-slate-100 font-sans">
      {/* Top Header Bar */}
      <header className="h-14 boder-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-indigo-400" />
          <span className="font-bold text-sm tracking-wide text-slate-100">
            DEV SNIPPET HUB
          </span>
        </div>

        <div className="flex items-center gap-4">
          {userEmail ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Signed in</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5 " /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Split Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          collections={collections}
          snippets={snippets}
          selectedSnippet={selectedSnippet}
          onSelectSnippet={setSelectedSnippet}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCreateSnippet={() => {
            if (!getAuthToken()) {
              setIsAuthOpen(true);
            } else {
              setIsSnippetModalOpen(true);
            }
          }}
          onOpenCreateCollection={() => {
            if (!getAuthToken()) setIsAuthOpen(true);
          }}
        />

        <SnippetViewer
          snippet={selectedSnippet}
          onDeleteSnippet={handleDeleteSnippet}
          isAuthenticated={!!userEmail}
        />
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(email) => setUserEmail(email)}
      />

      <SnippetModal
        isOpen={isSnippetModalOpen}
        onClose={() => setIsSnippetModalOpen(false)}
        collections={collections}
        onCreated={(newSnippet) => {
          setSnippets([newSnippet, ...snippets]);
          setSelectedSnippet(newSnippet);
        }}
      />
    </div>
  );
}
