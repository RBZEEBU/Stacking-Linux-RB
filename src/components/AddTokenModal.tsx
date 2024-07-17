import { Trans, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { getTokenDetails } from "@/hooks/useToken";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Address, isAddress } from "viem";
import { ActionButton } from "./ActionButton";

export type Token = {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
};

type AddTokenModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: (token: Token) => void;
  existingTokens: Token[];
};

export const AddTokenModal = (props: AddTokenModalProps) => {
  const { open, onCancel, onConfirm, existingTokens } = props;
  const [tokenAddress, setTokenAddress] = useState("");
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [tokenDetails, setTokenDetails] = useState<Token | null>(null);
  const { i18n } = useLingui();

  const duplicatedToken = useMemo(
    () =>
      existingTokens.some(
        (token) =>
          token.address.toLocaleLowerCase() === tokenAddress.toLowerCase(),
      ),
    [existingTokens, tokenAddress],
  );

  const handleLoad = async () => {
    if (!isAddress(tokenAddress)) return;

    setLoadingDetails(true);
    getTokenDetails(tokenAddress).then(([name, symbol, decimals]) => {
      const token: Token = {
        address: tokenAddress,
        name,
        symbol,
        decimals,
      };
      setTokenDetails(token);
      setLoadingDetails(false);
    });
  };

  const handleTokenAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(e.target.value);
    setTokenDetails(null);
  };

  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="add-token-modal">
      <DialogTitle id="add-token-modal">
        <Trans>Add Token</Trans>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            mt: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexDirection: "column",
            }}
          >
            <TextField
              fullWidth
              label={t(i18n)`Token Address`}
              value={tokenAddress}
              onChange={handleTokenAddressChange}
            />
            <ActionButton
              onClick={handleLoad}
              loading={loadingDetails}
              disabled={!isAddress(tokenAddress) || duplicatedToken}
            >
              <Trans>Load</Trans>
            </ActionButton>
          </Box>
          {tokenDetails && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <Trans>Token Name: {tokenDetails.name}</Trans>
              </Typography>
              <Typography variant="body1">
                <Trans>Symbol: {tokenDetails.symbol}</Trans>
              </Typography>
              <Typography variant="body1">
                <Trans>Decimals: {tokenDetails.decimals}</Trans>
              </Typography>
            </Box>
          )}

          {!tokenAddress || isAddress(tokenAddress) ? null : (
            <Alert severity="error">
              <Trans>Invalid address</Trans>
            </Alert>
          )}

          {duplicatedToken && (
            <Alert severity="error">
              <Trans>Token already exists</Trans>
            </Alert>
          )}

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 2, justifyContent: "flex-end" }}
          >
            <Button onClick={onCancel}>
              <Trans>Cancel</Trans>
            </Button>
            <Button
              variant="contained"
              onClick={() => tokenDetails && onConfirm(tokenDetails)}
              disabled={!tokenDetails}
            >
              <Trans>Confirm</Trans>
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
