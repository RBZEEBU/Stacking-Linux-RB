"use client";

import * as React from "react";
import Image from "next/image";
import { useChainId, useSwitchChain } from "wagmi";
import { extractChain } from "viem";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { tooltipClasses } from "@mui/material/Tooltip";

import AppBarMenu from "./AppBarMenu";
import { getChainIconUrl } from "@/lib/utils";
import ArrowDownIcon from "./icons/ArrowDownIcon";

export default function ChainSelect() {
  const [open, setOpen] = React.useState(false);

  const { chains, switchChain } = useSwitchChain();
  const chainId = useChainId();

  const currentChain = React.useMemo(
    () => extractChain({ chains, id: chainId }),
    [chains, chainId],
  );

  const handleClose = () => setOpen(false);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={{ marginRight: { xs: 0.5, sm: 1 } }}>
        <AppBarMenu
          open={open}
          onClose={handleClose}
          offsetTop={3}
          sx={{
            [`& .${tooltipClasses.tooltip}`]: {
              paddingY: 0,
              width: 200,
              border:'1px solid',
              "& .MuiBox-root": {
                py: "5px",
              },
            },
          }}
          title={
            <>
              {chains.map((item) => (
                <MenuItem
                  key={item.id}
                  selected={item.id === chainId}
                  onClick={() => {
                    switchChain({ chainId: item.id });
                    handleClose();
                  }}
                >
                  <ListItemIcon>
                    <Image
                      src={getChainIconUrl(item)}
                      width={24}
                      height={24}
                      alt="eth"
                    />
                  </ListItemIcon>
                  <ListItemText>{item.name}</ListItemText>
                </MenuItem>
              ))}
            </>
          }
        >
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => setOpen(true)}
            startIcon={
              <Image
                src={getChainIconUrl(currentChain)}
                width={28}
                height={28}
                alt={currentChain.name}
              />
            }
            endIcon={<ArrowDownIcon />}
            sx={{
              "& .MuiButton-startIcon": {
                marginRight: { xs: 0, md: 1 },      
              },
              height:'2.8rem'
            }}
          >
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              {currentChain.name}
            </Box>
          </Button>
        </AppBarMenu>
      </Box>
    </ClickAwayListener>
  );
}
