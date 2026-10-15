import React, { createContext, useContext, useState } from 'react';

interface DayModeContextValue {
  dayMode: boolean;
  toggleDayMode: () => void;
}

const DayModeContext = createContext<DayModeContextValue>({
  dayMode: true,
  toggleDayMode: () => {},
});

const STORAGE_KEY = 'stararc_day_mode';

export const DayModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dayMode, setDayMode] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? stored === 'true' : true; // default: day mode
  });
  const toggleDayMode = () =>
    setDayMode((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  return (
    <DayModeContext.Provider value={{ dayMode, toggleDayMode }}>
      {children}
    </DayModeContext.Provider>
  );
};

export const useDayMode = () => useContext(DayModeContext);
