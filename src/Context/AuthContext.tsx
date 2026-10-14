import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  insertToken: (tkn: string) => void;
  logoutContext: () => void;
};

export const authContext = createContext<AuthContextType>({
  token: null,
  insertToken: () => {},
  logoutContext: () => {},
});

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  function insertToken(tkn: string) {
    setToken(tkn);
  }

  function logoutContext() {
    setToken(null);
    localStorage.removeItem("token");
  }

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  return (
    <authContext.Provider value={{ token, insertToken, logoutContext }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;