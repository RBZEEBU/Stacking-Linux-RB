import type { SVGProps } from "react";
import { useTheme } from "@mui/material";

export default function InfoIcon(props: SVGProps<SVGSVGElement>) {
  const theme = useTheme();

  return (
    <svg
      {...props}
      width={props.width ?? "25"}
      height={props.height ?? "24"}
      viewBox="0 0 25 24"
      fill="none"
      stroke={theme.palette.text.primary}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.75 22C18.25 22 22.75 17.5 22.75 12C22.75 6.5 18.25 2 12.75 2C7.25 2 2.75 6.5 2.75 12C2.75 17.5 7.25 22 12.75 22Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 8V13"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.7446 16H12.7536"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
