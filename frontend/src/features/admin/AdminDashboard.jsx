import { useState } from "react";
import Navbar from "../../components/Navbar";
import StatsPanel from "./StatsPanel";
import AuditLogsPanel from "./AuditLogsPanel";
import UsersPanel from "./UsersPanel";
import CropManagement from "./CropManagement";
import ProductManagement from "./ProductManagement";
import TransactionManagement from "./TransactionManagement";
import NotificationManagement from "./NotificationManagement";

function AdminDashboard() {
  const [tab, setTab] = useState("stats");

  const tabs = [
    { key: "stats", label: "📊 Statistics" },
    { key: "users", label: "👥 Users" },
    { key: "crops", label: "🌾 Crops" },
    { key: "products", label: "📦 Products" },
    { key: "transactions", label: "💳 Transactions" },
    { key: "notifications", label: "🔔 Notifications" },
    { key: "audit", label: "📋 Audit Logs" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl text-white p-8 shadow-xl mb-8">
          <h1 className="text-4xl font-bold text-center">Admin Dashboard</h1><br></br>

          <p className="mt-3 text-green-100 text-lg text-center">
            Welcome to the Smart Traders Admin Panel.
          </p>

          <p className="text-green-200 mt-1 text-center">
            Manage users, products, crops, transactions and notifications from
            one place.
          </p>
        </div>

        {/* Dashboard Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Navigation */}
          <div className="flex gap-3 overflow-x-auto p-5 border-b bg-gray-50">
            {tabs.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                  tab === item.key
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {tab === "stats" && <StatsPanel />}
            {tab === "users" && <UsersPanel />}
            {tab === "crops" && <CropManagement />}
            {tab === "products" && <ProductManagement />}
            {tab === "transactions" && <TransactionManagement />}
            {tab === "notifications" && <NotificationManagement />}
            {tab === "audit" && <AuditLogsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;