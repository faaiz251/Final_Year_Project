"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../../components/ui/table";

export default function AdminInventoryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "medicine",
    quantity: 0,
    reorderLevel: 0,
  });

  const loadItems = () => {
    apiRequest("/admin/inventory")
      .then((data) => setItems(data.items || []))
      .catch(() => toast.error("Failed to load inventory"));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/admin/inventory", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("Item added");
      setForm({ name: "", category: "medicine", quantity: 0, reorderLevel: 0 });
      loadItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await apiRequest(`/admin/inventory/${id}`, { method: "DELETE" });
      toast.success("Item deleted");
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Qty</Th>
                <Th>Reorder</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {items.map((i) => (
                <Tr key={i._id}>
                  <Td>{i.name}</Td>
                  <Td>{i.category}</Td>
                  <Td>{i.quantity}</Td>
                  <Td>{i.reorderLevel}</Td>
                  <Td>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(i._id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Add Item</CardTitle>
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
              <label className="block text-xs mb-1 text-slate-300">Category</label>
              <select
                className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="medicine">Medicine</option>
                <option value="equipment">Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1 text-slate-300">Quantity</label>
                <Input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-slate-300">Reorder Level</label>
                <Input
                  type="number"
                  value={form.reorderLevel}
                  onChange={(e) =>
                    setForm({ ...form, reorderLevel: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Add item
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

