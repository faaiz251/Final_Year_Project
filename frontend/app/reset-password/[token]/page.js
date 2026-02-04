"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token;
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword: password }),
      });
      toast.success("Password reset. Please login.");
      router.push("/login");
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
            <p className="text-muted-foreground">Enter your new password below</p>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">New Password</label>
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
                disabled={submitting} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {submitting ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

