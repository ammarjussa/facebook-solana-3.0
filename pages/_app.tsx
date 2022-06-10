import dynamic from "next/dynamic";
import "../styles/globals.css";
import { WalletBalanceProvider } from "../context/useWalletBalance";
import { AppProps } from "next/app";

const WalletConnectionProvider: any = dynamic(
  () => import("../context/WalletConnectionProvider") as any,
  {
    ssr: false,
  }
);

const ModalProvider: any = dynamic(
  () => import("react-simple-hook-modal") as any,
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  );
}

export default MyApp;
