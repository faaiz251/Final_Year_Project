"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Calendar, Clock, Stethoscope, FileText, AlertCircle } from "lucide-react";

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/appointments/my")
      .then((data) => {
        setAppointments(data.appointments || []);
      })
      .catch(() => toast.error("Failed to load appointments"))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter((a) => a.status === "pending" || a.status === "confirmed");
  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Manage your appointments, records, and prescriptions</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-foreground mt-2">{upcoming.length}</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                <p className="text-3xl font-bold text-foreground mt-2">{appointments.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quick Links</p>
                <div className="flex gap-2 mt-2">
                  <Link href="/patient/records" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                    Records
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/patient/profile" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                    Profile
                  </Link>
                </div>
              </div>
              <div className="p-2 bg-teal-100 rounded-lg">
                <FileText className="w-5 h-5 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="border-border shadow-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-border">
          <CardTitle className="text-foreground">Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : appointments.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-center">
              <div className="space-y-3">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">No appointments yet</p>
                <Link 
                  href="/patient/appointments"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Book an appointment →
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 5).map((a) => (
                <div
                  key={a._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {new Date(a.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })} at {a.time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {a.doctor?.name} • {a.reason || "General checkup"}
                      </p>
                    </div>
                  </div>
                  <Badge className={`capitalize ${statusColor[a.status] || "bg-muted text-foreground"}`}>
                    {a.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/patient/records">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-200">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-white border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-emerald-900">Medical Records</CardTitle>
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-600">View your prescriptions, medical records, and health documents</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/fees">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-teal-200">
            <CardHeader className="bg-gradient-to-br from-teal-50 to-white border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-teal-900">Service Fees</CardTitle>
                <Stethoscope className="w-5 h-5 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-600">Check our service fee schedule and pricing information</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

