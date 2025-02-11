import React, { createContext, useContext, useState } from 'react';

const BlockedDatesContext = createContext();

export function BlockedDatesProvider({ children }) {
  const [blockedDates, setBlockedDates] = useState([]);

  return (
    <BlockedDatesContext.Provider value={{ blockedDates, setBlockedDates }}>
      {children}
    </BlockedDatesContext.Provider>
  );
}

export function useBlockedDates() {
  const context = useContext(BlockedDatesContext);
  if (!context) {
    throw new Error('useBlockedDates must be used within a BlockedDatesProvider');
  }
  return context;
}