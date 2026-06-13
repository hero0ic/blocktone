"use client";

import { getVolume, initVolume, setVolume } from "@/lib/sounds";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface VolumeContextValue {
  volume: number;
  setVolumeLevel: (v: number) => void;
}

const VolumeContext = createContext<VolumeContextValue>({
  volume: 0.7,
  setVolumeLevel: () => {},
});

export function VolumeProvider({ children }: { children: React.ReactNode }) {
  const [volume, setVolumeState] = useState(0.7);

  useEffect(() => {
    setVolumeState(initVolume());
  }, []);

  const setVolumeLevel = useCallback((v: number) => {
    setVolume(v);
    setVolumeState(getVolume());
  }, []);

  return (
    <VolumeContext.Provider value={{ volume, setVolumeLevel }}>
      {children}
    </VolumeContext.Provider>
  );
}

export function useVolume() {
  return useContext(VolumeContext);
}
