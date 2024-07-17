"use client";

import * as React from "react";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { Trans, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useCurrentLocale } from "next-i18n-router/client";
import Image from "next/image";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";

import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { ColorModeContext } from "@/contexts/ColorMode";
import ChainSelect from "./ChainSelect";
import LanguageSelect from "./LanguageSelect";
import Wallet from "./Wallet";
import SettingsIcon from "./icons/SettingsIcon";
import SettingsModal from "./SettingsModal";
import Notifications from "./Notifications";
import { i18nConfig } from "@/i18nConfig";

type AppBarLinkProps = LinkProps & {
  children?: React.ReactNode;
  active?: boolean;
};

function AppBarLink({ active, children, ...props }: AppBarLinkProps) {
  return (
    <Link passHref style={{ textDecoration: "none" }} {...props}>
      <Typography
        variant="subtitle2"
        fontWeight={active ? "bold" : "normal"}
        color={active ? "text.primary" : "text.secondary"}
      >
        {children}
      </Typography>
    </Link>
  );
}

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const { mode } = React.useContext(ColorModeContext);
  const { i18n } = useLingui();
  const locale = useCurrentLocale(i18nConfig);

  const matchPage = (path: string, page: string): boolean => {
    if (locale === i18nConfig.defaultLocale) {
      return path.startsWith(`/${page}`);
    }

    const localizationPattern = new RegExp(`^/[a-z]{2}/${page}`);
    return localizationPattern.test(path);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const path = usePathname();

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        "& .MuiToolbar-root": {
          py: 4.2,
          px: 3,
        },
      }}
    >
      <Toolbar
        variant="regular"
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(127.43deg, rgba(255, 255, 255, 0.15) 2.54%, rgba(153, 153, 153, 0.15) 97.47%), radial-gradient(61.2% 18.19% at 52.96% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(153, 153, 153, 0) 100%)"
              : "linear-gradient(89.78deg, rgba(255, 255, 255, 0.03) 59.64%, rgba(255, 255, 255, 0.3) 100%)",
          backdropFilter: "blur(24px)",
          maxHeight: 40,
          borderBottom:
            theme.palette.mode === "dark"
              ? "1px solid #FFFFFF66"
              : "2px solid #FFFFFF",
          boxShadow: "0px 3px 4px 0px #297FEA26 inset",
        })}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 0,
          }}
        >
          <Link href="/" passHref style={{ textDecoration: "none", marginTop: '3px' }}>
            <Image
              src={`/logo-${mode}.svg`}
              width={167}
              height={40}
              alt="zeebu-logo"
            />
          </Link>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            ml: "50px",
            gap: "50px",
            px: 2,
          }}
        >
          <AppBarLink href="/" active={matchPage(path, "stake")}>
            <Trans>Docs</Trans>
          </AppBarLink>
          <AppBarLink href="/" active={matchPage(path, "stake")}>
            <Trans>Community</Trans>
          </AppBarLink>
          <AppBarLink href="/stake" active={matchPage(path, "stake")}>
            <Trans>Stake</Trans>
          </AppBarLink>
          <AppBarLink href="/leaderboard" active={matchPage(path, "stake")}>
            <Trans>Leaderboard</Trans>
          </AppBarLink>
          <AppBarLink
            href="/admin-rewards"
            active={matchPage(path, "admin-rewards")}
          >
            <Trans>Add Rewards</Trans>
          </AppBarLink>
        </Box>

        <Box
          sx={{
            display: { xs: "flex" },
            gap: 1,
            alignItems: "center",
          }}
        >
          <LanguageSelect />
          <IconButton
            aria-label={t(i18n)`Settings`}
            onClick={() => setSettingsOpen(true)}
            sx={{ padding: 0 }}
          >
            <SettingsIcon />
          </IconButton>
          <SettingsModal
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
          <Notifications />
          <ChainSelect />
          <Wallet />
          <Box sx={{ display: { sm: "flex", md: "none" } }}>
            <IconButton
              aria-label={t(i18n)`Menu button`}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "background.default",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem sx={{ display: "flex", justifyContent: "center" }}>
                  <Link
                    href="/stake"
                    passHref
                    style={{ textDecoration: "none" }}
                  >
                    <Typography color="text.primary">
                      <Trans>Stake</Trans>
                    </Typography>
                  </Link>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
