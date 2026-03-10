import React, { useState, useEffect } from "react";
import { Check, X, Calendar, Clock, Users, Search, Filter } from "lucide-react";
import { dbService } from "../../databaseService";
import { Booking, BookingStatus, Table } from "../../types";

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all",
  );
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [bookingsData, tablesData] = await Promise.all([
        dbService.getBookings(),
        dbService.getTables(),
      ]);
      setBookings(bookingsData);
      setTables(tablesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      // Optimistic update
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status: newStatus } : booking,
        ),
      );
      await dbService.updateBooking(id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update booking status:", error);
      // Revert if error occurs (for robustness in a real app, though not strictly required for this demo)
      loadData();
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
            Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            Cancelled
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            Completed
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Reservations
          </h1>
          <p className="text-gray-500 mt-1">
            Manage table bookings and guest requests.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, phone, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-gray-500 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-10 pl-4 pr-10 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-primary outline-none focus:border-transparent text-sm w-full sm:w-auto shadow-sm cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold w-24">ID</th>
                <th className="p-4 font-semibold min-w-[200px]">
                  Guest Information
                </th>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold text-center w-32">
                  Table & Guests
                </th>
                <th className="p-4 font-semibold w-32">Status</th>
                <th className="p-4 font-semibold text-right w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-4 text-sm font-medium text-gray-500">
                      #{booking.id.split("-")[1]}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">
                        {booking.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {booking.phone}
                      </div>
                      {booking.specialRequests && (
                        <div className="text-xs text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded mt-1 border border-orange-100">
                          Note: {booking.specialRequests}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <Calendar size={14} className="text-gray-400" />{" "}
                        {booking.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock size={14} className="text-gray-400" />{" "}
                        {booking.time}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="inline-flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-bold">
                          <Users size={14} /> {booking.guests}
                        </div>
                        <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                          {tables.find((t) => t.id === booking.tableId)?.name ||
                            "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(booking.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(booking.id, "confirmed")
                              }
                              className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white flex items-center justify-center transition-colors"
                              title="Confirm Booking"
                            >
                              <Check size={16} strokeWidth={3} />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(booking.id, "cancelled")
                              }
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                              title="Cancel Booking"
                            >
                              <X size={16} strokeWidth={3} />
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() =>
                              handleStatusChange(booking.id, "completed")
                            }
                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-gray-900 block mb-1">
                        No reservations found
                      </p>
                      <p>Try adjusting your search criteria or filters.</p>
                    </div>
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

export default AdminBookingPage;
