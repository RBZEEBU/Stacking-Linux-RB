import React, { useState, useEffect } from "react";
import { differenceInSeconds, intervalToDuration } from "date-fns";

export default function Countdown(props: { date: Date }) {
  const [timeLeft, setTimeLeft] = useState<string>("--h:--m:--s");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = differenceInSeconds(props.date, now);

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft("00h:00m:00s");
      } else {
        const duration = intervalToDuration({ start: now, end: props.date });
        const hours = (duration.days || 0) * 24 + (duration.hours || 0);
        const minutes = duration.minutes || 0;
        const seconds = duration.seconds || 0;

        setTimeLeft(
          `${hours.toString().padStart(3, "0")}h:${minutes.toString().padStart(2, "0")}m:${seconds.toString().padStart(2, "0")}s`,
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [props.date]);

  return <span>{timeLeft}</span>;
}
