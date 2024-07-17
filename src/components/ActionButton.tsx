import { Trans } from "@lingui/macro";
import { Box, Button, CircularProgress } from "@mui/material";
import { ReactNode } from "react";

export const ActionButton = ({
  children,
  loading = false,
  onClick,
  disabled = false,
  fullWidth = true,
}: {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}) => {
  if (disabled) {
    return (
      <Button
        fullWidth={fullWidth}
        variant="contained"
        disabled={true}
        size="large"
      >
        {children}
      </Button>
    );
  }

  if (loading) {
    return (
      <Box sx={{ position: "relative", cursor: "not-allowed", width: "100%" }}>
        <Button
          fullWidth={fullWidth}
          variant="contained"
          disabled={true}
          size="large"
        >
          <Trans>Processing</Trans>
        </Button>
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            right: "5%",
            marginTop: "-12px",
            marginLeft: "-12px",
            color: "secondary.main",
          }}
        />
      </Box>
    );
  }

  return (
    <Button
      onClick={onClick}
      fullWidth={fullWidth}
      variant="contained"
      size="large"
    >
      {children}
    </Button>
  );
};
