import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Clock, MapPin, User, Phone, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useWorkers } from "@/hooks/useWorkers";
import { useAppointments } from "@/context/AppointmentsContext";

const timeSlots = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];

export default function BookAppointmentPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/book/:id");
  const { addAppointment } = useAppointments();
  const { workers, loading } = useWorkers();

  const worker = workers.find((w) => w.id === params?.id);

  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    userName: "",
    userPhone: "",
    address: "",
    description: "",
    preferredDate: today,
    preferredTime: "10:00 AM",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [appointmentId, setAppointmentId] = useState("");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading worker profile…</span>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Worker not found.</p>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.userName.trim()) e.userName = "Name is required";
    if (!form.userPhone.trim()) e.userPhone = "Phone is required";
    else if (!/^[+\d\s]{10,}$/.test(form.userPhone)) e.userPhone = "Enter a valid phone number";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.description.trim()) e.description = "Please describe the work needed";
    if (!form.preferredDate) e.preferredDate = "Select a date";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const id = await addAppointment({
        workerId: worker.id,
        workerName: worker.name,
        category: worker.profession,
        ...form,
      });
      setAppointmentId(id);
      setSubmitted(true);
    } catch (err) {
      console.error("addAppointment failed:", err);
      setSubmitError("Could not submit your booking. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full bg-muted rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${errors[field] ? "ring-2 ring-destructive/50" : ""}`;

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center px-5">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Appointment Booked!</h1>
          <p className="text-sm text-muted-foreground mb-1">Your request has been sent to our team.</p>
          <p className="text-xs text-muted-foreground mb-6">We'll review and confirm your appointment shortly.</p>
          <div className="bg-white border border-border rounded-2xl p-4 text-left mb-6">
            <p className="text-xs text-muted-foreground mb-1">Booking ID</p>
            <p className="font-bold text-foreground font-mono text-sm">#{appointmentId.toUpperCase()}</p>
            <div className="border-t border-border my-3" />
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                {worker.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{worker.name}</p>
                <p className="text-xs text-muted-foreground">{worker.profession}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">📅 {form.preferredDate} · {form.preferredTime}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setLocation("/requests")}
              className="w-full bg-primary text-white py-4 rounded-2xl font-semibold text-sm"
            >
              View My Appointments
            </button>
            <button
              onClick={() => setLocation("/home")}
              className="w-full bg-muted text-foreground py-4 rounded-2xl font-semibold text-sm"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-8">
      <div className="bg-white border-b border-border px-5 pt-14 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Book Appointment</h1>
            <p className="text-xs text-muted-foreground">Fill in your details</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {worker.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{worker.name}</p>
            <p className="text-xs text-muted-foreground">{worker.profession} · {worker.city}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4">
          <h2 className="font-bold text-sm text-foreground">Your Details</h2>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
              <User size={12} className="text-primary" /> Full Name
            </label>
            <input
              className={inputCls("userName")}
              placeholder="Enter your name"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
            />
            {errors.userName && <p className="text-xs text-destructive mt-1">{errors.userName}</p>}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
              <Phone size={12} className="text-primary" /> Phone Number
            </label>
            <input
              className={inputCls("userPhone")}
              placeholder="+91 XXXXX XXXXX"
              type="tel"
              value={form.userPhone}
              onChange={(e) => setForm({ ...form, userPhone: e.target.value })}
            />
            {errors.userPhone && <p className="text-xs text-destructive mt-1">{errors.userPhone}</p>}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
              <MapPin size={12} className="text-primary" /> Your Address
            </label>
            <textarea
              className={inputCls("address")}
              placeholder="House no., street, city..."
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
              <FileText size={12} className="text-primary" /> Describe the Work
            </label>
            <textarea
              className={inputCls("description")}
              placeholder="What needs to be fixed or done? Give details..."
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4">
          <h2 className="font-bold text-sm text-foreground">Preferred Schedule</h2>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
              <CalendarDays size={12} className="text-primary" /> Preferred Date
            </label>
            <input
              type="date"
              className={inputCls("preferredDate")}
              value={form.preferredDate}
              min={today}
              onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
            />
            {errors.preferredDate && <p className="text-xs text-destructive mt-1">{errors.preferredDate}</p>}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
              <Clock size={12} className="text-primary" /> Preferred Time
            </label>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, preferredTime: t })}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                    form.preferredTime === t
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {submitError && (
          <p className="text-center text-xs text-destructive">{submitError}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-md mt-1 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Submitting…" : "Confirm Booking"}
        </button>

        <p className="text-center text-xs text-muted-foreground pb-2">
          Our team will review and confirm your appointment
        </p>
      </div>
    </div>
  );
}
