"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar, Users, Stethoscope, AlertCircle, DollarSign, CheckCircle } from "lucide-react";

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const [completeNotes, setCompleteNotes] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const loadAppointments = () => {
    apiRequest("/appointments/doctor")
      .then((data) => {
        setAppointments(data.appointments || []);
      })
      .catch(() => toast.error("Failed to load appointments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleMarkComplete = async (appointmentId) => {
    try {
      await apiRequest(`/appointments/${appointmentId}/complete`, {
        method: "PUT",
        body: JSON.stringify({ doctorNotes: completeNotes }),
      });
      toast.success("Appointment marked as completed!");
      setShowCompleteModal(false);
      setCompletingId(null);
      setCompleteNotes("");
      loadAppointments();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const todayCount = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    const appointmentDate = new Date(a.date).toISOString().split('T')[0];
    return appointmentDate === today;
  }).length;

  const pendingCount = appointments.filter(a => a.status === "pending").length;
  const confirmedCount = appointments.filter(a => !a.isCompleted && (a.status === "confirmed" || a.status === "pending")).length;
  const completedCount = appointments.filter(a => a.isCompleted).length;

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const paymentStatusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-emerald-100 text-emerald-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Doctor Dashboard</h1>
        <p className="text-slate-600">Manage your appointments and patient consultations</p>
      </div>

      {/* Doctor Profile Card */}
      {user && user.specialty && (
        <Card className="border-emerald-200 shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-emerald-700 font-semibold mt-1">
                  <Stethoscope className="inline w-4 h-4 mr-2" />
                  {user.specialty}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Consultation Fee</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">₹{user.specialtyFee || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{todayCount}</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Appointments</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{appointments.length}</p>
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
                <p className="text-sm font-medium text-slate-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{confirmedCount}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{completedCount}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
          <CardTitle className="text-emerald-900">Appointments</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : appointments.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-center">
              <div className="space-y-3">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-600">No appointments scheduled</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {appointments.map((a) => (
                <div
                  key={a._id}
                  className="p-4 rounded-lg border border-slate-200 hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-900">{a.patient?.name || "Unknown"}</p>
                      <p className="text-sm text-slate-600">{a.patient?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {new Date(a.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })} at {a.time}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-slate-600">Reason</p>
                      <p className="text-sm font-medium text-slate-900">{a.reason || a.disease || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Fee</p>
                      <p className="text-sm font-medium text-slate-900">₹{a.fee || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <Badge className={`capitalize ${statusColor[a.status] || "bg-slate-100 text-slate-800"}`}>
                      {a.status}
                    </Badge>
                    <Badge className={`capitalize ${paymentStatusColor[a.paymentStatus] || "bg-slate-100 text-slate-800"}`}>
                      Payment: {a.paymentStatus}
                    </Badge>
                    {a.isCompleted && (
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    )}
                  </div>

                  {!a.isCompleted && a.status !== "cancelled" && (
                    <Button
                      onClick={() => {
                        setCompletingId(a._id);
                        setShowCompleteModal(true);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                      size="sm"
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-slate-200">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
              <CardTitle className="text-emerald-900">Mark Appointment Completed</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Doctor Notes (Optional)</label>
                <textarea
                  className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none"
                  placeholder="Add any notes about the appointment..."
                  value={completeNotes}
                  onChange={(e) => setCompleteNotes(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowCompleteModal(false);
                    setCompleteNotes("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleMarkComplete(completingId)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/doctor/prescriptions">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-200">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-white border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-emerald-900">E-Prescriptions</CardTitle>
                <Stethoscope className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-600">Create and manage e-prescriptions for your patients</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/doctor/patients">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-teal-200">
            <CardHeader className="bg-gradient-to-br from-teal-50 to-white border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-teal-900">Patients List</CardTitle>
                <Users className="w-5 h-5 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-600">View and manage your patient list</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

