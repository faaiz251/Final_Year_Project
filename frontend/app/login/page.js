"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Stethoscope } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      // Error is already handled by the login function
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <Stethoscope className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-600">Sign in to your Healthcare account</p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                  disabled={submitting || loading}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                  disabled={submitting || loading}
                />
              </div>

              <Button 
                type="submit" 
                disabled={submitting || loading} 
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
              >
                {submitting || loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-600">Or</span>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-blue-900">Demo Login (Admin):</p>
              <p className="text-xs text-blue-800">Email: <span className="font-mono">admin@gmail.com</span></p>
              <p className="text-xs text-blue-800">Password: <span className="font-mono">admin1234</span></p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3 text-center">
            <div>
              <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition">
                Forgot your password?
              </Link>
            </div>
            <div className="text-slate-600 text-sm">
              New here?{" "}
              <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold transition">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

