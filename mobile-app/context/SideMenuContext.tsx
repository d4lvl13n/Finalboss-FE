import React from 'react';

interface SideMenuContextValue {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

const SideMenuContext = React.createContext<SideMenuContextValue | null>(null);

export function SideMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const openMenu = React.useCallback(() => setIsOpen(true), []);
  const closeMenu = React.useCallback(() => setIsOpen(false), []);

  const value = React.useMemo(
    () => ({ isOpen, openMenu, closeMenu }),
    [isOpen, openMenu, closeMenu]
  );

  return <SideMenuContext.Provider value={value}>{children}</SideMenuContext.Provider>;
}

export function useSideMenu() {
  const context = React.useContext(SideMenuContext);

  if (!context) {
    throw new Error('useSideMenu must be used inside SideMenuProvider');
  }

  return context;
}
