import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import CloseIcon from "./icons/CloseIcon";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  content: React.ReactNode;
  actions?: React.ReactNode;
};

export default function Modal(props: ModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { i18n } = useLingui();

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      fullWidth={isMobile}
      PaperProps={{
        sx: {
          width: { md: 554 },
        },
      }}
    >
      <DialogTitle
        fontSize="18px"
        fontWeight="700"
        sx={{ borderBottom: 1, border: "1px solid rgba(255, 255, 255, .3)" }}
      >
        {props.title}
      </DialogTitle>
      <IconButton
        aria-label={t(i18n)`close`}
        onClick={props.onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>{props.content}</DialogContent>
      {props.actions ? (
        <DialogActions sx={{ paddingX: 3, paddingBottom: 3 }}>
          {props.actions}
        </DialogActions>
      ) : null}
    </Dialog>
  );
}
