"use client";

import React, { useState } from "react";
import {
  Users,
  LayoutDashboard,
  Map,
  BookOpen,
  BarChart3,
  Settings,
  Bell,
  Search,
} from "lucide-react";


export default function AdminPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? "dark" : ""} flex min-h-screen bg-gray-50 dark:bg-gray-900`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-green-600 mb-8 px-4 py-2">
            DzTours <span className="text-sm text-gray-400 dark:text-gray-300">Admin Panel</span>
          </h1>

          <nav className="space-y-2 px-2">
            <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active />
          </nav>
        </div>

        <div className="px-2">
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Admin User <br />
            <span className="text-xs">admin@dztours.dz</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Platform Overview</h2>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-300" />
              <input
                className="pl-9 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                placeholder="Search users, bookings..."
              />
            </div>
            <Bell className="text-gray-700 dark:text-gray-200" />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Stat title="Total Active Users" value="1,245" note="+12%" icon={<Users className="w-6 h-6 text-green-500" />} />
          <Stat title="Pending Certifications" value="18" urgent icon={<Users className="w-6 h-6 text-yellow-500" />} />
          <Stat title="Bookings (Month)" value="342" note="+22%" icon={<BookOpen className="w-6 h-6 text-blue-500" />} />
          <Stat title="Total Revenue" value="DZD 4.2M" note="+8%" icon={<BarChart3 className="w-6 h-6 text-purple-500" />} />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">Booking Volume</h3>
            <div className="flex items-end gap-4 h-48">
              {["Week 1","Week 2","Week 3","Week 4","Week 5","Current"].map((w, i) => (
                <div key={i} className="flex-1 text-center">
                  <div
                    className={`mx-auto rounded-xl transition-all duration-300 ${i === 5 ? "bg-green-500" : "bg-green-200 dark:bg-green-700"}`}
                    style={{ height: `${(i + 2) * 20}px` }}
                  />
                  <span className="text-xs text-gray-400 dark:text-gray-300">{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">Recent Activity</h3>
            <ul className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <li>👤 New Tourist Registration – 2 mins ago</li>
              <li>📌 New Booking Request – 15 mins ago</li>
              <li>✅ Guide Verification – 1 hour ago</li>
              <li>⚠️ Reported Issue – 3 hours ago</li>
            </ul>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow overflow-x-auto">
          <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">Pending Guide Certifications</h3>

          <table className="w-full text-sm">
            <thead className="text-gray-400 dark:text-gray-300 border-b">
              <tr>
                <th className="text-left py-2">Guide</th>
                <th className="text-center">Region</th>
                <th className="text-center">Date</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <TableRow name="Karim Meziani" region="Algiers" />
              <TableRow name="Yasmina Belkacem" region="Constantine" />
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* Sidebar Item */
function SidebarItem({ icon, label, active, badge }: any) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors
        ${active ? "bg-green-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}

/* Stat Card */
function Stat({ title, value, note, urgent, icon }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow flex justify-between items-center transition-all">
      <div>
        <p className="text-sm text-gray-400 dark:text-gray-300">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</h3>
        {urgent ? (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 rounded">Urgent</span>
        ) : (
          <span className="text-xs text-green-600 dark:text-green-400">{note}</span>
        )}
      </div>
      {icon}
    </div>
  );
}
/* Table Row */
function TableRow({ name, region }: any) {
  // حالة الصف
  const [status, setStatus] = useState<"Pending Review" | "Approved" | "Rejected">("Pending Review");

  // ألوان الحالة حسب القيمة
  const statusStyle = {
    "Pending Review": "bg-yellow-100 text-yellow-700",
    "Approved": "bg-green-100 text-green-700",
    "Rejected": "bg-red-100 text-red-700",
  };

  return (
    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="py-3 text-gray-800 dark:text-gray-100">{name}</td>
      <td className="text-center text-gray-700 dark:text-gray-300">{region}</td>
      <td className="text-center text-gray-700 dark:text-gray-300">Oct 24, 2023</td>
      <td className="text-center">
        <span className={`px-2 rounded ${statusStyle[status]}`}>{status}</span>
      </td>
      <td className="text-center space-x-2">
        <button
          onClick={() => setStatus("Approved")}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-100 hover:text-green-600 transition"
        >
          Approve
        </button>
        <button
          onClick={() => setStatus("Rejected")}
          className="border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
        >
          Reject
        </button>
      </td>
    </tr>
  );
}