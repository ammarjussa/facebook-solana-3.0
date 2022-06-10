import { createContext, ReactNode } from "react";

export const FacebookContext = createContext<any>(null);

export const FacebookProvider = ({ children }: { children: ReactNode }) => {
  const requestToCreateUserProfile = async (
    walletAddress: string,
    name: string
  ) => {
    try {
      await fetch(`/api/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userWalletAddress: walletAddress,
          name: name,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FacebookContext.Provider
      value={{
        requestToCreateUserProfile,
      }}
    >
      {children}
    </FacebookContext.Provider>
  );
};
