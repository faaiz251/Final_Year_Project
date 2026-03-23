"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Users, Stethoscope, Shield, Calendar, AlertCircle, TrendingUp, FileText } from "lucide-react";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/admin/summary")
      .then((data) => setSummary(data))
      .catch((err) => {
        toast.error("Failed to load dashboard data");
        setSummary(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Doctors",
      value: summary?.totalDoctors ?? "-",
      icon: Stethoscope,
      color: "emerald",
      href: "/admin/users?role=doctor",
    },
    {
      label: "Patients",
      value: summary?.totalPatients ?? "-",
      icon: Users,
      color: "blue",
      href: "/admin/users?role=patient",
    },
    {
      label: "Staff",
      value: summary?.totalStaff ?? "-",
      icon: Shield,
      color: "violet",
      href: "/admin/users?role=staff",
    },
    {
      label: "Total Appointments",
      value: summary?.totalAppointments ?? "-",
      icon: Calendar,
      color: "amber",
      href: "/admin/users",
    },
  ];

  const colorStyles = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-900", icon: "text-emerald-600", iconBg: "bg-emerald-100" },
    blue: { bg: "bg-blue-50", text: "text-blue-900", icon: "text-blue-600", iconBg: "bg-blue-100" },
    violet: { bg: "bg-violet-50", text: "text-violet-900", icon: "text-violet-600", iconBg: "bg-violet-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-900", icon: "text-amber-600", iconBg: "bg-amber-100" },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600">Complete system overview and management</p>
      </div>

      {loading ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-slate-500">Loading dashboard data...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Main Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              const style = colorStyles[card.color];
              return (
                <Link key={card.label} href={card.href}>
                  <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">{card.label}</p>
                          <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${style.iconBg}`}>
                          <Icon className={`w-5 h-5 ${style.icon}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Additional Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending Appointments</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{summary?.pendingAppointments ?? 0}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Completed Appointments</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{summary?.completedAppointments ?? 0}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending Payments</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{summary?.pendingPayments ?? 0}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Appointments */}
          {summary?.recentAppointments && summary.recentAppointments.length > 0 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <CardTitle className="text-slate-900">Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {summary.recentAppointments.slice(0, 10).map((apt) => (
                    <div
                      key={apt._id}
                      className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-slate-900">{apt.patient?.name || "Unknown"}</p>
                          <p className="text-sm text-slate-600">with {apt.doctor?.name || "Unknown"}</p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800 capitalize">{apt.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>{new Date(apt.createdAt).toLocaleDateString()}</span>
                        <span>₹{apt.fee || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Management Sections */}
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/admin/users">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-200">
                <CardHeader className="bg-gradient-to-br from-emerald-50 to-white border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-emerald-900">Manage Users</CardTitle>
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-slate-600">Add, edit, or remove users from the system</p>
                  <p className="text-xs text-slate-500 mt-2">Total: {summary?.totalDoctors} doctors, {summary?.totalPatients} patients, {summary?.totalStaff} staff</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/departments">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-teal-200">
                <CardHeader className="bg-gradient-to-br from-teal-50 to-white border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-teal-900">Departments</CardTitle>
                    <Stethoscope className="w-5 h-5 text-teal-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-slate-600">Manage hospital departments and specialties</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/inventory">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-violet-200">
                <CardHeader className="bg-gradient-to-br from-violet-50 to-white border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-violet-900">Inventory</CardTitle>
                    <Shield className="w-5 h-5 text-violet-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-slate-600">Manage medical equipment and supplies inventory</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-gradient-to-br from-amber-50 to-white border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-amber-900">System Status</CardTitle>
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-600">All systems operational</p>
                <p className="text-xs text-slate-500 mt-2">Last updated: {new Date().toLocaleTimeString()}</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

