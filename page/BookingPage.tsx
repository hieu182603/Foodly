import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

interface Table {
  id: number;
  name: string;
  capacity: number;
  location: string;
  status: "available" | "occupied" | "reserved";
}

const BookingPage = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: "2",
    tableId: "",
    specialRequest: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetch("/database.json")
      .then((res) => res.json())
      .then((data) => setTables(data.tables || []))
      .catch((err) => console.error("Error loading tables:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const booking = {
      id: `BK${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };
    const bookings = JSON.parse(
      localStorage.getItem("foodly_bookings") || "[]",
    );
    bookings.push(booking);
    localStorage.setItem("foodly_bookings", JSON.stringify(bookings));
    setIsSubmitted(true);
    setTimeout(() => navigate("/"), 3000);
  };

  const availableTables = tables.filter(
    (t) =>
      t.status === "available" &&
      t.capacity >= parseInt(formData.guests || "1"),
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-textMain mb-3">
            Booking Confirmed!
          </h2>
          <p className="text-textSec mb-6">
            Your table has been reserved successfully. We'll send a confirmation
            to your email shortly.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primaryDark transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-textMain mb-3">
            Reserve Your Table
          </h1>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-4" />
          <p className="text-textSec">
            Fill in the details below to book your dining experience
          </p>
        </div>

        {/* Info Box */}
        <div className="mb-8 bg-primary/5 rounded-2xl p-6 border border-primary/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
            <div>
              <Clock className="text-primary mx-auto mb-2" size={20} />
              <p className="font-bold text-textMain">Opening Hours</p>
              <p className="text-textSec text-xs">Mon-Sun: 10AM - 10PM</p>
            </div>
            <div>
              <Users className="text-primary mx-auto mb-2" size={20} />
              <p className="font-bold text-textMain">Group Booking</p>
              <p className="text-textSec text-xs">For 9+ guests, call us</p>
            </div>
            <div>
              <MessageSquare className="text-primary mx-auto mb-2" size={20} />
              <p className="font-bold text-textMain">Cancellation</p>
              <p className="text-textSec text-xs">Free up to 2 hours before</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-textMain mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full h-12 px-4 rounded-xl bg-background border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-textMain mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-background border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-textMain mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full h-12 px-4 rounded-xl bg-background border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-textMain mb-2">
                  <Calendar className="inline mr-1" size={16} />
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full h-12 px-4 rounded-xl bg-background border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-textMain mb-2">
                  <Clock className="inline mr-1" size={16} />
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-background border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-bold text-textMain mb-2">
                <Users className="inline mr-1" size={16} />
                Number of Guests <span className="text-red-500">*</span>
              </label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl bg-background border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Person" : "People"}
                  </option>
                ))}
                <option value="9+">9+ People</option>
              </select>
            </div>

            {/* Select Table */}
            <div>
              <label className="block text-sm font-bold text-textMain mb-2">
                Select Table <span className="text-red-500">*</span>
              </label>
              <select
                name="tableId"
                value={formData.tableId}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl bg-background border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm cursor-pointer"
              >
                <option value="">Choose a table</option>
                {availableTables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name} - {table.location} (Capacity: {table.capacity})
                  </option>
                ))}
              </select>
              {formData.guests && availableTables.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No available tables for {formData.guests} guests. Please try a
                  different number.
                </p>
              )}
            </div>

            {/* Special Request */}
            <div>
              <label className="block text-sm font-bold text-textMain mb-2">
                <MessageSquare className="inline mr-1" size={16} />
                Special Request (Optional)
              </label>
              <textarea
                name="specialRequest"
                value={formData.specialRequest}
                onChange={handleChange}
                placeholder="Any dietary restrictions, allergies, or special occasions?"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-background border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primaryDark transition-all shadow-lg shadow-primary/25 active:scale-95"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
