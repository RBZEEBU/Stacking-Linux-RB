import type { SVGProps } from "react";
import { useTheme } from "@mui/material";

export default function FarmIcon(props: SVGProps<SVGSVGElement>) {
  const theme = useTheme();

  return (
    <svg
      {...props}
      width={props.width ?? "24"}
      height={props.height ?? "24"}
      viewBox="0 0 24 24"
      fill="none"
      stroke={theme.palette.text.primary}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.92 2.26009L19.43 5.77009C20.19 6.18009 20.19 7.35009 19.43 7.76009L12.92 11.2701C12.34 11.5801 11.66 11.5801 11.08 11.2701L4.57 7.76009C3.81 7.35009 3.81 6.18009 4.57 5.77009L11.08 2.26009C11.66 1.95009 12.34 1.95009 12.92 2.26009Z"
        stroke-width="1.5"
        stroke-linecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.61 10.1299L9.66 13.1599C10.41 13.5399 10.89 14.3099 10.89 15.1499V20.8699C10.89 21.6999 10.02 22.2299 9.28 21.8599L3.23 18.8299C2.48 18.4499 2 17.6799 2 16.8399V11.1199C2 10.2899 2.87 9.75993 3.61 10.1299Z"
        stroke-width="1.5"
        stroke-linecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.3901 10.1299L14.3401 13.1599C13.5901 13.5399 13.1101 14.3099 13.1101 15.1499V20.8699C13.1101 21.6999 13.9801 22.2299 14.7201 21.8599L20.7701 18.8299C21.5201 18.4499 22.0001 17.6799 22.0001 16.8399V11.1199C22.0001 10.2899 21.1301 9.75993 20.3901 10.1299Z"
        stroke-width="1.5"
        stroke-linecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
