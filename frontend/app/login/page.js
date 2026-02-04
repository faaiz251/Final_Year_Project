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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">Sign in</h1>
            <p className="text-muted-foreground">Welcome back to HMS</p>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <Button 
                type="submit" 
                disabled={submitting || loading} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {submitting || loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>

          <div className="space-y-3 text-center text-sm">
            <div>
              <Link href="/forgot-password" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Forgot your password?
              </Link>
            </div>
            <div className="text-muted-foreground">
              New here?{" "}
              <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

