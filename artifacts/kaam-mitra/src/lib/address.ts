/**
 * The user's saved service address. Persisted in localStorage so it shows on the
 * profile page and pre-fills the booking form. Structured so each part can be
 * displayed or edited independently.
 */
export type SavedAddress = {
  houseNo: string;
  street: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
};

const KEY = "km_address";

export const emptyAddress: SavedAddress = {
  houseNo: "",
  street: "",
  landmark: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
};

export function loadAddress(): SavedAddress | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return { ...emptyAddress, ...(JSON.parse(raw) as Partial<SavedAddress>) };
  } catch {
    return null;
  }
}

export function saveAddress(a: SavedAddress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* ignore storage failures */
  }
}

/** Single-line, human-readable address — empty parts are skipped. */
export function formatAddress(a: SavedAddress | null): string {
  if (!a) return "";
  return [a.houseNo, a.street, a.landmark, a.area, a.city, a.state, a.pincode]
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(", ");
}

/** Short label for the profile header — locality + city, falling back gracefully. */
export function shortLocation(a: SavedAddress | null): string {
  if (!a) return "";
  return [a.area || a.city, a.state].map((p) => p?.trim()).filter(Boolean).join(", ");
}
