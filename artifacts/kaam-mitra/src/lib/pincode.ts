/**
 * Live India-wide location lookup via the India Post public PIN code API.
 * No API key required. Given a 6-digit PIN, returns the state, district and
 * every post office / village / locality served by that PIN — covering all of
 * India (cities, towns and villages).
 *
 * API: https://api.postalpincode.in/pincode/{PIN}
 */
export type PincodeResult = {
  state: string;
  district: string;
  areas: string[];
};

type PostOffice = {
  Name?: string;
  District?: string;
  State?: string;
};

type ApiEntry = {
  Status?: string;
  PostOffice?: PostOffice[] | null;
};

export async function lookupPincode(pin: string): Promise<PincodeResult | null> {
  const clean = pin.trim();
  if (!/^\d{6}$/.test(clean)) return null;

  const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`);
  if (!res.ok) throw new Error("Could not reach the location service.");

  const data = (await res.json()) as ApiEntry[];
  const entry = Array.isArray(data) ? data[0] : null;
  if (!entry || entry.Status !== "Success" || !entry.PostOffice?.length) {
    return null;
  }

  const offices = entry.PostOffice;
  const areas = Array.from(
    new Set(offices.map((o) => o.Name?.trim()).filter((n): n is string => !!n)),
  ).sort((a, b) => a.localeCompare(b));

  return {
    state: offices[0].State?.trim() ?? "",
    district: offices[0].District?.trim() ?? "",
    areas,
  };
}
