"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function RegisterPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [roles, setRoles] = useState(["patient"]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiRequest("/auth/available-roles")
      .then((data) => {
        let available = data.roles || ["admin", "doctor", "staff", "patient"];
        // handle API returning a comma-separated string accidentally
        if (typeof available === "string") {
          available = available.split(",").map((r) => r.trim()).filter(Boolean);
        }
        setRoles(available);
        if (!available.includes(form.role)) {
          setForm((prev) => ({ ...prev, role: available[0] }));
        }
      })
      .catch(() => {
        // fallback to default patient
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      // Do not auto-login after register; redirect to login page
      toast.success("Registered successfully. Please sign in.");
      router.push(`/login`);
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
            <h1 className="text-3xl font-bold text-foreground">Create an account</h1>
            <p className="text-muted-foreground">Join HMS today</p>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Full Name</label>
                <Input
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Role</label>
                <select
                  className="h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Admin can be registered only once; after that it is removed from this list.
                </p>
              </div>
              <Button 
                type="submit" 
                disabled={submitting} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {submitting ? "Creating account..." : "Register"}
              </Button>
            </form>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

