import type { SVGProps } from "react";
import { useTheme } from "@mui/material";

export default function SettingsIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M3.75 11.3875V18.6C3.75 21.25 3.75 21.25 6.25 22.9375L13.125 26.9125C14.1625 27.5125 15.85 27.5125 16.875 26.9125L23.75 22.9375C26.25 21.25 26.25 21.25 26.25 18.6125V11.3875C26.25 8.74995 26.25 8.74995 23.75 7.06245L16.875 3.08745C15.85 2.48745 14.1625 2.48745 13.125 3.08745L6.25 7.06245C3.75 8.74995 3.75 8.74995 3.75 11.3875Z"
        strokeWidth="1.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 18.75C17.0711 18.75 18.75 17.0711 18.75 15C18.75 12.9289 17.0711 11.25 15 11.25C12.9289 11.25 11.25 12.9289 11.25 15C11.25 17.0711 12.9289 18.75 15 18.75Z"
        strokeWidth="1.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
