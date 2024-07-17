import { Box, Button, ButtonGroup, InputBase, Typography } from "@mui/material";
import { useLingui } from "@lingui/react";
import { Trans, t } from "@lingui/macro";
import { secondsInWeek } from "date-fns/constants";
import { useState } from "react";
import Image from "next/image";
import FormInputContainer from "./FormInputContainer";

const periods = [
  { name: "1W", seconds: secondsInWeek },
  { name: "1M", seconds: secondsInWeek * 4 },
  { name: "6M", seconds: secondsInWeek * 4 * 6 },
  { name: "1Y", seconds: secondsInWeek * 52 },
  { name: "Max", seconds: secondsInWeek * 52 * 2 },
];

type PeriodSelectorProps = {
  onChange: (seconds: number) => void;
  value: number;
  label?: string;
  disabled?: boolean;
};

const secondsToWeeks = (seconds: number) => Math.trunc(seconds / secondsInWeek);

export const PeriodSelector = (props: PeriodSelectorProps) => {
  const { onChange, value, disabled } = props;
  const { i18n } = useLingui();
  const [inputDuration, setInputDuration] = useState(
    String(secondsToWeeks(value)),
  );

  const handleDurationInputChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputDuration(event.target.value);
    onChange(Number(event.target.value) * secondsInWeek);
  };

  const handleButtonClicked = (seconds: number) => {
    onChange(seconds);
    setInputDuration(String(secondsToWeeks(seconds)));
  };

  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Typography variant="overline" fontWeight="bold">
        {props.label ?? t(i18n)`Add Duration`}
      </Typography>
      <FormInputContainer>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/timelock-icon.svg"
            alt="timelock-icon"
            width={38.59}
            height={38.59}
          />
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
              value={inputDuration}
              onChange={handleDurationInputChanged}
              sx={{
                border: "none",
                textAlign: "right",
                fontSize: "18px",
                flex: 1,
                fontWeight:"bold"
              }}
              type="number"
              placeholder="0"
              inputProps={{ min: 0, step: 1 }}
              disabled={disabled}
            />
            <Typography
              textAlign="right"
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                whiteSpace: "nowrap",
                mt: 1,
              }}
            >
              <Trans>Weeks</Trans>
            </Typography>
          </Box>
        </Box>
      </FormInputContainer>
      <ButtonGroup fullWidth sx={{ paddingTop: 1 }}>
        {periods.map(({ name, seconds }, index) => (
          <Button
            onClick={() => handleButtonClicked(seconds)}
            key={index}
            variant={seconds === value ? "contained" : "outlined"}
            disabled={disabled}
          >
            <Typography variant="body2">{name}</Typography>
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};
