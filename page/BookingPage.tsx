import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Users,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  Info,
  CreditCard,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dbService } from "../databaseService";
import { Booking, Table } from "../types";

const BookingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 2,
    name: "",
    phone: "",
    email: "",
    specialRequests: "",
    paymentMethod: "pay_at_restaurant",
    assignedTable: null as Table | null,
  });
  const [tables, setTables] = useState<Table[]>([]);
  const [takenTableIds, setTakenTableIds] = useState<string[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Fetch tables and bookings on mount to determine availability
  useEffect(() => {
    const fetchAvailability = async () => {
      if (formData.date && formData.time) {
        setIsCheckingAvailability(true);
        try {
          const [allTables, allBookings] = await Promise.all([
            dbService.getTables(),
            dbService.getBookings(),
          ]);
          setTables(allTables);

          const taken = allBookings
            .filter(
              (b) =>
                b.date === formData.date &&
                b.time === formData.time &&
                b.status !== "cancelled" &&
                b.tableId,
            )
            .map((b) => b.tableId);

          setTakenTableIds(taken);
          // Auto-clear selected table if it becomes taken or doesn't fit
          if (formData.assignedTable) {
            const stillValid =
              allTables.find((t) => t.id === formData.assignedTable?.id) &&
              !taken.includes(formData.assignedTable.id) &&
              formData.assignedTable.capacity >= formData.guests;
            if (!stillValid)
              setFormData((prev) => ({ ...prev, assignedTable: null }));
          }
        } catch (error) {
          console.error("Failed to check availability:", error);
        } finally {
          setIsCheckingAvailability(false);
        }
      }
    };

    // debounce slightly
    const timeoutId = setTimeout(fetchAvailability, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.date, formData.time, formData.guests]);

  const timeSlots = [
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
  ];

  const handleNext = () => setStep((s) => Math.min(3, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!formData.assignedTable) {
        setError("Please select a table to proceed.");
        setIsSubmitting(false);
        return;
      }

      const newBooking: Booking = {
        id: `B-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        status: "pending",
        specialRequests: formData.specialRequests,
        paymentMethod: formData.paymentMethod,
        tableId: formData.assignedTable.id,
        createdAt: new Date().toISOString(),
      };

      await dbService.addBooking(newBooking);
      setStep(4); // Success step
    } catch (err) {
      console.error("Booking failed:", err);
      setError("Failed to submit your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Book a Table
          </h1>
          <p className="text-gray-500">
            Reserve your spot and get ready for a delightful culinary
            experience.
          </p>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>

              <div
                className={`relative z-10 flex flex-col items-center gap-2 ${step >= 1 ? "text-primary" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 ${step >= 1 ? "bg-primary text-white border-primary/20" : "bg-white border-gray-200"}`}
                >
                  1
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Details
                </span>
              </div>
              <div
                className={`relative z-10 flex flex-col items-center gap-2 ${step >= 2 ? "text-primary" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors duration-300 ${step >= 2 ? "bg-primary text-white border-primary/20" : "bg-white border-gray-200"}`}
                >
                  2
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Contact
                </span>
              </div>
              <div
                className={`relative z-10 flex flex-col items-center gap-2 ${step >= 3 ? "text-primary" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors duration-300 ${step >= 3 ? "bg-primary text-white border-primary/20" : "bg-white border-gray-200"}`}
                >
                  3
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Confirm
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Step 1: Reservation Details */}
          {step === 1 && (
            <div className="p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Calendar className="text-primary" /> When are you coming?
              </h2>

              <div className="space-y-8">
                {/* Guests */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Users size={18} /> Number of Guests
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          guests: Math.max(1, p.guests - 1),
                        }))
                      }
                      className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <div className="text-3xl font-extrabold text-gray-900 w-16 text-center">
                      {formData.guests}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          guests: Math.min(20, p.guests + 1),
                        }))
                      }
                      className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar size={18} /> Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock size={18} /> Time
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData({ ...formData, time })}
                        className={`h-12 rounded-xl border-2 font-bold transition-all ${
                          formData.time === time
                            ? "border-primary bg-primary text-white shadow-md shadow-primary/30"
                            : "border-gray-200 text-gray-600 hover:border-primary/50"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table Selection Area - Show only if Date and Time are picked */}
              {formData.date && formData.time && (
                <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in duration-500">
                  <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-primary text-white flex items-center justify-center text-xs">
                        {tables.length}
                      </div>
                      Available Tables
                    </span>
                    {isCheckingAvailability && (
                      <span className="text-primary text-xs flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        Checking...
                      </span>
                    )}
                  </label>

                  {tables.length === 0 && !isCheckingAvailability ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No tables found in database.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {tables.map((table) => {
                        const isTaken =
                          takenTableIds.includes(table.id) ||
                          table.status === "unavailable";
                        const isTooSmall = table.capacity < formData.guests;
                        const isDisabled = isTaken || isTooSmall;
                        const isSelected =
                          formData.assignedTable?.id === table.id;

                        return (
                          <div
                            key={table.id}
                            onClick={() =>
                              !isDisabled &&
                              setFormData((prev) => ({
                                ...prev,
                                assignedTable: table,
                              }))
                            }
                            className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                              isDisabled
                                ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
                                : isSelected
                                  ? "border-primary bg-primary/5 cursor-pointer shadow-sm shadow-primary/10"
                                  : "border-gray-200 cursor-pointer hover:border-primary/40 bg-white"
                            }`}
                          >
                            {/* Disabled Overlay text */}
                            {isDisabled && (
                              <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10 backdrop-blur-[1px]">
                                <span className="bg-white/90 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                  {isTaken
                                    ? "Booked"
                                    : `Needs ${formData.guests} seats`}
                                </span>
                              </div>
                            )}

                            {/* Selected Check */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 text-primary">
                                <Check size={16} strokeWidth={3} />
                              </div>
                            )}

                            <div className="font-bold text-gray-900 mb-1">
                              {table.name}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Users size={10} /> {table.capacity}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-10">
                <button
                  onClick={handleNext}
                  disabled={
                    !formData.date || !formData.time || !formData.assignedTable
                  }
                  className="w-full h-14 bg-primary text-white font-bold rounded-xl text-lg hover:bg-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formData.assignedTable
                    ? "Continue to Details"
                    : "Select a table to continue"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div className="p-8 sm:p-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <User className="text-primary" /> Your Details
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="0123 456 789"
                        className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@example.com"
                        className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <div className="relative">
                    <Info
                      className="absolute left-4 top-4 text-gray-400"
                      size={20}
                    />
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialRequests: e.target.value,
                        })
                      }
                      placeholder="Allergies, wheelchair access, special occasion..."
                      className="w-full min-h-[120px] py-4 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 outline-none transition-colors resize-y"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  onClick={handleBack}
                  className="w-1/3 h-14 bg-gray-100 text-gray-700 font-bold rounded-xl text-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.name || !formData.phone}
                  className="w-2/3 h-14 bg-primary text-white font-bold rounded-xl text-lg hover:bg-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Booking
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="p-8 sm:p-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Check className="text-primary" /> Review & Confirm
              </h2>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">
                  Reservation Details
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-gray-500">Date</div>
                  <div className="font-bold text-gray-900 text-right">
                    {formData.date}
                  </div>
                  <div className="text-gray-500">Time</div>
                  <div className="font-bold text-gray-900 text-right">
                    {formData.time}
                  </div>
                  <div className="text-gray-500">Guests</div>
                  <div className="font-bold text-gray-900 text-right">
                    {formData.guests} People
                  </div>
                  <div className="text-gray-500">Table</div>
                  <div className="font-bold text-primary text-right flex items-center justify-end gap-1">
                    {formData.assignedTable?.name}
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-1">
                      {formData.assignedTable?.capacity} seats
                    </span>
                  </div>
                  <div className="text-gray-500">Name</div>
                  <div className="font-bold text-gray-900 text-right">
                    {formData.name}
                  </div>
                  <div className="text-gray-500">Phone</div>
                  <div className="font-bold text-gray-900 text-right">
                    {formData.phone}
                  </div>
                  {formData.specialRequests && (
                    <>
                      <div className="text-gray-500 col-span-2 mt-2">
                        Special Requests
                      </div>
                      <div className="font-medium text-gray-700 col-span-2 bg-white p-3 rounded-lg border border-gray-200 italic">
                        "{formData.specialRequests}"
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === "pay_at_restaurant" ? "border-primary bg-orange-50/50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="pay_at_restaurant"
                      checked={formData.paymentMethod === "pay_at_restaurant"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="text-primary focus:ring-primary w-5 h-5"
                    />
                    <span className="font-semibold text-gray-800 flex items-center gap-2">
                      <CreditCard size={18} /> Pay at Restaurant
                    </span>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === "pay_now_online" ? "border-primary bg-orange-50/50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="pay_now_online"
                      checked={formData.paymentMethod === "pay_now_online"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="text-primary focus:ring-primary w-5 h-5"
                      disabled
                    />
                    <span className="font-semibold text-gray-400 flex items-center gap-2">
                      <CreditCard size={18} /> Pay Now (Coming soon)
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-200">
                    {error}
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="w-1/3 h-14 bg-gray-100 text-gray-700 font-bold rounded-xl text-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-2/3 h-14 flex items-center justify-center gap-2 bg-black text-white font-bold rounded-xl text-lg hover:bg-gray-900 transition-colors shadow-xl shadow-black/20 disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="p-10 sm:p-16 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={48} strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Booking Confirmed!
              </h2>
              <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                Thank you,{" "}
                <span className="font-bold text-gray-900">{formData.name}</span>
                ! Your table ({formData.assignedTable?.name}) for{" "}
                {formData.guests} has been reserved for{" "}
                <strong className="text-gray-900">{formData.date}</strong> at{" "}
                <strong className="text-gray-900">{formData.time}</strong>.
                We've sent a confirmation email to {formData.email}.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-4 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => navigate("/menu")}
                  className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primaryDark transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
