"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Users, Stethoscope, Shield, Calendar } from "lucide-react";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/admin/summary")
      .then((data) => setSummary(data))
      .catch(() => setSummary(null))
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
      label: "Appointments",
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600">System overview and management</p>
      </div>

      {/* Summary Cards */}
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
    </div>
  );
}

