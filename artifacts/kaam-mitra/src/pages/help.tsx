import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, Phone, Mail, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendSupportMessage } from "@/lib/support";

const STORAGE_KEY = "km_contact_settings";

function getContactSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { supportEmail: "support@kaammitra.in", supportPhone: "+91 88000 00000", supportHours: "Mon–Sat, 9am–6pm" };
}

const faqs = [
  { q: "How do I find a worker?", a: "Go to the Home screen, browse categories or use Search. Tap on a worker card to view their profile, then tap 'Book Appointment' to send a request." },
  { q: "Are the workers verified?", a: "Yes! Workers with a blue verified badge have been manually checked. We verify their ID and work experience before listing them on the platform." },
  { q: "How do I save a worker?", a: "Tap the bookmark icon on any worker card or their profile page. Saved workers appear in the Saved tab for quick access." },
  { q: "How do I book an appointment?", a: "Tap 'Book Appointment' on any worker profile. Fill in your name, phone, address, description of work, and preferred date/time. Our team will confirm your appointment shortly." },
  { q: "How will I know when my appointment is confirmed?", a: "Once you book, you'll see the status in 'My Appointments'. Our admin team will review, approve, and assign a worker — you'll see the status update in real time." },
  { q: "Is KaamMitra free to use?", a: "Browsing and booking is completely free for users. Workers pay a small subscription fee to be listed on the platform." },
  { q: "How do I report a problem with a worker?", a: "Email or call our support team. We take all reports seriously and investigate within 24 hours." },
];

export default function HelpPage() {
  const [, setLocation] = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contact = getContactSettings();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: user?.phoneNumber ?? "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSend = async () => {
    if (!form.subject.trim() || !form.message.trim()) {
      setFormError("Please add a subject and a message.");
      return;
    }
    setSending(true);
    setFormError("");
    try {
      await sendSupportMessage({
        name: form.name.trim() || user?.displayName || "KaamMitra User",
        phone: form.phone.trim() || user?.phoneNumber || "",
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSent(true);
      setForm({ name: "", phone: user?.phoneNumber ?? "", subject: "", message: "" });
    } catch (err) {
      console.error("sendSupportMessage failed:", err);
      setFormError("Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const fieldCls = "w-full bg-white border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-primary px-5 pt-14 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
            data-testid="btn-back"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Help & Support</h1>
        </div>
      </div>

      <div className="px-5 pt-6 pb-10 flex-1">
        <h3 className="text-sm font-bold text-foreground mb-3 px-1">Frequently Asked Questions</h3>
        <div className="flex flex-col gap-2 mb-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-medium text-foreground">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown size={16} className="text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs text-muted-foreground px-4 pb-4 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <h3 className="text-sm font-bold text-foreground mb-3 px-1">Contact Us</h3>
        <div className="flex flex-col gap-3">
          <a
            href={`tel:${contact.supportPhone.replace(/\s/g, "")}`}
            className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Call Support</p>
              <p className="text-xs text-muted-foreground mt-0.5">{contact.supportPhone} · {contact.supportHours}</p>
            </div>
          </a>
          <a
            href={`mailto:${contact.supportEmail}`}
            className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Mail size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Email Us</p>
              <p className="text-xs text-muted-foreground mt-0.5">{contact.supportEmail}</p>
            </div>
          </a>
        </div>

        <h3 className="text-sm font-bold text-foreground mb-3 mt-6 px-1">Send Us a Message</h3>
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-3">
          {sent ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 size={28} className="text-green-600" />
              </div>
              <p className="text-sm font-semibold text-foreground">Message sent!</p>
              <p className="text-xs text-muted-foreground mt-1">Our team will get back to you soon.</p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 text-xs font-semibold text-primary"
                data-testid="btn-send-another"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <input
                className={fieldCls}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-testid="input-message-name"
              />
              <input
                className={fieldCls}
                placeholder="Your phone number"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                data-testid="input-message-phone"
              />
              <input
                className={fieldCls}
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                data-testid="input-message-subject"
              />
              <textarea
                className={fieldCls}
                placeholder="How can we help you?"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                data-testid="input-message-body"
              />
              {formError && <p className="text-xs text-destructive">{formError}</p>}
              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-2xl font-semibold text-sm disabled:opacity-60"
                data-testid="btn-send-message"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sending ? "Sending…" : "Send Message"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
