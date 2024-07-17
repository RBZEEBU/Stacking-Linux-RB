import * as React from "react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { MessagePayload } from "firebase/messaging";

type NotificationsItemProps = {
  payload: MessagePayload;
  now: number;
};

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = WEEK * 4;
const YEAR = MONTH * 12;

export default function NotificationsItem({
  now,
  payload,
}: NotificationsItemProps) {
  const time = React.useMemo(() => {
    const timestamp = parseInt(payload.data?.timestamp ?? "0", 10);
    const passed = Math.floor((now - timestamp) / 1000);

    if (passed < MINUTE) {
      return `Less than 1m ago`;
    }

    let value = 0;
    let units = "";

    if (passed < HOUR) {
      value = Math.floor(passed / MINUTE);
      units = "minute";
    } else if (passed < DAY) {
      value = Math.floor(passed / HOUR);
      units = "hour";
    } else if (passed < WEEK) {
      value = Math.floor(passed / DAY);
      units = "day";
    } else if (passed < MONTH) {
      value = Math.floor(passed / WEEK);
      units = "week";
    } else if (passed < YEAR) {
      value = Math.floor(passed / MONTH);
      units = "month";
    } else {
      value = Math.floor(passed / YEAR);
      units = "year";
    }

    return `${value} ${units}${value > 1 ? "s" : ""} ago`;
  }, [payload.data, now]);

  return (
    <Box>
      <Stack direction="row" gap="10px" mb="10px">
        <Avatar src="/zeebu-logo.svg" sx={{ width: "50px", height: "50px" }} />
        <Stack direction="column" justifyContent="space-between">
          <Typography variant="subtitle2" fontWeight="bold">
            {payload.notification?.title}
          </Typography>
          <Typography variant="body2" sx={{ opacity: "0.5" }}>
            {time}
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="subtitle2">{payload.notification?.body}</Typography>
    </Box>
  );
}
