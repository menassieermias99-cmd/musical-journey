"use client";

import { useState } from "react";
import { fetchApi, setAuthToken } from "@/lib/api";
import { AuthResponse } from "@/lib/types";
import { X, Lock, Mail } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "auth/login" : "/auth/register";

    try {
      const res = await fetchApi<AuthResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setAuthToken(res.token);
      onSuccess(res.email);
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
        <button className="absolute right-4 top-4 text-slate-400 hover:text-slate-200">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-100 mb-1">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {isLogin
            ? "Sign in to manage your collection snippets"
            : "Register to start saving snippets"}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor=""
              className="block text-xs font-semibold text-slate-300 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr -3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor=""
              className="block text-xs font-semibold text-slate-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Processing ..." : isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="text-xs text-indigo0400 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already registered? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
