import { useTheme } from "@mui/material";
import type { SVGProps } from "react";

export default function LanguageIcon(props: SVGProps<SVGSVGElement>) {
  const theme = useTheme();

  return (
    <svg
      {...props}
      width={props.width ?? "25"}
      height={props.height ?? "25"}
      viewBox="0 0 30 30"
      fill="none"
      stroke={theme.palette.text.primary}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 27.5C21.9036 27.5 27.5 21.9036 27.5 15C27.5 8.09644 21.9036 2.5 15 2.5C8.09644 2.5 2.5 8.09644 2.5 15C2.5 21.9036 8.09644 27.5 15 27.5Z"
        strokeWidth="1.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 3.75H11.25C8.8125 11.05 8.8125 18.95 11.25 26.25H10"
        strokeWidth="1.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 3.75C21.1875 11.05 21.1875 18.95 18.75 26.25"
        strokeWidth="1.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75 20V18.75C11.05 21.1875 18.95 21.1875 26.25 18.75V20"
        strokeWidth="1.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75 11.25C11.05 8.8125 18.95 8.8125 26.25 11.25"
        strokeWidth="1.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
