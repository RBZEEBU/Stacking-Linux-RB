"use client";

import { AlertsContext } from "@/contexts/Alerts";
import { Alert_Kind__Enum_Type } from "@/types";
import { Trans } from "@lingui/macro";
import {
  Alert,
  AlertTitle,
  LinearProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { useContext, useEffect } from "react";

export const Notifier = () => {
  const {
    state: { alert: notification },
    clearAlert,
  } = useContext(AlertsContext);

  useEffect(() => {
    if (notification?.kind === Alert_Kind__Enum_Type.PROGRESS) return;

    setTimeout(() => {
      clearAlert();
    }, 5000);
  }, [clearAlert, notification]);

  if (!notification) return;

  if (notification.kind === Alert_Kind__Enum_Type.PROGRESS) {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={true}
      >
        <Alert variant="filled" severity="info" sx={{ px: 4 }}>
          <AlertTitle>
            <Trans>In Progress</Trans>
          </AlertTitle>
          <Typography sx={{ mb: 2 }}>{notification.message}</Typography>
          <LinearProgress />
        </Alert>
      </Snackbar>
    );
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={true}
    >
      <Alert variant="filled" severity={notification.kind} sx={{ px: 4 }}>
        <AlertTitle>{notification.kind.toUpperCase()}</AlertTitle>
        <Typography>{notification.message}</Typography>
      </Alert>
    </Snackbar>
  );
};
