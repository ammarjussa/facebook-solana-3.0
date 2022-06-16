import { createContext, ReactNode, useState, useContext } from "react";

export const DetailsContext = createContext<any>(null);

export const DetailsProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [registered, setRegistered] = useState(false);

  return (
    <DetailsContext.Provider
      value={{ name, setName, url, setUrl, registered, setRegistered }}
    >
      {children}
    </DetailsContext.Provider>
  );
};

export function useDetails(): any {
  const context = useContext(DetailsContext);
  if (context === undefined) {
    throw new Error("useContactsContext must be used within Contacts Provider");
  }
  return context;
}
