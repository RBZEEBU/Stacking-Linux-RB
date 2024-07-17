import * as React from "react";
import { Trans, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ColorModeContext } from "@/contexts/ColorMode";
import CloseIcon from "./icons/CloseIcon";

type SettingsModalProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function SettingsModal(props: SettingsModalProps) {
  const { mode, toggleColorMode } = React.useContext(ColorModeContext);
  const { i18n } = useLingui();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={props.open || false}
      onClose={props.onClose}
      id="settings-modal-dialog"
      fullWidth={isMobile}
      PaperProps={{
        sx: {
          minWidth: { md: 420 },
        },
      }}
    >
      <DialogTitle
        fontWeight="bold"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Trans>Settings</Trans>
      </DialogTitle>

      <IconButton
        aria-label={t(i18n)`close`}
        onClick={props.onClose}
        sx={{ position: "absolute", right: 12, top: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography>
              <Trans>Dark mode</Trans>
            </Typography>
            <Switch checked={mode === "dark"} onChange={toggleColorMode} />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography>
              <Trans>Show testnet</Trans>
            </Typography>
            <Switch />
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
