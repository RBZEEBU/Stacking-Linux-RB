import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  InputBase,
  Typography,
} from "@mui/material";
import { Trans } from "@lingui/macro";
import * as dn from "dnum";
import FormInputContainer from "./FormInputContainer";
import { formatBigInt } from "@/lib/utils";

type TokenInputProps = {
  balance: bigint;
  decimals: number;
  amount: bigint;
  setAmount: (value: bigint) => void;
};

export default function TokenInput(props: TokenInputProps) {
  const { balance, decimals, amount, setAmount } = props;
  const [inputAmount, setInputAmount] = useState(
    formatBigInt(amount, decimals),
  );

  const handleAmountChanged: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const value = e.currentTarget.value;

    try {
      const parsedAmount = dn.from(value, decimals);
      const formattedValue = formatBigInt(parsedAmount[0], decimals);

      setInputAmount(formattedValue);
      setAmount(parsedAmount[0]);
    } catch (error) {
      setAmount(BigInt(0));
      setInputAmount("");
    }
  };

  const bigintMulFloat = (a: bigint, b: number) => {
    const scaleFactor = BigInt(1000000);
    const scaledFloat = BigInt(Math.round(b * Number(scaleFactor)));
    return (a * scaledFloat) / scaleFactor;
  };

  const handlePercentAmount = (percent: number) => {
    const newBalance = bigintMulFloat(balance, percent);
    setInputAmount(formatBigInt(newBalance, decimals));
    setAmount(newBalance);
  };

  const percentAmount = (percent: number) => {
    return amount === bigintMulFloat(balance, percent);
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <FormInputContainer>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src="/zeebu-logo.svg" />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
            }}
          >
            <InputBase
              fullWidth
              value={inputAmount}
              onChange={handleAmountChanged}
              sx={{
                border: "none",
                textAlign: "right",
                fontSize: "18px",
                flex: 1,
                fontWeight:"bold"
              }}
              type="number"
              placeholder="0.0"
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Box>
          <Typography textAlign="left" sx={{ fontSize: "12px" }}>
            <Trans>Balance: {formatBigInt(balance, decimals)}</Trans>
          </Typography>
        </Box>
      </FormInputContainer>
      <ButtonGroup fullWidth sx={{ paddingTop: 1 }}>
        <Button
          onClick={() => handlePercentAmount(0.25)}
          variant={percentAmount(0.25) ? "contained" : "outlined"}
        >
          <Typography variant="body2">25%</Typography>
        </Button>
        <Button
          onClick={() => handlePercentAmount(0.5)}
          variant={percentAmount(0.5) ? "contained" : "outlined"}
        >
          <Typography variant="body2">50%</Typography>
        </Button>
        <Button
          onClick={() => handlePercentAmount(0.75)}
          variant={percentAmount(0.75) ? "contained" : "outlined"}
        >
          <Typography variant="body2">75%</Typography>
        </Button>
        <Button
          onClick={() => handlePercentAmount(1)}
          variant={amount === balance ? "contained" : "outlined"}
        >
          <Typography variant="body2">Max</Typography>
        </Button>
      </ButtonGroup>
    </Box>
  );
}
