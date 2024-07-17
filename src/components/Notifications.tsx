import * as React from "react";

import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import IconButton from "@mui/material/IconButton";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { tooltipClasses } from "@mui/material/Tooltip";

import NotificationsIcon from "./icons/NotificationsIcon";
import AppBarMenu from "./AppBarMenu";
import NotificationsMenu from "./NotificationsMenu";

export default function Notifications() {
  const [open, setOpen] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const { i18n } = useLingui();

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        <AppBarMenu
          open={open}
          onClose={() => setOpen(false)}
          offsetTop={6}
          sx={{
            [`& .${tooltipClasses.tooltip}`]: {
              paddingY: 0,
              width: showSettings ? "400px" : "410px",
              maxWidth: "450px",
              border:'1px solid',
              "&>.MuiBox-root": {
                padding: 0,
              },
            },
          }}
          title={
            <NotificationsMenu
              showSettings={showSettings}
              toggleShowSettings={() => setShowSettings((show) => !show)}
              onClose={() => setOpen(false)}
            />
          }
        >
          <IconButton
            aria-label={t(i18n)`Language`}
            sx={{ padding: 0 }}
            onClick={() => setOpen(true)}
          >
            <NotificationsIcon />
          </IconButton>
        </AppBarMenu>
      </div>
    </ClickAwayListener>
  );
}
