"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../../components/ui/table";

export default function DoctorPrescriptionsPage() {
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([{ name: "", dosage: "" }]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);

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
      .catch(() => {});
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/prescriptions", {
        method: "POST",
        body: JSON.stringify({
          patientId: selectedPatient,
          medications: medications.filter((m) => m.name),
        }),
      });
      toast.success("Prescription created");
      setMedications([{ name: "", dosage: "" }]);
      apiRequest("/prescriptions/doctor/me").then((data) =>
        setPrescriptions(data.prescriptions || [])
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.3fr,1.7fr]">
      <Card>
        <CardHeader>
          <CardTitle>Create Prescription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs mb-1 text-slate-300">Patient</label>
              <select
                className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm"
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
            <div className="space-y-2">
              {medications.map((m, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Medicine name"
                    value={m.name}
                    onChange={(e) => handleMedChange(idx, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Dosage / frequency"
                    value={m.dosage}
                    onChange={(e) => handleMedChange(idx, "dosage", e.target.value)}
                  />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addMedicationRow}>
                Add medicine
              </Button>
            </div>
            <Button type="submit" className="w-full">
              Save prescription
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <Thead>
              <Tr>
                <Th>Patient</Th>
                <Th>Medications</Th>
              </Tr>
            </Thead>
            <Tbody>
              {prescriptions.map((p) => (
                <Tr key={p._id}>
                  <Td>{p.patient?.name}</Td>
                  <Td className="text-xs">
                    {p.medications.map((m) => m.name).join(", ")}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

