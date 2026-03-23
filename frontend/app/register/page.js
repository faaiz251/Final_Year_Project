"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ChevronDown } from "lucide-react";

export default function RegisterPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [roles, setRoles] = useState(["patient"]);
  const [specialties, setSpecialties] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialty: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiRequest("/auth/available-roles")
      .then((data) => {
        let available = data.roles || ["admin", "doctor", "staff", "patient"];
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

    // Load specialties for doctor registration
    apiRequest("/auth/specialties")
      .then((data) => {
        setSpecialties(data.specialties || []);
      })
      .catch(() => {
        // fallback to empty
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate specialty for doctors
    if (form.role === "doctor" && !form.specialty) {
      toast.error("Please select a specialty for doctor registration");
      return;
    }

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Create Account</h1>
            <p className="text-slate-600">Join our healthcare platform today</p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                <Input
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={submitting}
                  className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={submitting}
                  className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={submitting}
                  className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Select Your Role</label>
                <div className="relative">
                  <select
                    className="w-full h-11 px-4 pr-10 appearance-none border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition bg-white text-slate-900 font-medium disabled:bg-slate-100"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    disabled={submitting}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role === "admin" && "Administrator"}
                        {role === "doctor" && "Doctor"}
                        {role === "patient" && "Patient"}
                        {role === "staff" && "Healthcare Staff"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-xs text-slate-500">
                  Admin registration closes once an admin is created
                </p>
              </div>

              {/* Medical Specialty (for doctors) */}
              {form.role === "doctor" && (
                <div className="space-y-2 pt-2">
                  <label className="block text-sm font-semibold text-slate-700">Medical Specialty</label>
                  <div className="relative">
                    <select
                      className="w-full h-11 px-4 pr-10 appearance-none border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition bg-white text-slate-900 font-medium disabled:bg-slate-100"
                      value={form.specialty}
                      onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                      disabled={submitting}
                    >
                      <option value="">Choose a specialty...</option>
                      {specialties.map((spec) => (
                        <option key={spec.name} value={spec.name}>
                          {spec.name} - ₹{spec.fee}/consultation
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Select your specialty and the consultation fee will be set automatically
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={submitting} 
                className="w-full h-11 mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </div>

          {/* Sign In Link */}
          <div className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

