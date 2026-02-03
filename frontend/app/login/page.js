"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Healthcare Management System
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-100 mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-100 mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={submitting || loading} className="w-full">
            {submitting || loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-4 text-center space-y-1">
          <div>
            <Link href="/forgot-password" className="text-xs text-emerald-200 hover:underline">
              Forgot your password?
            </Link>
          </div>
          <div className="text-xs text-slate-200">
            New here?{" "}
            <Link href="/register" className="underline text-emerald-300">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

