"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../../components/ui/table";

export default function DoctorPatientsPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    apiRequest("/appointments/doctor")
      .then((data) => setAppointments(data.appointments || []))
      .catch(() => toast.error("Failed to load patients"));
  }, []);

  const patients = [];
  const seen = new Set();
  appointments.forEach((a) => {
    if (a.patient && !seen.has(a.patient._id)) {
      seen.add(a.patient._id);
      patients.push(a.patient);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>
            {patients.map((p) => (
              <Tr key={p._id}>
                <Td>{p.name}</Td>
                <Td>{p.email}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {patients.length === 0 && (
          <p className="mt-3 text-sm text-slate-400">No patients assigned yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

