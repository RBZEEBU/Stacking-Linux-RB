import { createContext, PropsWithChildren, useCallback, useState } from "react";

function useConnectWalletContext(initialState: boolean) {
  const [isModalOpen, setIsModalOpen] = useState(initialState);

  const open = useCallback(() => setIsModalOpen(true), []);
  const close = useCallback(() => setIsModalOpen(false), []);

  return { isModalOpen, open, close };
}

type UseConnectWalletContext = ReturnType<typeof useConnectWalletContext>;

export const ConnectWalletContext = createContext<UseConnectWalletContext>({
  isModalOpen: false,
  open: () => {},
  close: () => {},
});

export function ConnectWalletProvider({ children }: PropsWithChildren) {
  const value = useConnectWalletContext(false);

  return (
    <ConnectWalletContext.Provider value={value}>
      {children}
    </ConnectWalletContext.Provider>
  );
}
