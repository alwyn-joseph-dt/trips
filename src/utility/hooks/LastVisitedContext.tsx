import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../constant";

interface LastVisitedContextType {
  lastVisited: string;
  setLastVisited: (path: string) => void;
}

const LastVisitedContext = createContext<LastVisitedContextType>({
  lastVisited: "/",
  setLastVisited: () => { },
});

export const LastVisitedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isNewTemplate = (localStorage.getItem("templateValue"))
  const [lastVisited, setLastVisitedState] = useState<string>(() => {
    return sessionStorage.getItem("lastVisited") || `${ROUTES.DASHBOARD}?theme=${isNewTemplate}`;
  });

  const setLastVisited = (path: string) => {
    setLastVisitedState(path);
    sessionStorage.setItem("lastVisited", path);
  };

  useEffect(() => {
    const publicPaths = ["/login", "/callback", "/"];
    // Only update if current path is NOT a public path
    if (!publicPaths?.includes(location.pathname)) {
      setLastVisited(`${location.pathname}${location.search}`);
    } else {
      setLastVisited(`${ROUTES.DASHBOARD}?theme=${isNewTemplate}`);
    }
  }, [location]);

  return (
    <LastVisitedContext.Provider value={{ lastVisited, setLastVisited }}>
      {children}
    </LastVisitedContext.Provider>
  );
};

export const useLastVisited = () => useContext(LastVisitedContext);
