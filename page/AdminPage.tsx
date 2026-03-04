import React from "react";
import {
    ClipboardList,
    DollarSign,
    Users,
    User as UserIcon,
} from "lucide-react";
import { ORDERS } from "../mockData";
import { User } from "../types";

interface AdminPageProps {
    user: User;
    onLogout: () => void;
}

const AdminPage = ({ user, onLogout }: AdminPageProps) => (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-3xl font-black text-textMain">Admin Dashboard</h1>
                <p className="text-textSec mt-1 text-sm">
                    Xin chào <span className="font-bold">{user.name}</span> –{" "}
                    <span className="uppercase text-primary font-semibold">
                        {user.role}
                    </span>
                </p>
            </div>
            <button
                onClick={onLogout}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-colors"
            >
                Đăng xuất
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                {
                    label: "Total Orders",
                    val: "1,284",
                    change: "+12.5%",
                    icon: ClipboardList,
                    color: "text-primary",
                    bg: "bg-primary/10",
                },
                {
                    label: "Total Revenue",
                    val: "$45,000",
                    change: "+8.2%",
                    icon: DollarSign,
                    color: "text-green-600",
                    bg: "bg-green-100",
                },
                {
                    label: "Table Occupancy",
                    val: "12/20",
                    change: "",
                    icon: Users,
                    color: "text-orange-600",
                    bg: "bg-orange-100",
                },
                {
                    label: "New Customers",
                    val: "85",
                    change: "+15.3%",
                    icon: UserIcon,
                    color: "text-blue-600",
                    bg: "bg-blue-100",
                },
            ].map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div
                            className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}
                        >
                            <stat.icon size={24} />
                        </div>
                        {stat.change && (
                            <span
                                className={`${stat.color} text-sm font-bold bg-white px-2 py-1 rounded-lg border border-gray-100`}
                            >
                                {stat.change}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.val}</h3>
                </div>
            ))}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h4 className="text-lg font-bold">Recent Orders</h4>
                <button className="text-primary text-sm font-bold hover:underline">
                    View All
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Table</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {ORDERS.map((order) => (
                            <tr
                                key={order.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 text-sm font-bold text-primary">{order.id}</td>
                                <td className="px-6 py-4 text-sm font-medium">{order.customer}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{order.table}</td>
                                <td className="px-6 py-4 text-sm font-bold">
                                    {(order.total / 25000).toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    {order.status === "Completed" && (
                                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
                                            {order.status}
                                        </span>
                                    )}
                                    {order.status === "Cooking" && (
                                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-700">
                                            {order.status}
                                        </span>
                                    )}
                                    {order.status === "Cancelled" && (
                                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700">
                                            {order.status}
                                        </span>
                                    )}
                                    {order.status === "Pending" && (
                                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                                            {order.status}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default AdminPage;
