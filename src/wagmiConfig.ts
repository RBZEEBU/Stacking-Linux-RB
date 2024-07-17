import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { sepolia } from "wagmi/chains";
import {
  coinbaseWallet,
  injected,
  safe,
  walletConnect,
} from "wagmi/connectors";
import { panic } from "./lib/utils";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

if (!projectId) panic("Project ID is not defined");

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://localhost:3000", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const walletConnectFn = walletConnect({
  projectId,
  metadata,
  showQrModal: false,
});

export const config = createConfig({
  batch: {
    multicall: { wait: 250 },
  },
  chains: [sepolia],
  connectors: [
    injected(),
    safe(),
    coinbaseWallet({ appName: "Zeebu Staking" }),
    walletConnectFn,
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_SEPOLIA_URL!),
  },
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
});
