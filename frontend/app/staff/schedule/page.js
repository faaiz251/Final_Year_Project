"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../../components/ui/table";

export default function StaffSchedulePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiRequest("/staff/me")
      .then((data) => setProfile(data.user))
      .catch(() => toast.error("Failed to load schedule"));
  }, []);

  const schedule = profile?.schedule || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <Thead>
            <Tr>
              <Th>Day</Th>
              <Th>Shift</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {schedule.map((s, idx) => (
              <Tr key={idx}>
                <Td>{s.day}</Td>
                <Td>{s.shift}</Td>
                <Td>{s.isOnDuty ? "On duty" : "Off duty"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {schedule.length === 0 && (
          <p className="mt-3 text-sm text-slate-400">No schedule assigned yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

