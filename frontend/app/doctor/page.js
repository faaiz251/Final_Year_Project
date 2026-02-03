"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    apiRequest("/appointments/doctor")
      .then((data) => setAppointments(data.appointments || []))
      .catch(() => toast.error("Failed to load appointments"));
  }, []);

  const todayCount = appointments.length;

  return (
    <div className="space-y-6">
      <motion.h2
        className="text-xl font-semibold text-slate-50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Doctor Dashboard
      </motion.h2>
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{todayCount}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {appointments.map((a) => (
                <li key={a._id} className="p-3 bg-white/5 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-slate-50">{a.patient?.name || 'Unknown'}</div>
                      <div className="text-sm text-slate-400">{a.patient?.email}</div>
                    </div>
                    <div className="text-sm text-slate-200">
                      {new Date(a.date).toLocaleDateString()} {a.time}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    <div>Disease/Type: {a.disease || a.reason || '-'}</div>
                    <div>Fee: ₹{a.fee || 0} — Payment: {a.paymentStatus}</div>
                    <div className="mt-1">Status: {a.status}</div>
                  </div>
                </li>
              ))}
              {appointments.length === 0 && <li className="text-sm text-slate-400">No appointments scheduled.</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

