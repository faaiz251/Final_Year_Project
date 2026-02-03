"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    apiRequest("/appointments/my")
      .then((data) => setAppointments(data.appointments || []))
      .catch(() => toast.error("Failed to load appointments"));
  }, []);

  const upcoming = appointments.filter((a) => a.status === "pending" || a.status === "confirmed");

  return (
    <div className="space-y-6">
      <motion.h2
        className="text-xl font-semibold text-slate-50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome, {user?.name}
      </motion.h2>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upcoming appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{upcoming.length}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {appointments.slice(0, 5).map((a) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-100">
                    {new Date(a.date).toLocaleDateString()} at {a.time}
                  </p>
                  <p className="text-xs text-slate-400">
                    {a.doctor?.name} • {a.reason}
                  </p>
                </div>
                <span className="text-xs capitalize text-emerald-300">{a.status}</span>
              </motion.div>
            ))}
            {appointments.length === 0 && (
              <p className="text-sm text-slate-400">No appointments yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

