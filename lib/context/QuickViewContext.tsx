"use client";

import React, { createContext, useContext, useState } from "react";
import { Product } from "@/types/product";

interface QuickViewContextType {
  product: Product | null;
  isOpen: boolean;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openQuickView = (prod: Product) => {
    setProduct(prod);
    setIsOpen(true);
  };

  const closeQuickView = () => {
    setIsOpen(false);
    setTimeout(() => setProduct(null), 300);
  };

  return (
    <QuickViewContext.Provider
      value={{
        product,
        isOpen,
        openQuickView,
        closeQuickView,
      }}
    >
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error("useQuickView must be used within a QuickViewProvider");
  }
  return context;
}
