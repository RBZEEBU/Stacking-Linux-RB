import * as React from "react";
import { Trans, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import {
  initialTopics,
  NotificationsContext,
  NotificationTopic,
} from "@/contexts/Notifications";
import Scrollable from "./Scrollable";
import DangerIcon from "./icons/DangerIcon";
import PromotionIcon from "./icons/PromotionIcon";
import RewardsIcon from "./icons/RewardsIcon";

const NotificationSettingsAvatar = styled(Avatar)(({ theme }) => ({
  width: "50px",
  height: "50px",
  border: "2px solid hsla(0, 0%, 100%, 0.6)",
  background:
    theme.palette.mode === "light"
      ? "linear-gradient(234.6deg, rgba(255, 255, 255, 0.14) 4.44%, rgba(255, 255, 255, 0.1) 97.8%)"
      : "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 6.67%, rgba(255, 255, 255, 0) 100%)",
  boxShadow: "0px 3px 6px 0px hsla(0, 0%, 100%, 0.25) inset",
}));

export default function NotificationsSettings() {
  const { i18n } = useLingui();

  const {
    loadingTopics,
    subscriptions,
    subscribeTo,
    unsubscribeFrom,
    unsubscribeFromAll,
  } = React.useContext(NotificationsContext);

  const [values, setValues] = React.useState(initialTopics);

  React.useEffect(() => {
    setValues(subscriptions);
  }, [subscriptions]);

  const settings = [
    {
      name: t(i18n)`Alerts`,
      topic: NotificationTopic.Alerts,
      icon: <DangerIcon />,
      description: t(
        i18n,
      )`Get notified when urgent action is required from your account`,
    },
    {
      name: t(i18n)`Promotion`,
      topic: NotificationTopic.Promotions,
      icon: <PromotionIcon />,
      description: t(
        i18n,
      )`Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    },
    {
      name: t(i18n)`Rewards`,
      topic: NotificationTopic.Rewards,
      icon: <RewardsIcon />,
      description: t(
        i18n,
      )`Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
    },
  ];

  const items = settings.map((item, index) => {
    const handleChange = (_: React.ChangeEvent, checked: boolean) => {
      setValues((prev) => ({ ...prev, [item.topic]: checked }));
      if (checked) {
        subscribeTo(item.topic);
      } else {
        unsubscribeFrom(item.topic);
      }
    };

    return (
      <Stack
        key={index}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap="10px"
      >
        <Stack direction="row" gap="10px">
          <NotificationSettingsAvatar>{item.icon}</NotificationSettingsAvatar>
          <Stack direction="column" gap="5px">
            <Typography variant="subtitle2" fontWeight="bold">
              {item.name}
            </Typography>
            <Typography
              variant="overline"
              sx={{ opacity: "0.5", lineHeight: 1.3 }}
            >
              {item.description}
            </Typography>
          </Stack>
        </Stack>
        <Switch
          disabled={loadingTopics}
          defaultChecked={subscriptions[item.topic]}
          value={values[item.topic]}
          onChange={handleChange}
        />
      </Stack>
    );
  });

  return (
    <Box p="20px" pr="15px">
      <Scrollable maxHeight="400px">
        <Stack direction="column" gap="20px" divider={<Divider />}>
          {items}
          <div />
        </Stack>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={unsubscribeFromAll}
          disabled={loadingTopics}
        >
          <Trans>Unsubscribe</Trans>
        </Button>
      </Scrollable>
    </Box>
  );
}
