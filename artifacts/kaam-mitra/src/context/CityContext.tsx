import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from "react";
import { useCities, type AppCity } from "@/hooks/useCities";

type CityContextValue = {
  cities: AppCity[];
  loading: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
};

const CityContext = createContext<CityContextValue | null>(null);
const STORAGE_KEY = "km_selected_city";

export function CityProvider({ children }: { children: ReactNode }) {
  const { cities, loading } = useCities();
  const [selectedCity, setCityState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "New Delhi";
    } catch {
      return "New Delhi";
    }
  });

  const setSelectedCity = (city: string) => {
    setCityState(city);
    try {
      localStorage.setItem(STORAGE_KEY, city);
    } catch {
      /* ignore persistence errors */
    }
  };

  // Default to the first available city only if the user has never chosen one.
  useEffect(() => {
    if (loading || cities.length === 0) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setSelectedCity(cities[0].name);
      }
    } catch {
      /* ignore */
    }
  }, [loading, cities]);

  return (
    <CityContext.Provider value={{ cities, loading, selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within a CityProvider");
  return ctx;
}
