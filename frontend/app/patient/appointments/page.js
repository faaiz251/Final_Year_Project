"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../../components/ui/table";

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

  const loadDoctors = () => {
    apiRequest("/users/doctors")
      .then((data) => setDoctors(data.doctors || []))
      .catch(() => toast.error("Failed to load doctors"));
  };

  const loadFees = () => {
    apiRequest('/fees')
      .then((data) => setFees(data.fees || []))
      .catch(() => {});
  };

  const loadAppointments = () => {
    apiRequest("/appointments/my")
      .then((data) => setAppointments(data.appointments || []))
      .catch(() => toast.error("Failed to load appointments"));
  };

  useEffect(() => {
    loadDoctors();
    loadAppointments();
    loadFees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate payment flow: ensure fee is present and ask for confirmation
    if (!form.disease) {
      toast.error('Please select a disease/type to determine fee');
      return;
    }
    const feeToPay = form.fee || 0;
    const ok = window.confirm(`Pay ₹${feeToPay} for consultation and book appointment?`);
    if (!ok) return;
    setBooking(true);
    try {
      await apiRequest('/appointments', {
        method: 'POST',
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
      toast.success('Appointment booked');
      setForm({ doctorId: '', date: '', time: '', reason: '', disease: '', fee: 0 });
      loadAppointments();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr,1.6fr]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs mb-1 text-slate-300">Doctor</label>
                <select
                  className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm"
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
              <div>
                <label className="block text-xs mb-1 text-slate-300">Disease / Visit Type</label>
                <select
                  className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm"
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1 text-slate-300">Date</label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-slate-300">Time</label>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1 text-slate-300">Reason</label>
                <Input
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Describe your concern"
                />
              </div>
              <Button type="submit" disabled={booking} className="w-full">
                {booking ? "Booking..." : "Book appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Doctor</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {appointments.map((a) => (
                  <Tr key={a._id}>
                    <Td>
                      {new Date(a.date).toLocaleDateString()} {a.time}
                    </Td>
                    <Td>{a.doctor?.name}</Td>
                    <Td className="capitalize text-emerald-300">{a.status}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {appointments.length === 0 && (
              <p className="mt-3 text-sm text-slate-400">No appointments booked yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

