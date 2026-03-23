"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Calendar, User, Shield, Clock, CheckCircle, AlertCircle, BarChart3 } from "lucide-react";

export default function StaffDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/staff/me")
      .then((data) => setProfile(data.user))
      .catch(() => toast.error("Failed to load staff data"))
      .finally(() => setLoading(false));
  }, []);

  const getMonthAttendance = () => {
    if (!profile?.attendance) return 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return profile.attendance.filter(a => {
      const date = new Date(a.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && a.status === 'present';
    }).length;
  };

  const getTotalAttendance = () => {
    return profile?.attendance?.length || 0;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Staff Dashboard</h1>
        <p className="text-slate-600">Manage your schedule, attendance, and tasks</p>
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
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                    <p className="text-emerald-700 font-semibold capitalize">{profile.role}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-medium text-slate-900">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-emerald-700">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Department</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {profile.department?.name || "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {profile.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">This Month</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{getMonthAttendance()}</p>
                    <p className="text-xs text-slate-500 mt-1">days present</p>
                  </div>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Attendance</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{getTotalAttendance()}</p>
                    <p className="text-xs text-slate-500 mt-1">days recorded</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Department</p>
                    <p className="text-lg font-bold text-slate-900 mt-2">
                      {profile.department?.name ? profile.department.name : "—"}
                    </p>
                  </div>
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <Shield className="w-5 h-5 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Work Hours</p>
                    <p className="text-lg font-bold text-slate-900 mt-2">9:00 - 5:00</p>
                    <p className="text-xs text-slate-500 mt-1">standard</p>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600" />
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
                    <CardTitle className="text-emerald-900">My Schedule</CardTitle>
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  <p className="text-sm text-slate-600">View and manage your work schedule</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    Click to view your weekly schedule
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-teal-200">
              <CardHeader className="bg-gradient-to-br from-teal-50 to-white border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-teal-900">Attendance Log</CardTitle>
                  <AlertCircle className="w-5 h-5 text-teal-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <p className="text-sm text-slate-600">View your attendance history</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                  {getTotalAttendance()} days recorded
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-white border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-900">Tasks & Duties</CardTitle>
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <p className="text-sm text-slate-600">View assigned tasks and duties</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  No pending tasks
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="bg-gradient-to-br from-violet-50 to-white border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-violet-900">Leave Requests</CardTitle>
                  <Calendar className="w-5 h-5 text-violet-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <p className="text-sm text-slate-600">Request and track leave</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                  No pending requests
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="text-slate-900">Recent Updates</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-900">Schedule Updated</p>
                    <p className="text-sm text-slate-600">Your work schedule for next week has been confirmed</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-900">Attendance Recorded</p>
                    <p className="text-sm text-slate-600">Today's attendance has been marked as present</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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

