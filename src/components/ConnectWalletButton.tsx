import * as React from "react";
import Image from "next/image";
import { Trans } from "@lingui/macro";
import Button from "@mui/material/Button";

export type ConnectWalletButtonProps = {
  onClick?: () => void;
};

export default function ConnectWalletButton({
  onClick,
}: ConnectWalletButtonProps) {
  return (
    <Button
      id="connectWalletButton"
      color="primary"
      variant="contained"
      size="large"
      startIcon={
        <Image
          src="wallet-icon-dark.svg"
          alt="wallet"
          width={21.25}
          height={19}
        />
      }
      onClick={onClick}
      sx={{ fontWeight: "normal", height: '2.8rem' }}
    >
      <Trans>Connect Wallet</Trans>
    </Button>
  );
}
