import React, { useState } from "react";
import { User } from "../types";
import AdminLayout, { AdminTab } from "../components/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminBookingPage from "./admin/AdminBookingPage";
import AdminMenu from "./admin/AdminMenu";

interface AdminPageProps {
  user: User;
  onLogout: () => void;
}

const AdminPage = ({ user, onLogout }: AdminPageProps) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  return (
    <AdminLayout
      activeTab={activeTab}
      setTab={setActiveTab}
      user={user}
      onLogout={onLogout}
    >
      {activeTab === "dashboard" && <AdminDashboard />}
      {activeTab === "orders" && <AdminOrders />}
      {activeTab === "bookings" && <AdminBookingPage />}
      {activeTab === "menu" && <AdminMenu />}
      {activeTab === "users" && (
        <div className="flex items-center justify-center h-64">
          <p className="text-textSec text-sm font-medium">
            🚧 Tính năng đang phát triển...
          </p>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPage;
