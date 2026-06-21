import { useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Layout from "@/components/Layout";
import { Database, Loader2, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";
import { users, categories, cities, reviews, ads, messages } from "@/data/mockData";

const stripId = <T extends { id: string }>(rows: T[]) => rows.map(({ id, ...rest }) => rest);

const REFERENCE_COLLECTIONS: { name: string; rows: Record<string, unknown>[] }[] = [
  { name: "users", rows: stripId(users) },
  { name: "categories", rows: stripId(categories) },
  { name: "cities", rows: stripId(cities) },
  { name: "reviews", rows: stripId(reviews) },
  { name: "advertisements", rows: stripId(ads) },
  { name: "messages", rows: stripId(messages) },
];

const SEED_WORKERS = [
  { name: "Ramesh Kumar", phone: "+91 98765 43210", category: "Plumber", city: "New Delhi", experience: 8, rating: 4.8, reviewCount: 124, status: "active", verified: true, joinedAt: "2024-01-10", description: "Expert plumber with 8 years experience in residential and commercial plumbing.", profession: "Plumber", about: "Experienced plumber with 8 years of expertise in residential and commercial plumbing. Specializes in pipe fitting, leak repairs, and bathroom installations. Available 24/7 for emergency services.", services: ["Pipe Fitting", "Leak Repair", "Bathroom Installation", "Water Heater", "Drain Cleaning"], avatar: "" },
  { name: "Suresh Sharma", phone: "+91 87654 32109", category: "Electrician", city: "Mumbai", experience: 12, rating: 4.9, reviewCount: 208, status: "active", verified: true, joinedAt: "2024-01-15", description: "Licensed electrician with 12 years in residential wiring, panel upgrades, and safety audits.", profession: "Electrician", about: "Licensed electrician with 12 years in residential wiring, panel upgrades, and safety audits. Certified by the Government of Maharashtra.", services: ["Wiring", "Panel Upgrade", "Fan Installation", "MCB Repair", "Safety Audit"], avatar: "" },
  { name: "Ajay Verma", phone: "+91 76543 21098", category: "Carpenter", city: "Bengaluru", experience: 6, rating: 4.7, reviewCount: 89, status: "active", verified: true, joinedAt: "2024-02-01", description: "Skilled carpenter specializing in custom furniture, modular kitchen fitting, and interior woodwork.", profession: "Carpenter", about: "Skilled carpenter specializing in custom furniture, modular kitchen fitting, and interior woodwork. Uses premium wood and modern techniques.", services: ["Custom Furniture", "Modular Kitchen", "Door Fitting", "Wardrobe", "Interior Woodwork"], avatar: "" },
  { name: "Manoj Yadav", phone: "+91 65432 10987", category: "Painter", city: "Hyderabad", experience: 9, rating: 4.5, reviewCount: 67, status: "active", verified: false, joinedAt: "2024-02-10", description: "Professional painter with expertise in interior and exterior wall painting, texture work.", profession: "Painter", about: "Professional painter with expertise in interior and exterior wall painting, texture work, and waterproofing solutions.", services: ["Interior Painting", "Exterior Painting", "Texture Work", "Waterproofing", "Polish"], avatar: "" },
  { name: "Dinesh Patel", phone: "+91 54321 09876", category: "AC Repair", city: "Pune", experience: 7, rating: 4.6, reviewCount: 143, status: "active", verified: true, joinedAt: "2024-02-14", description: "Certified AC technician trained in servicing all major brands.", profession: "AC Technician", about: "Certified AC technician trained in servicing all major brands including LG, Samsung, Voltas, and Daikin. Offers annual maintenance contracts.", services: ["AC Service", "AC Installation", "Gas Refilling", "PCB Repair", "Annual Maintenance"], avatar: "" },
  { name: "Harish Singh", phone: "+91 43210 98765", category: "CCTV", city: "Jaipur", experience: 5, rating: 4.7, reviewCount: 58, status: "active", verified: true, joinedAt: "2024-03-01", description: "Expert CCTV installer for homes, shops, and offices.", profession: "CCTV Installer", about: "Expert CCTV installer for homes, shops, and offices. Works with all major brands. Also handles DVR/NVR setup and remote viewing configuration.", services: ["Camera Installation", "DVR Setup", "Remote Viewing", "Maintenance", "Upgrades"], avatar: "" },
  { name: "Ravi Gupta", phone: "+91 32109 87654", category: "Mason", city: "New Delhi", experience: 15, rating: 4.4, reviewCount: 32, status: "inactive", verified: false, joinedAt: "2024-03-10", description: "Master mason with 15 years experience in brick laying, plastering, tile work.", profession: "Mason", about: "Master mason with 15 years experience in brick laying, plastering, tile work, and civil construction projects.", services: ["Brick Laying", "Plastering", "Tile Work", "Waterproofing", "Civil Work"], avatar: "" },
  { name: "Pradeep Mishra", phone: "+91 21098 76543", category: "Cleaning", city: "Mumbai", experience: 4, rating: 4.6, reviewCount: 95, status: "active", verified: true, joinedAt: "2024-03-20", description: "Professional home and office cleaning expert.", profession: "Cleaning Worker", about: "Professional home and office cleaning expert. Uses eco-friendly products. Offers one-time deep cleaning and regular maintenance packages.", services: ["Deep Cleaning", "Regular Maintenance", "Sofa Cleaning", "Kitchen Deep Clean", "Bathroom Sanitize"], avatar: "" },
  { name: "Vikram Chauhan", phone: "+91 10987 65432", category: "Welder", city: "Bengaluru", experience: 11, rating: 4.8, reviewCount: 77, status: "active", verified: true, joinedAt: "2024-04-01", description: "Expert welder specializing in MS fabrication, grills, gates, and structural welding.", profession: "Welder", about: "Expert welder specializing in MS fabrication, grills, gates, and structural welding. Works on-site and at workshop.", services: ["MS Fabrication", "Gate Making", "Grill Work", "Structural Welding", "Repairs"], avatar: "" },
  { name: "Santosh Tiwari", phone: "+91 09876 54321", category: "RO Repair", city: "Hyderabad", experience: 6, rating: 4.5, reviewCount: 112, status: "active", verified: true, joinedAt: "2024-04-05", description: "Certified RO technician for all brands including Kent, Aquaguard, and Pureit.", profession: "RO Technician", about: "Certified RO technician for all brands including Kent, Aquaguard, and Pureit. Offers filter replacement, service, and annual AMC.", services: ["RO Service", "Filter Replacement", "Installation", "Repair", "Annual AMC"], avatar: "" },
  { name: "Ashok Pandey", phone: "+91 98765 12345", category: "Labour", city: "Pune", experience: 3, rating: 4.3, reviewCount: 28, status: "active", verified: false, joinedAt: "2024-04-10", description: "Reliable labour available for loading/unloading, shifting, and construction work.", profession: "Labour", about: "Reliable labour available for loading/unloading, shifting, construction assistance, and general daily wage work.", services: ["Loading/Unloading", "House Shifting", "Construction Help", "Daily Wage", "Cleaning"], avatar: "" },
  { name: "Sunil Nair", phone: "+91 87654 12345", category: "Electrician", city: "Jaipur", experience: 4, rating: 4.6, reviewCount: 51, status: "active", verified: true, joinedAt: "2024-04-15", description: "Young and skilled electrician available for all electrical work.", profession: "Electrician", about: "Young and skilled electrician available for all electrical work including wiring, light fitting, inverter installation, and repairs.", services: ["Wiring", "Light Fitting", "Inverter Install", "Switch Repair", "Fan Repair"], avatar: "" },
];

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "seeding" | "done" | "clearing" | "error">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);

  const seedCollection = async (name: string, rows: Record<string, unknown>[]): Promise<string> => {
    const existing = await getDocs(collection(db, name));
    if (!existing.empty) {
      console.log(`[Seed] "${name}" already has ${existing.size} doc(s) — skipped`);
      return `${name}: skipped (${existing.size} existing)`;
    }
    let added = 0;
    for (const row of rows) {
      await addDoc(collection(db, name), { ...row, createdAt: serverTimestamp() });
      added++;
    }
    console.log(`[Seed] "${name}" seeded ${added} doc(s)`);
    return `${name}: +${added}`;
  };

  const handleSeed = async () => {
    setStatus("seeding");
    setMessage("");
    setCount(0);
    try {
      const results: string[] = [];
      results.push(await seedCollection("workers", SEED_WORKERS));
      setCount(1);
      for (let i = 0; i < REFERENCE_COLLECTIONS.length; i++) {
        const c = REFERENCE_COLLECTIONS[i];
        results.push(await seedCollection(c.name, c.rows));
        setCount(i + 2);
      }
      setStatus("done");
      setMessage(`Seeding complete — ${results.join(" · ")}`);
    } catch (err) {
      console.error("[Seed] failed:", err);
      setStatus("error");
      setMessage(`Seeding failed: ${(err as Error).message}. Check Firestore rules and connection.`);
    }
  };

  const handleClear = async () => {
    if (!confirm("This will permanently delete ALL data (workers, users, categories, cities, reviews, ads, messages) from Firestore. Continue?")) return;
    setStatus("clearing");
    setMessage("");
    try {
      const names = ["workers", ...REFERENCE_COLLECTIONS.map((c) => c.name)];
      let total = 0;
      for (const name of names) {
        const snap = await getDocs(collection(db, name));
        for (const d of snap.docs) await deleteDoc(d.ref);
        console.log(`[Seed] cleared ${snap.size} doc(s) from "${name}"`);
        total += snap.size;
      }
      setStatus("idle");
      setMessage(`Cleared ${total} document(s) across all collections.`);
      setCount(0);
    } catch (err) {
      console.error("[Seed] clear failed:", err);
      setStatus("error");
      setMessage(`Clear failed: ${(err as Error).message}. Check Firestore rules.`);
    }
  };

  return (
    <Layout title="Database Seed">
      <div className="max-w-xl space-y-6">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <Database size={16} className="text-primary" />
            <h2 className="font-semibold text-foreground text-sm">Seed All Collections</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700 font-medium mb-1">What this does</p>
              <p className="text-xs text-blue-600">
                Writes sample data to every Firestore collection — <code className="font-mono bg-blue-100 px-1 rounded">workers</code>, <code className="font-mono bg-blue-100 px-1 rounded">users</code>, <code className="font-mono bg-blue-100 px-1 rounded">categories</code>, <code className="font-mono bg-blue-100 px-1 rounded">cities</code>, <code className="font-mono bg-blue-100 px-1 rounded">reviews</code>, <code className="font-mono bg-blue-100 px-1 rounded">advertisements</code>, and <code className="font-mono bg-blue-100 px-1 rounded">messages</code>.
                Each collection is only seeded if it is currently empty, so it is safe to run more than once. After seeding, manage data from each page.
              </p>
            </div>

            {status === "seeding" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-sm">Seeding collection {count} of {REFERENCE_COLLECTIONS.length + 1}…</span>
              </div>
            )}
            {status === "clearing" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 size={16} className="animate-spin text-red-500" />
                <span className="text-sm">Clearing all collections…</span>
              </div>
            )}
            {status === "done" && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <CheckCircle2 size={15} className="text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700 font-medium">{message}</p>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{message}</p>
              </div>
            )}
            {status === "idle" && message && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <CheckCircle2 size={15} className="text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">{message}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSeed}
                disabled={status === "seeding" || status === "clearing"}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-50"
              >
                {status === "seeding" ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
                Seed All Collections
              </button>
              <button
                onClick={handleClear}
                disabled={status === "seeding" || status === "clearing"}
                className="flex items-center gap-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
              >
                <Trash2 size={14} />
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-800 mb-1">⚠️ Firestore Security Rules</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Make sure your Firestore rules allow reads and writes. For development, set:
          </p>
          <pre className="mt-2 text-xs bg-amber-100 rounded-lg p-3 text-amber-900 overflow-x-auto">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /workers/{id} {
      allow read: if true;
      allow write: if true;
    }
  }
}`}</pre>
          <p className="text-xs text-amber-700 mt-2">
            Go to Firebase Console → Firestore → Rules and publish the above for now. Lock it down with proper auth rules before going to production.
          </p>
        </div>
      </div>
    </Layout>
  );
}
