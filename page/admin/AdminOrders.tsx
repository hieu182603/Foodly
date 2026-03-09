import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Search, Download } from "lucide-react";
import { dbService } from "../../databaseService";
import { Order, OrderStatus } from "../../types";

const fmt = (p: number) => `${p.toLocaleString("vi-VN")}đ`;

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Cooking",
  "Completed",
  "Cancelled",
];

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const map: Record<OrderStatus, string> = {
    Completed: "bg-green-100 text-green-700",
    Cooking: "bg-orange-100 text-orange-700",
    Pending: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full ${map[status]}`}>
      {status}
    </span>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<OrderStatus>("Pending");
  const [showAdd, setShowAdd] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: "",
    table: "",
    total: "",
  });

  // Load orders from database
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const allOrders = await dbService.getOrders();
        setOrders(allOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
      }
    };
    loadOrders();
  }, []);

  /* filter */
  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()),
  );

  /* delete */
  const handleDelete = async (id: string) => {
    if (window.confirm("Xóa đơn hàng này?")) {
      try {
        await dbService.deleteOrder(id);
        const allOrders = await dbService.getOrders();
        setOrders(allOrders);
      } catch (error) {
        console.error("Failed to delete order:", error);
        alert("Không thể xóa đơn hàng. Vui lòng thử lại.");
      }
    }
  };

  /* save status edit */
  const handleSaveStatus = async (id: string) => {
    try {
      await dbService.updateOrder(id, { status: editStatus });
      const allOrders = await dbService.getOrders();
      setOrders(allOrders);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Không thể cập nhật đơn hàng. Vui lòng thử lại.");
    }
  };

  /* add new order */
  const handleAddOrder = async () => {
    if (!newOrder.customer || !newOrder.table || !newOrder.total) return;
    const total = Number(newOrder.total);
    if (isNaN(total) || total <= 0) {
      alert("Tổng tiền phải là số dương!");
      return;
    }
    const id = `#ORD-${Date.now()}`;
    const order: Order = {
      id,
      customer: newOrder.customer,
      table: newOrder.table,
      total: total,
      status: "Pending",
    };
    try {
      await dbService.addOrder(order);
      const allOrders = await dbService.getOrders();
      setOrders(allOrders);
      setNewOrder({ customer: "", table: "", total: "" });
      setShowAdd(false);
    } catch (error) {
      console.error("Failed to add order:", error);
      alert("Không thể thêm đơn hàng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-textMain mb-1">
            Quản lý đơn hàng
          </h2>
          <p className="text-textSec text-sm">{orders.length} đơn hàng</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => dbService.export()}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-textMain font-bold rounded-xl hover:bg-gray-200 transition-all text-sm"
            title="Export database.json"
          >
            <Download size={16} /> Export DB
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primaryDark transition-all text-sm shadow-md shadow-primary/20"
          >
            <Plus size={16} /> Thêm đơn
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Tìm theo ID hoặc khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 h-10 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold text-textSec mb-1 block">
              Khách hàng
            </label>
            <input
              value={newOrder.customer}
              onChange={(e) =>
                setNewOrder({ ...newOrder, customer: e.target.value })
              }
              className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tên khách..."
            />
          </div>
          <div className="w-32">
            <label className="text-xs font-semibold text-textSec mb-1 block">
              Bàn
            </label>
            <input
              value={newOrder.table}
              onChange={(e) =>
                setNewOrder({ ...newOrder, table: e.target.value })
              }
              className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="T1..."
            />
          </div>
          <div className="w-40">
            <label className="text-xs font-semibold text-textSec mb-1 block">
              Tổng tiền (đ)
            </label>
            <input
              type="number"
              value={newOrder.total}
              onChange={(e) =>
                setNewOrder({ ...newOrder, total: e.target.value })
              }
              className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="250000"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddOrder}
              className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primaryDark transition-all flex items-center gap-1"
            >
              <Check size={14} /> Lưu
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-textSec hover:bg-white transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                {[
                  "ID",
                  "Khách hàng",
                  "Bàn",
                  "Tổng tiền",
                  "Trạng thái",
                  "Hành động",
                ].map((h) => (
                  <th key={h} className="px-5 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-4 font-bold text-primary">{o.id}</td>
                  <td className="px-5 py-4 font-medium">{o.customer}</td>
                  <td className="px-5 py-4 text-gray-500">{o.table}</td>
                  <td className="px-5 py-4 font-bold">{fmt(o.total)}</td>
                  <td className="px-5 py-4">
                    {editingId === o.id ? (
                      <select
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(e.target.value as OrderStatus)
                        }
                        className="text-xs rounded-lg border border-gray-200 px-2 py-1 outline-none focus:ring-2 focus:ring-primary"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <StatusBadge status={o.status} />
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {editingId === o.id ? (
                        <>
                          <button
                            onClick={() => handleSaveStatus(o.id)}
                            className="text-green-600 hover:text-green-700 p-1.5 rounded-lg hover:bg-green-50 transition-all"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-400 hover:text-gray-500 p-1.5 rounded-lg hover:bg-gray-100 transition-all"
                          >
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(o.id);
                              setEditStatus(o.status);
                            }}
                            className="text-blue-500 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-all"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(o.id)}
                            className="text-red-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-textSec"
                  >
                    Không tìm thấy đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
