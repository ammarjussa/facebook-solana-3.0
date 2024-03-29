import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as anchor from "@project-serum/anchor";
import { SOLANA_HOST } from "../utils/const";

const BalanceContext = createContext<any>(null);

const connection = new anchor.web3.Connection(SOLANA_HOST);

export default function useWalletBalance() {
  const [balance, setBalance] = useContext<any>(BalanceContext);
  return [balance, setBalance];
}

export const WalletBalanceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        if (wallet?.publicKey) {
          const balance = await connection.getBalance(wallet.publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        }
      } catch (err) {
        console.log(err);
        setBalance(0);
      }
    })();
  }, [wallet]);

  return (
    <BalanceContext.Provider value={[balance, setBalance]}>
      {children}
    </BalanceContext.Provider>
  );
};
