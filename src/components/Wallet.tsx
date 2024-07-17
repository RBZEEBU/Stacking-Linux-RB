"use client";

import * as React from "react";
import { Trans } from "@lingui/macro";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { tooltipClasses } from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import { formatHash } from "@/lib/formatting";
import AppBarMenu from "./AppBarMenu";
import WalletModal from "./WalletModal";
import ArrowDownIcon from "./icons/ArrowDownIcon";
import { ColorModeContext } from "@/contexts/ColorMode";
import WalletModalIcon from "./icons/WalletModalIcon";
import HistoryIcon from "./icons/HistoryIcon";
import DisconnectIcon from "./icons/DisconnectIcon";
import { ConnectWalletContext } from "@/contexts/ConnectWallet";
import ConnectWalletButton from "./ConnectWalletButton";
import { useRouter } from "next/navigation";

export default function ConnectSection() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTab, setModalTab] = React.useState(0);
  const { open } = React.useContext(ConnectWalletContext);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { mode } = React.useContext(ColorModeContext);
  const router = useRouter();

  const openModal = (tabIndex: number) => () => {
    setMenuOpen(false);
    setModalTab(tabIndex);
    setModalOpen(true);
  };

  if (isConnected) {
    return (
      <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
        <div>
          <AppBarMenu
            open={menuOpen}
            offsetTop={3}
            onClose={() => setMenuOpen(false)}
            placement="bottom-end"
            sx={{
              [`& .${tooltipClasses.tooltip}`]: {
                py: "5px",
                maxWidth: 223,
                border: '1px solid',
                "& .MuiBox-root": {
                  py: 0,
                },
              },
            }}
            title={
              <>
                <MenuItem onClick={openModal(0)}>
                  <WalletModalIcon style={{ marginRight: 10 }} />
                  <ListItemText>
                    <Trans>Wallet</Trans>
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={openModal(1)}>
                  <HistoryIcon style={{ marginRight: 10 }} />
                  <ListItemText>
                    <Trans>Recent transactions</Trans>
                  </ListItemText>
                </MenuItem>
                <Divider sx={{ my: 0.5, mx: "16px" }} />
                <MenuItem onClick={() => { disconnect(); router.replace("/") }}>
                  <DisconnectIcon style={{ marginRight: 10 }} />
                  <ListItemText>
                    <Trans>Disconnect</Trans>
                  </ListItemText>
                </MenuItem>
              </>
            }
          >
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => setMenuOpen(true)}
              sx={{ height: '2.8rem' }}
              startIcon={
                <Image
                  src={`/wallet-icon-${mode}.svg`}
                  alt="wallet"
                  width={21.25}
                  height={19}
                />
              }
              endIcon={<ArrowDownIcon />}
            >
              <Typography sx={{ display: { xs: "none", md: "block" } }}>
                {address && formatHash(address, 3, 4)}
              </Typography>
            </Button>
          </AppBarMenu>
          <WalletModal
            open={modalOpen}
            tabIndex={modalTab}
            onClose={() => setModalOpen(false)}
          />
        </div>
      </ClickAwayListener>
    );
  }

  return <ConnectWalletButton onClick={open} />;
}
