"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setToken(res.resetToken);
      toast.success("Reset token generated. Copy it for reset.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">Reset password</h1>
            <p className="text-muted-foreground">Enter your email to receive a reset token</p>
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
              <Button 
                type="submit" 
                disabled={submitting} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {submitting ? "Requesting..." : "Request reset"}
              </Button>
            </form>

            {token && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                <p className="text-xs font-semibold text-foreground mb-2">Reset token (copy for reset page):</p>
                <code className="text-xs break-all text-emerald-700 bg-card p-2 rounded block border border-emerald-100">{token}</code>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Go to login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

