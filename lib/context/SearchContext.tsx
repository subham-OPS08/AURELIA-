"use client";

import React, { createContext, useContext, useState } from "react";

interface SearchContextType {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        openSearch: () => setIsOpen(true),
        closeSearch: () => setIsOpen(false),
        toggleSearch: () => setIsOpen((prev) => !prev),
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
