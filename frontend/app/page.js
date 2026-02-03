"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // keep user on landing page when unauthenticated
      return;
    } else {
      router.replace(`/${user.role}`);
    }
  }, [user, loading, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50">
      {!loading && !user ? (
        <div className="max-w-3xl p-8 rounded-lg bg-white/5 border border-white/10 text-center">
          <h1 className="text-3xl font-semibold mb-4">Healthcare Management System</h1>
          <p className="mb-6 text-slate-200">Book appointments, manage records, and collaborate securely.</p>
          <div className="space-x-3">
            <button onClick={() => router.push('/login')} className="px-4 py-2 bg-emerald-500 rounded-md">Sign in</button>
            <button onClick={() => router.push('/register')} className="px-4 py-2 bg-transparent border border-white/20 rounded-md">Create account</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}

