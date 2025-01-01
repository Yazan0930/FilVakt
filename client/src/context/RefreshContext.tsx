import React, { createContext, useState, useContext } from "react";

interface RefreshContextType {
  refreshFlag: boolean;
  triggerRefresh: () => void;
}

// Create the context
const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

// Provide the context
export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => setRefreshFlag((prev) => !prev);

  return (
    <RefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

// Custom hook to use the context
export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefresh must be used within a RefreshProvider");
  }
  return context;
};
