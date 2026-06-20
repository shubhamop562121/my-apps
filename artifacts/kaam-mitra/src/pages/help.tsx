import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, Phone, Mail } from "lucide-react";

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
            href="tel:+918800000000"
            className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Call Support</p>
              <p className="text-xs text-muted-foreground mt-0.5">+91 88000 00000 · Mon–Sat, 9am–6pm</p>
            </div>
          </a>
          <a
            href="mailto:support@kaammitra.in"
            className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Mail size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Email Us</p>
              <p className="text-xs text-muted-foreground mt-0.5">support@kaammitra.in</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
