import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Check } from "lucide-react";

const cities = [
  "New Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Surat", "Chandigarh", "Indore", "Nagpur", "Bhopal",
];

export default function EditAddressPage() {
  const [, setLocation] = useLocation();
  const [houseNo, setHouseNo] = useState("42B");
  const [street, setStreet] = useState("Rajpur Road");
  const [landmark, setLandmark] = useState("Near Metro Station");
  const [pincode, setPincode] = useState("110001");
  const [selectedCity, setSelectedCity] = useState("New Delhi");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => window.history.back(), 900);
  };

  const inputCls = "w-full bg-white border border-border rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

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
          <div>
            <h1 className="text-xl font-bold text-white">Edit Address</h1>
            <p className="text-white/70 text-xs mt-0.5">Update your service location</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 pb-24 flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">House / Flat No.</label>
            <input
              className={inputCls}
              placeholder="e.g. 42B, Floor 3"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Street / Area</label>
            <input
              className={inputCls}
              placeholder="e.g. Rajpur Road, Sector 14"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Landmark (optional)</label>
            <input
              className={inputCls}
              placeholder="e.g. Near Metro Station"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">PIN Code</label>
            <input
              className={inputCls}
              placeholder="6-digit PIN code"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-2 block">City</label>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    selectedCity === city
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
            <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-foreground">Preview</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {[houseNo, street, landmark, selectedCity, pincode].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-8 pt-3 bg-background border-t border-border">
        <button
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            saved ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
          }`}
          data-testid="btn-save-address"
        >
          {saved ? (
            <>
              <Check size={18} />
              Address Saved!
            </>
          ) : (
            "Save Address"
          )}
        </button>
      </div>
    </div>
  );
}
