import * as React from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Trans, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { tooltipClasses } from "@mui/material/Tooltip";

import { ConnectWalletContext } from "@/contexts/ConnectWallet";
import {
  NotificationsContext,
  NotificationTopic,
} from "@/contexts/Notifications";
import ConnectWalletButton from "./ConnectWalletButton";
import SettingsIcon from "./icons/SettingsIcon";
import InfoIcon from "./icons/InfoIcon";
import ArrowDownIcon from "./icons/ArrowDownIcon";
import AppBarMenu from "./AppBarMenu";
import NotificationsSettings from "./NotificationsSettings";
import Scrollable from "./Scrollable";
import NotificationsItem from "./NotificationsItem";
import Loader from "./Loader";

type NotificationsMenuProps = {
  showSettings?: boolean;
  toggleShowSettings?: () => void;
  onClose?: () => void;
};

const useNow = (refreshFrequency: number) => {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), refreshFrequency);
    return () => clearInterval(interval);
  });
  return now;
};

export default function NotificationsMenu({
  showSettings,
  toggleShowSettings,
  onClose,
}: NotificationsMenuProps) {
  const { isConnected } = useAccount();
  const { i18n } = useLingui();
  const { open } = React.useContext(ConnectWalletContext);

  const {
    isSubscribed,
    loading,
    notifications,
    clearNotifications,
    initSubscriptions,
  } = React.useContext(NotificationsContext);

  const filters = [
    {
      topic: "",
      title: t(i18n)`All`,
    },
    {
      topic: NotificationTopic.Alerts,
      title: t(i18n)`Alerts`,
    },
    {
      topic: NotificationTopic.Promotions,
      title: t(i18n)`Promotion`,
    },
    {
      topic: NotificationTopic.Rewards,
      title: t(i18n)`Rewards`,
    },
  ];

  const [filter, setFilter] = React.useState(filters[0]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [showImportant, setShowImportant] = React.useState(false);

  const now = useNow(5000); // 5s

  if (!isSubscribed) {
    return (
      <Stack
        direction="column"
        alignItems="center"
        gap="20px"
        sx={{ padding: "20px" }}
        color="text.primary"
      >
        <Image
          src="/notifications.svg"
          alt="notifications"
          width={70}
          height={70}
        />
        <Stack alignItems="center" direction="column" gap="10px">
          <Typography variant="h5" sx={{ fontSize: "1rem" }}>
            <Trans>Notifications From Zeebu</Trans>
          </Typography>
          {!loading && (
            <Typography
              variant="subtitle2"
              textAlign="center"
              sx={{ fontSize: "0.8rem" }}
            >
              <Trans>
                Get started with notifications from Zeebu. First authorize
                notifications by signing in your wallet
              </Trans>
            </Typography>
          )}
        </Stack>
        {loading ? (
          <Loader />
        ) : (
          <ConnectWalletButton
            onClick={() => {
              if (!isConnected) {
                onClose?.();
                open();
              } else {
                initSubscriptions();
              }
            }}
          />
        )}
      </Stack>
    );
  }

  return (
    <Box color="text.primary">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        py="10px"
        px="20px"
      >
        <Stack direction="row" alignItems="center" gap="5px">
          {showSettings && (
            <IconButton
              sx={{ p: 0, height: "24px", width: "24px" }}
              onClick={toggleShowSettings}
            >
              <ArrowDownIcon style={{ transform: "rotateZ(90deg)" }} />
            </IconButton>
          )}
          <Typography variant="h6">
            <Trans>{showSettings ? "Settings" : "Notifications"}</Trans>
          </Typography>
        </Stack>
        {!showSettings && (
          <IconButton
            sx={{ p: 0, height: "24px", width: "24px" }}
            onClick={toggleShowSettings}
          >
            <SettingsIcon width={24} height={24} />
          </IconButton>
        )}
      </Stack>
      <Divider />
      {!showSettings ? (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            mb="10px"
            p="20px"
          >
            <ClickAwayListener onClickAway={() => setShowFilters(false)}>
              <div>
                <AppBarMenu
                  open={showFilters}
                  onClose={() => setShowFilters(false)}
                  offsetTop={-9}
                  placement="bottom-start"
                  sx={{
                    [`& .${tooltipClasses.tooltip}`]: {
                      paddingY: 0,
                      maxWidth: 150,
                      "& .MuiBox-root": {
                        paddingY: "10px",
                      },
                    },
                  }}
                  title={filters.map((item, index) => (
                    <MenuItem
                      key={index}
                      selected={item.topic === filter.topic}
                      onClick={() => {
                        setFilter(item);
                        setShowFilters(false);
                      }}
                    >
                      {item.title}
                    </MenuItem>
                  ))}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    endIcon={<ArrowDownIcon />}
                    sx={{ px: "22px" }}
                    onClick={() => setShowFilters((val) => !val)}
                  >
                    {filter.title}
                  </Button>
                </AppBarMenu>
              </div>
            </ClickAwayListener>
            <Stack direction="row" alignItems="center" gap="5px">
              <Switch
                sx={{ transform: "scale(0.74)" }}
                onChange={() => setShowImportant((val) => !val)}
              />
              <Typography variant="subtitle2">
                <Trans>Important only</Trans>
              </Typography>
              <InfoIcon />
            </Stack>
          </Stack>
          {notifications.length > 0 ? (
            <Box p="20px" pt="0" pr="10px">
              <Box>
                <Scrollable maxHeight="300px" sx={{ paddingRight: "6px" }}>
                  <Stack direction="column" gap="20px" divider={<Divider />}>
                    {notifications
                      .filter((item) => {
                        if (showImportant) {
                          return item.data?.topic === NotificationTopic.Alerts;
                        }
                        if (filter.topic) {
                          return item.data?.topic === filter.topic;
                        }
                        return true;
                      })
                      .map((data) => (
                        <NotificationsItem
                          key={data.messageId}
                          payload={data}
                          now={now}
                        />
                      ))}
                    <div />
                  </Stack>
                </Scrollable>
              </Box>
              <Box pr="10px">
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  size="large"
                  onClick={clearNotifications}
                  sx={(theme) => ({
                    fontWeight: 700,
                    height: "50px",
                    border: "1px solid hsla(0, 0%, 100%, 1)",
                    background:
                      "linear-gradient(234.6deg, rgba(255, 255, 255, 0.35) 4.44%, rgba(255, 255, 255, 0.25) 97.8%)",
                    boxShadow: "0px 3px 6px 0px hsla(0, 0%, 100%, 0.25) inset",
                    "&:hover": {
                      boxShadow: "none",
                      border: "1px solid hsla(0, 0%, 100%, 0.8)",
                    },
                    ...(theme.palette.mode === "dark" && {
                      boxShadow: "none",
                      background: "none",
                      border: "1px solid hsla(17, 100%, 68%, 1)",
                      "&:hover": {
                        border: "1px solid hsla(17, 100%, 68%, 0.8)",
                      },
                    }),
                  })}
                >
                  Clear All
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              p="20px"
              pb="30px"
            >
              <Image
                src="/notifications.svg"
                alt="notifications"
                width={80}
                height={80}
              />
              <Stack
                direction="column"
                alignItems="center"
                gap="10px"
                mt="20px"
              >
                <Typography variant="h5">
                  <Trans>Empty</Trans>
                </Typography>
                <Typography variant="subtitle2" textAlign="center">
                  <Trans>No new notifications at the moment</Trans>
                </Typography>
              </Stack>
            </Box>
          )}
        </>
      ) : (
        <NotificationsSettings />
      )}
    </Box>
  );
}
