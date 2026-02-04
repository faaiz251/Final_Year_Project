"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Calendar, User, Shield, Clock } from "lucide-react";

export default function StaffDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/staff/me")
      .then((data) => setProfile(data.user))
      .catch(() => toast.error("Failed to load staff data"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Staff Dashboard</h1>
        <p className="text-slate-600">Manage your work schedule and tasks</p>
      </div>

      {loading ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-slate-500">Loading staff information...</p>
          </CardContent>
        </Card>
      ) : profile ? (
        <>
          {/* Profile Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
              <CardTitle className="text-emerald-900">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-slate-600">Full Name</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{profile.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Email</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Department</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {profile.department?.name || "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Role</p>
                  <p className="text-lg font-semibold text-emerald-600 mt-1 capitalize">{profile.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Department</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                      {profile.department?.name || "-"}
                    </p>
                  </div>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Status</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-2">Active</p>
                  </div>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/staff/schedule">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-200">
                <CardHeader className="bg-gradient-to-br from-emerald-50 to-white border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-emerald-900">Schedule</CardTitle>
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-slate-600">View and manage your work schedule</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="bg-gradient-to-br from-teal-50 to-white border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-teal-900">Work Hours</CardTitle>
                  <Clock className="w-5 h-5 text-teal-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-600">Your current work hours and availability</p>
                <p className="text-xs text-slate-500 mt-2">9:00 AM - 5:00 PM</p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load staff profile</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

