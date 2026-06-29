import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Check, Loader2, AlertCircle, Search } from "lucide-react";
import { useCity } from "@/context/CityContext";
import { lookupPincode } from "@/lib/pincode";
import { loadAddress, saveAddress, formatAddress, emptyAddress, type SavedAddress } from "@/lib/address";

export default function EditAddressPage() {
  const [, setLocation] = useLocation();
  const { setSelectedCity: setGlobalCity } = useCity();

  const [form, setForm] = useState<SavedAddress>(() => loadAddress() ?? emptyAddress);
  const [areas, setAreas] = useState<string[]>(() => (form.area ? [form.area] : []));
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "done" | "notfound" | "error">(
    () => (loadAddress()?.city ? "done" : "idle"),
  );
  // The PIN whose lookup successfully resolved the current city/state/area.
  // Save is only allowed when this matches the PIN currently in the field.
  const [resolvedPin, setResolvedPin] = useState<string>(() => loadAddress()?.pincode ?? "");
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<SavedAddress>) => setForm((f) => ({ ...f, ...patch }));

  // Clear any previously auto-filled location so stale data can never be saved.
  const clearResolved = () => {
    setResolvedPin("");
    setAreas([]);
    setForm((f) => ({ ...f, city: "", state: "", area: "" }));
  };

  // Live lookup whenever a complete 6-digit PIN is entered.
  useEffect(() => {
    const pin = form.pincode.trim();
    if (!/^\d{6}$/.test(pin)) {
      setLookupState("idle");
      if (resolvedPin) clearResolved();
      return;
    }
    if (pin === resolvedPin) return;

    let cancelled = false;
    setLookupState("loading");
    const t = setTimeout(async () => {
      try {
        const res = await lookupPincode(pin);
        if (cancelled) return;
        if (!res) {
          clearResolved();
          setLookupState("notfound");
          return;
        }
        setAreas(res.areas);
        setResolvedPin(pin);
        setForm((f) => ({
          ...f,
          state: res.state,
          city: res.district,
          // keep a previously chosen area if it's still valid, else default to first
          area: res.areas.includes(f.area) ? f.area : res.areas[0] ?? "",
        }));
        setLookupState("done");
      } catch {
        if (!cancelled) {
          clearResolved();
          setLookupState("error");
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.pincode]);

  const canSave =
    form.houseNo.trim() !== "" &&
    resolvedPin === form.pincode.trim() &&
    form.city.trim() !== "" &&
    form.state.trim() !== "";

  const handleSave = () => {
    if (!canSave) return;
    saveAddress(form);
    if (form.city) setGlobalCity(form.city);
    setSaved(true);
    setTimeout(() => window.history.back(), 900);
  };

  const inputCls =
    "w-full bg-white border border-border rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";
  const labelCls = "text-xs font-semibold text-foreground mb-1.5 block";
  const autoCls =
    "w-full bg-muted/60 border border-border rounded-2xl px-4 py-3.5 text-sm text-foreground";

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
            <p className="text-white/70 text-xs mt-0.5">Enter your PIN code to auto-detect your area</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 pb-28 flex-1 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
          {/* PIN CODE — the live lookup driver */}
          <div>
            <label className={labelCls}>PIN Code</label>
            <div className="relative">
              <input
                className={`${inputCls} pr-11`}
                placeholder="6-digit PIN code (e.g. 110001)"
                value={form.pincode}
                onChange={(e) => update({ pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                maxLength={6}
                inputMode="numeric"
                data-testid="input-pincode"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {lookupState === "loading" ? (
                  <Loader2 size={18} className="text-primary animate-spin" />
                ) : (
                  <Search size={18} className="text-muted-foreground" />
                )}
              </div>
            </div>
            {lookupState === "notfound" && (
              <p className="flex items-center gap-1.5 text-xs text-amber-600 mt-1.5">
                <AlertCircle size={13} /> No location found for this PIN code. Please check and try again.
              </p>
            )}
            {lookupState === "error" && (
              <p className="flex items-center gap-1.5 text-xs text-destructive mt-1.5">
                <AlertCircle size={13} /> Couldn't reach the location service. Check your connection.
              </p>
            )}
            {lookupState === "done" && (
              <p className="flex items-center gap-1.5 text-xs text-green-600 mt-1.5">
                <Check size={13} /> Location detected — pick your area below.
              </p>
            )}
          </div>

          {/* AREA / VILLAGE — populated from the PIN */}
          <div>
            <label className={labelCls}>Area / Village / Locality</label>
            {areas.length > 0 ? (
              <select
                className={inputCls}
                value={form.area}
                onChange={(e) => update({ area: e.target.value })}
                data-testid="select-area"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className={inputCls}
                placeholder="Enter your PIN code above to load areas"
                value={form.area}
                onChange={(e) => update({ area: e.target.value })}
                data-testid="input-area"
              />
            )}
          </div>

          {/* AUTO-FILLED City + State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>City / District</label>
              <input className={autoCls} value={form.city} readOnly placeholder="Auto-filled" data-testid="input-city" />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input className={autoCls} value={form.state} readOnly placeholder="Auto-filled" data-testid="input-state" />
            </div>
          </div>

          {/* House / Street / Landmark */}
          <div>
            <label className={labelCls}>House / Flat No.</label>
            <input
              className={inputCls}
              placeholder="e.g. 42B, Floor 3"
              value={form.houseNo}
              onChange={(e) => update({ houseNo: e.target.value })}
              data-testid="input-house"
            />
          </div>

          <div>
            <label className={labelCls}>Street / Road</label>
            <input
              className={inputCls}
              placeholder="e.g. Rajpur Road, Sector 14"
              value={form.street}
              onChange={(e) => update({ street: e.target.value })}
              data-testid="input-street"
            />
          </div>

          <div>
            <label className={labelCls}>Landmark (optional)</label>
            <input
              className={inputCls}
              placeholder="e.g. Near Metro Station"
              value={form.landmark}
              onChange={(e) => update({ landmark: e.target.value })}
              data-testid="input-landmark"
            />
          </div>

          {/* Preview */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
            <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-foreground">Your full address</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed" data-testid="text-address-preview">
                {formatAddress(form) || "Fill in the details above to see your address"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-8 pt-3 bg-background border-t border-border">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
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
