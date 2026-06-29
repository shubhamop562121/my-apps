import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Check, Loader2, AlertCircle } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { useAuth } from "@/context/AuthContext";
import { compressImage } from "@/lib/image";

export default function EditProfilePage() {
  const { name: savedName, photoURL: savedPhoto, saveProfile, loading } = useProfile();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoChanged, setPhotoChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const hydrated = useRef(false);

  // Seed the form from the saved profile once it has loaded from Firestore.
  // Doing this in an effect (not useState initializers) avoids capturing empty
  // values before the snapshot resolves — which could otherwise wipe the photo.
  useEffect(() => {
    if (loading || hydrated.current) return;
    setName(savedName);
    setPhoto(savedPhoto);
    hydrated.current = true;
  }, [loading, savedName, savedPhoto]);

  const initials =
    (name || "KaamMitra User")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const handlePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    try {
      const compressed = await compressImage(file);
      setPhoto(compressed);
      setPhotoChanged(true);
    } catch {
      setError("Couldn't process that image. Please try another photo.");
    }
  };

  const handleSave = async () => {
    if (saving) return;
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      // Only send photoURL when the user actually picked a new photo, so saving
      // a name change can never wipe an existing photo.
      await saveProfile(photoChanged ? { name: name.trim(), photoURL: photo } : { name: name.trim() });
      setSaved(true);
      setTimeout(() => window.history.back(), 900);
    } catch (err) {
      setError((err as Error)?.message ?? "Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full bg-white border border-border rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

  if (loading && !hydrated.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-white">Edit Profile</h1>
            <p className="text-white/70 text-xs mt-0.5">Update your name and photo</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-8 pb-28 flex-1 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          {/* Avatar + photo picker */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="relative w-28 h-28 rounded-3xl overflow-hidden bg-primary/10 flex items-center justify-center group"
              data-testid="btn-pick-photo"
            >
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-primary">{initials}</span>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-black/45 py-1.5 flex items-center justify-center gap-1">
                <Camera size={13} className="text-white" />
                <span className="text-[11px] text-white font-medium">Change</span>
              </div>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePick}
              data-testid="input-photo"
            />
            <p className="text-xs text-muted-foreground">Tap the photo to change it</p>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Full Name</label>
            <input
              className={inputCls}
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              data-testid="input-name"
            />
          </div>

          {/* Phone (read-only — identity, can't change) */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Phone Number</label>
            <input
              className="w-full bg-muted/60 border border-border rounded-2xl px-4 py-3.5 text-sm text-muted-foreground"
              value={user?.phoneNumber ?? ""}
              readOnly
              data-testid="input-phone"
            />
            <p className="text-[11px] text-muted-foreground mt-1.5">Your phone number is used to sign in and can't be changed here.</p>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle size={13} /> {error}
            </p>
          )}
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-8 pt-3 bg-background border-t border-border">
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className={`w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
            saved ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
          }`}
          data-testid="btn-save-profile"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Saving…
            </>
          ) : saved ? (
            <>
              <Check size={18} /> Profile Saved!
            </>
          ) : (
            "Save Profile"
          )}
        </button>
      </div>
    </div>
  );
}
