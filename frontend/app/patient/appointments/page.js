"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Calendar, Clock, Stethoscope, AlertCircle } from "lucide-react";

export default function PatientAppointmentsPage() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
    disease: "",
    fee: 0,
  });
  const [booking, setBooking] = useState(false);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDoctors = () => {
    apiRequest("/users/doctors")
      .then((data) => setDoctors(data.doctors || []))
      .catch(() => toast.error("Failed to load doctors"));
  };

  const loadFees = () => {
    apiRequest("/fees")
      .then((data) => setFees(data.fees || []))
      .catch(() => {});
  };

  const loadAppointments = () => {
    apiRequest("/appointments/my")
      .then((data) => setAppointments(data.appointments || []))
      .catch(() => toast.error("Failed to load appointments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDoctors();
    loadAppointments();
    loadFees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.disease) {
      toast.error("Please select a disease/type to determine fee");
      return;
    }
    const feeToPay = form.fee || 0;
    const ok = window.confirm(`Pay ₹${feeToPay} for consultation and book appointment?`);
    if (!ok) return;
    setBooking(true);
    try {
      await apiRequest("/appointments", {
        method: "POST",
        body: JSON.stringify({
          doctorId: form.doctorId,
          date: form.date,
          time: form.time,
          reason: form.reason,
          disease: form.disease,
          fee: feeToPay,
          paymentConfirmed: true,
        }),
      });
      toast.success("Appointment booked successfully");
      setForm({ doctorId: "", date: "", time: "", reason: "", disease: "", fee: 0 });
      loadAppointments();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBooking(false);
    }
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Book Appointment</h1>
        <p className="text-slate-600">Schedule a consultation with one of our doctors</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Booking Form */}
        <div className="md:col-span-1">
          <Card className="border-slate-200 shadow-sm sticky top-6">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
              <CardTitle className="text-emerald-900">Schedule Appointment</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Doctor</label>
                  <select
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    value={form.doctorId}
                    onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                    required
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.specialization || "General"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Visit Type</label>
                  <select
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    value={form.disease}
                    onChange={(e) => {
                      const selected = e.target.value;
                      const found = fees.find((f) => f.disease === selected);
                      setForm({ ...form, disease: selected, fee: found ? found.amount : 0 });
                    }}
                    required
                  >
                    <option value="">Select type</option>
                    {fees.map((f) => (
                      <option key={f.disease} value={f.disease}>
                        {f.disease} — ₹{f.amount}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Date</label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Time</label>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Reason (Optional)</label>
                  <textarea
                    className="w-full h-20 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="Describe your concern"
                  />
                </div>

                {form.fee > 0 && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                    <p className="text-xs font-medium text-emerald-900">Consultation Fee</p>
                    <p className="text-2xl font-bold text-emerald-600">₹{form.fee}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={booking}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {booking ? "Booking..." : "Book appointment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="md:col-span-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
              <CardTitle className="text-emerald-900">Your Appointments</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <p className="text-sm text-slate-500">Loading appointments...</p>
              ) : appointments.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-center">
                  <div className="space-y-3">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-600">No appointments booked yet</p>
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
                          <p className="font-semibold text-slate-900">{a.doctor?.name || "Dr. Unknown"}</p>
                          <p className="text-sm text-slate-600">{a.reason || "General Checkup"}</p>
                        </div>
                        <Badge className={`capitalize ${statusColor[a.status] || "bg-slate-100 text-slate-800"}`}>
                          {a.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(a.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4" />
                          {a.time}
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-slate-600">
                          <Stethoscope className="w-4 h-4" />
                          Fee: ₹{a.fee || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

