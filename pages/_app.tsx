import dynamic from "next/dynamic";
import "../styles/globals.css";
import { WalletBalanceProvider } from "../context/useWalletBalance";
import { ModalProvider } from "react-simple-hook-modal";
import { AppProps } from "next/app";
import { DetailsProvider } from "../context/useDetails";

const WalletConnectionProvider: any = dynamic(
  () => import("../context/WalletConnectionProvider") as any,
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <ModalProvider />
        <DetailsProvider>
          <Component {...pageProps} />
        </DetailsProvider>
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  );
}

export default MyApp;
