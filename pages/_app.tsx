import dynamic from "next/dynamic";
import "../styles/globals.css";
import { WalletBalanceProvider } from "../providers/WalletBalanceProvider";
import { ModalProvider } from "react-simple-hook-modal";
import { AppProps } from "next/app";
import { DetailsProvider } from "../providers/DetailsProvider";
import { FeedProvider } from "../providers/FeedProvider";

const WalletConnectionProvider: any = dynamic(
  () => import("../providers/WalletConnectionProvider") as any,
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <ModalProvider />
        <FeedProvider>
          <DetailsProvider>
            <Component {...pageProps} />
          </DetailsProvider>
        </FeedProvider>
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  );
}

export default MyApp;
