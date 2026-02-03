"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../../components/ui/table";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);

  const loadDepartments = () => {
    setLoading(true);
    apiRequest("/admin/departments")
      .then((data) => setDepartments(data.departments || []))
      .catch(() => toast.error("Failed to load departments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/admin/departments", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("Department created");
      setForm({ name: "", description: "" });
      loadDepartments();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this department?")) return;
    try {
      await apiRequest(`/admin/departments/${id}`, { method: "DELETE" });
      toast.success("Department deleted");
      setDepartments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-300">Loading departments...</p>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Description</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {departments.map((d) => (
                  <Tr key={d._id}>
                    <Td>{d.name}</Td>
                    <Td className="text-xs text-slate-400">{d.description}</Td>
                    <Td>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(d._id)}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Create Department</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs mb-1 text-slate-300">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-slate-300">Description</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              Create department
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

