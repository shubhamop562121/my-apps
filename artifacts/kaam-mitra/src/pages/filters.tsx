import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useCity } from "@/context/CityContext";

const categoryOptions = ["Plumber", "Electrician", "Carpenter", "Mason", "Painter", "AC Repair", "Welder", "Labour", "CCTV", "RO Repair", "Cleaning"];

export default function FiltersPage() {
  const [, setLocation] = useLocation();
  const { cities } = useCity();
  const cityOptions = ["All Cities", ...cities.map((c) => c.name)];
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [experience, setExperience] = useState([0, 15]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const reset = () => {
    setSelectedCategories([]);
    setSelectedCity("All Cities");
    setExperience([0, 15]);
    setVerifiedOnly(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-white border-b border-border px-5 pt-14 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            data-testid="btn-back"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div className="flex-1 flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-primary" />
            <h1 className="text-lg font-bold text-foreground">Filters</h1>
          </div>
          <button
            onClick={reset}
            className="text-sm text-muted-foreground font-medium"
            data-testid="btn-reset"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="px-5 pt-5 pb-24 flex flex-col gap-6 flex-1 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-sm font-semibold text-foreground mb-3">Category</h2>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedCategories.includes(cat)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-foreground border-border"
                }`}
                data-testid={`filter-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <h2 className="text-sm font-semibold text-foreground mb-3">City</h2>
          <div className="flex flex-wrap gap-2">
            {cityOptions.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedCity === city
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-foreground border-border"
                }`}
                data-testid={`filter-city-${city.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {city}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Experience</h2>
          <div className="px-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{experience[0]} years</span>
              <span className="text-sm font-semibold text-primary">{experience[0]}–{experience[1]} yrs</span>
              <span className="text-xs text-muted-foreground">{experience[1]} years</span>
            </div>
            <Slider
              min={0}
              max={15}
              step={1}
              value={experience}
              onValueChange={setExperience}
              className="w-full"
              data-testid="slider-experience"
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <div className="flex items-center justify-between bg-white rounded-2xl border border-border p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Verified Workers Only</p>
              <p className="text-xs text-muted-foreground mt-0.5">Show only background-verified workers</p>
            </div>
            <Switch
              checked={verifiedOnly}
              onCheckedChange={setVerifiedOnly}
              data-testid="switch-verified"
            />
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-border px-5 py-4">
        <button
          onClick={() => window.history.back()}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold text-base"
          data-testid="btn-apply-filters"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
