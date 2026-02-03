"use client";

import { useEffect, useState } from "react";
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Create an account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-100 mb-1">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-100 mb-1">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-100 mb-1">Password</label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-100 mb-1">Role</label>
            <select
              className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-50"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-400">
              Admin can be registered only once; after that it is removed from this list.
            </p>
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating account..." : "Register"}
          </Button>
        </form>
      </div>
    </main>
  );
}

