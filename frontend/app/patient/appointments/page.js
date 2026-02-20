"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Calendar, Clock, Stethoscope, AlertCircle, Download, CreditCard, Wallet } from "lucide-react";

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
    paymentMethod: "offline",
  });
  const [booking, setBooking] = useState(false);
  const [fees, setFees] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingAppointmentId, setPendingAppointmentId] = useState(null);

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

  const loadSpecialties = () => {
    apiRequest("/auth/specialties")
      .then((data) => setSpecialties(data.specialties || []))
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
    loadSpecialties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctorId) {
      toast.error("Please select a doctor");
      return;
    }
    if (!form.date) {
      toast.error("Please select a date");
      return;
    }
    if (!form.time) {
      toast.error("Please select a time");
      return;
    }

    // Automatically determine fee from doctor's specialty
    const selectedDoctor = doctors.find(d => d._id === form.doctorId);
    const doctorFee = selectedDoctor?.specialtyFee || 0;
    
    setForm(prev => ({...prev, fee: doctorFee}));

    setBooking(true);
    try {
      const appointmentData = await apiRequest("/appointments", {
        method: "POST",
        body: JSON.stringify({
          doctorId: form.doctorId,
          date: form.date,
          time: form.time,
          reason: form.reason,
          disease: form.disease,
          fee: doctorFee,
          paymentMethod: form.paymentMethod,
        }),
      });

      const appointmentId = appointmentData.appointment._id;

      if (form.paymentMethod === "online") {
        // Proceed to Razorpay payment
        await initiateRazorpayPayment(appointmentId, doctorFee);
      } else {
        // Offline payment - show confirmation
        setPendingAppointmentId(appointmentId);
        setShowPaymentModal(true);
        toast.success("Appointment booked! Payment to be made at counter.");
      }

      setForm({
        doctorId: "",
        date: "",
        time: "",
        reason: "",
        disease: "",
        fee: 0,
        paymentMethod: "offline",
      });
      loadAppointments();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBooking(false);
    }
  };

  const initiateRazorpayPayment = async (appointmentId, amount) => {
    try {
      // Create Razorpay order
      const orderData = await apiRequest("/payments/create-order", {
        method: "POST",
        body: JSON.stringify({
          appointmentId,
          amount,
          doctorId: form.doctorId,
        }),
      });

      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await apiRequest("/payments/verify", {
              method: "POST",
              body: JSON.stringify({
                appointmentId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            toast.success("Payment successful! Appointment confirmed.");
            loadAppointments();
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "Patient",
          email: "patient@hospital.com",
        },
      };

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      toast.error("Failed to initiate payment");
    }
  };

  const exportToPDF = async (appointmentId) => {
    try {
      const pdfUrl = `/api/pdf/appointment/${appointmentId}`;
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `appointment_${appointmentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("PDF downloaded");
    } catch (err) {
      toast.error("Failed to download PDF");
    }
  };

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
                    onChange={(e) => {
                      const selected = doctors.find(d => d._id === e.target.value);
                      setForm({
                        ...form,
                        doctorId: e.target.value,
                        fee: selected?.specialtyFee || 0,
                      });
                    }}
                    required
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.specialty || d.specialization || "General"}) - ₹{d.specialtyFee || 0}
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="payment"
                        value="offline"
                        checked={form.paymentMethod === "offline"}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                        className="w-4 h-4"
                      />
                      <Wallet className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Pay at Counter</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={form.paymentMethod === "online"}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                        className="w-4 h-4"
                      />
                      <CreditCard className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Pay Online (Razorpay)</span>
                    </label>
                  </div>
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
                          <p className="text-sm text-slate-600">{a.doctor?.specialty || a.doctor?.specialization || "General"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`capitalize ${statusColor[a.status] || "bg-slate-100 text-slate-800"}`}>
                            {a.status}
                          </Badge>
                          <Badge className={`capitalize ${paymentStatusColor[a.paymentStatus] || "bg-slate-100 text-slate-800"}`}>
                            {a.paymentMethod === "online" ? "Online" : "Counter"}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
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

                      {a.paymentMethod === "offline" && a.paymentStatus === "pending" && (
                        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                          ⚠ Payment due at counter: ₹{a.fee}
                        </div>
                      )}

                      <Button
                        onClick={() => exportToPDF(a._id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        size="sm"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export as PDF
                      </Button>
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

