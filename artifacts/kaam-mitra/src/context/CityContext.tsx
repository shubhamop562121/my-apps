import {
  createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode,
} from "react";
import { useCities, type AppCity } from "@/hooks/useCities";
import { detectCity } from "@/lib/geo";

type CityContextValue = {
  cities: AppCity[];
  loading: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  detecting: boolean;
  detectError: string | null;
  detectLocation: () => Promise<void>;
};

const CityContext = createContext<CityContextValue | null>(null);
const STORAGE_KEY = "km_selected_city";

function readStored(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function CityProvider({ children }: { children: ReactNode }) {
  const { cities, loading } = useCities();
  const [selectedCity, setCityState] = useState<string>(readStored);
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);
  const autoTried = useRef(false);

  const setSelectedCity = useCallback((city: string) => {
    setCityState(city);
    setDetectError(null);
    try {
      localStorage.setItem(STORAGE_KEY, city);
    } catch {
      /* ignore persistence errors */
    }
  }, []);

  const detectLocation = useCallback(async () => {
    setDetecting(true);
    setDetectError(null);
    try {
      const { city } = await detectCity();
      setSelectedCity(city);
    } catch (err) {
      setDetectError((err as Error)?.message ?? "Couldn't detect your location.");
      throw err;
    } finally {
      setDetecting(false);
    }
  }, [setSelectedCity]);

  // First launch: if the user has never chosen a city, try to auto-detect it.
  useEffect(() => {
    if (autoTried.current || readStored()) return;
    autoTried.current = true;
    detectLocation().catch(() => {
      /* fall back to the default city effect below */
    });
  }, [detectLocation]);

  // Fallback: once cities load, if nothing is selected and we're not actively
  // detecting, default to the first available city so the app is never blank.
  useEffect(() => {
    if (loading || cities.length === 0 || detecting) return;
    if (!selectedCity) {
      setSelectedCity(cities[0].name);
    }
  }, [loading, cities, detecting, selectedCity, setSelectedCity]);

  return (
    <CityContext.Provider
      value={{ cities, loading, selectedCity, setSelectedCity, detecting, detectError, detectLocation }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within a CityProvider");
  return ctx;
}
