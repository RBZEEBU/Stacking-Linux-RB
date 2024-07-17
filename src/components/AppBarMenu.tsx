import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { brand } from "@/app/getLPTheme";

type AppBarMenuProps = TooltipProps & {
  offsetTop?: number;
};

const AppBarMenu = styled(
  ({ className, offsetTop, ...props }: AppBarMenuProps) => (
    <Tooltip
      disableFocusListener
      disableHoverListener
      disableTouchListener
      placement="bottom"
      TransitionProps={{ timeout: 0 }}
      PopperProps={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, offsetTop ?? 10],
            },
          },
        ],
      }}
      enterTouchDelay={0}
      leaveTouchDelay={0}
      {...props}
      classes={{ popper: className }}
      title={
        <Box
          sx={{
            paddingTop: 1,
            "& .MuiMenuItem-root": {
              paddingY: 1,
              paddingLeft: 2,
              paddingRight: 1,
              borderRadius: 0,
            },
          }}
        >
          {props.title}
        </Box>
      }
    />
  ),
)(({ theme }) => ({
  background: "transparent",
  [`& .${tooltipClasses.tooltip}`]: {
    width: 250,
    paddingLeft: 0,
    paddingRight: 0,
    overflow: "hidden",
    background:
      theme.palette.mode === "light"
        ? "linear-gradient(234.6deg, rgba(42, 68, 255, 0.1) 4.44%, rgba(42, 68, 255, 0.05) 97.8%)"
        : "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 6.67%, rgba(255, 255, 255, 0) 100%)",
    backdropFilter: "blur(24px)",
    border: theme.palette.mode === "light" ? "1px solid" : "2px solid",
    borderColor:
      theme.palette.mode === "light"
        ? "hsla(233, 100%, 58%, 0.3)"
        : "hsla(0, 0%, 100%, 0.8)",
    boxShadow:
      theme.palette.mode === "light"
        ? "0px 3px 6px 0px hsla(0, 0%, 100%, 0.25) inset"
        : "0px 4px 10px 0px #0000001A inset",
    borderRadius: "10px",
    "&>.MuiBox-root": {
      borderRadius: "10px",
    },
  },
}));

export default AppBarMenu;
