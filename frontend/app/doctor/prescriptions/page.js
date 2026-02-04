"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Plus, Trash2, Pill, AlertCircle } from "lucide-react";

export default function DoctorPrescriptionsPage() {
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([{ name: "", dosage: "" }]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/appointments/doctor")
      .then((data) => {
        const uniq = [];
        const seen = new Set();
        (data.appointments || []).forEach((a) => {
          if (a.patient && !seen.has(a.patient._id)) {
            seen.add(a.patient._id);
            uniq.push(a.patient);
          }
        });
        setPatients(uniq);
      })
      .catch(() => {});

    apiRequest("/prescriptions/doctor/me")
      .then((data) => setPrescriptions(data.prescriptions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMedChange = (idx, field, value) => {
    setMedications((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const addMedicationRow = () => {
    setMedications((prev) => [...prev, { name: "", dosage: "" }]);
  };

  const removeMedicationRow = (idx) => {
    setMedications((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest("/prescriptions", {
        method: "POST",
        body: JSON.stringify({
          patientId: selectedPatient,
          medications: medications.filter((m) => m.name),
        }),
      });
      toast.success("Prescription created successfully");
      setMedications([{ name: "", dosage: "" }]);
      setSelectedPatient("");
      apiRequest("/prescriptions/doctor/me").then((data) =>
        setPrescriptions(data.prescriptions || [])
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPatientName = patients.find((p) => p._id === selectedPatient)?.name || "";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">E-Prescriptions</h1>
        <p className="text-slate-600">Create and manage electronic prescriptions for your patients</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Create Prescription Form */}
        <div className="md:col-span-1">
          <Card className="border-slate-200 shadow-sm sticky top-6">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
              <CardTitle className="text-emerald-900">Create Prescription</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Patient</label>
                  <select
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    required
                  >
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Medications</label>
                  {medications.map((m, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="grid grid-cols-4 gap-2">
                        <Input
                          placeholder="Medicine"
                          value={m.name}
                          onChange={(e) => handleMedChange(idx, "name", e.target.value)}
                          className="col-span-3"
                        />
                        <button
                          type="button"
                          onClick={() => removeMedicationRow(idx)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <Input
                        placeholder="Dosage / frequency (e.g., 2x daily)"
                        value={m.dosage}
                        onChange={(e) => handleMedChange(idx, "dosage", e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMedicationRow}
                    className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add medicine
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !selectedPatient}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {submitting ? "Creating..." : "Create prescription"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Prescriptions */}
        <div className="md:col-span-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
              <CardTitle className="text-emerald-900">Recent Prescriptions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <p className="text-sm text-slate-500">Loading prescriptions...</p>
              ) : prescriptions.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-center">
                  <div className="space-y-3">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-600">No prescriptions created yet</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {prescriptions.map((p) => (
                    <div
                      key={p._id}
                      className="p-4 rounded-lg border border-slate-200 hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-slate-900">{p.patient?.name || "Unknown"}</p>
                          <p className="text-xs text-slate-600">
                            {new Date(p.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800">
                          {p.medications?.length || 0} meds
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        {p.medications?.map((m, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <Pill className="w-3 h-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-slate-900">{m.name}</p>
                              <p className="text-xs text-slate-600">{m.dosage}</p>
                            </div>
                          </div>
                        ))}
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

