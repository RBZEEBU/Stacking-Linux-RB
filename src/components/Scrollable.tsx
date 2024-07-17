import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const Scrollable = styled(Box)(({ theme }) => ({
  overflowY: "scroll",
  paddingRight: "15px",
  borderRadius: 0,
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background:
      theme.palette.mode === "light"
        ? "hsla(0, 0%, 0%, 0.1)"
        : "hsla(0, 0%, 100%, 0.3)",
    borderRadius: "100px",
  },
  "&::-webkit-scrollbar-corner": {
    background: "transparent",
  },
}));

export default Scrollable;
