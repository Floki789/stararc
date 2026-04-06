import React, { createContext, useContext, useState } from 'react';

interface DayModeContextValue {
  dayMode: boolean;
  toggleDayMode: () => void;
}

const DayModeContext = createContext<DayModeContextValue>({
  dayMode: false,
  toggleDayMode: () => {},
});

export const DayModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dayMode, setDayMode] = useState(false);
  const toggleDayMode = () => setDayMode((prev) => !prev);
  return (
    <DayModeContext.Provider value={{ dayMode, toggleDayMode }}>
      {children}
    </DayModeContext.Provider>
  );
};

export const useDayMode = () => useContext(DayModeContext);
