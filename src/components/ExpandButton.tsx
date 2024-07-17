import React from "react";
import { Button, ButtonProps, useMediaQuery } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled, keyframes, useTheme } from "@mui/material/styles";

interface ExpandButtonProps extends Omit<ButtonProps, "endIcon"> {
  expanded: boolean;
  onToggle: () => void;
}

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
`;

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isMobile",
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
  transition: theme.transitions.create(
    ["transform", "background-color", "border-radius"],
    {
      duration: theme.transitions.duration.shorter,
    },
  ),
  "&:hover": {
    transform: "scale(1.05)",
  },
  "& .MuiButton-endIcon": {
    margin: 0,
  },
  ...(isMobile && {
    borderRadius: "50%",
    minWidth: 0,
    width: 40,
    height: 40,
    padding: 0,
  }),
}));

const AnimatedIcon = styled(ExpandMoreIcon)<{ $expanded: boolean }>(
  ({ theme, $expanded }) => ({
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shorter,
    }),
    transform: $expanded ? "rotate(180deg)" : "rotate(0deg)",
    animation: `${rotateAnimation} ${theme.transitions.duration.shorter}ms`,
  }),
);

const ExpandButton: React.FC<ExpandButtonProps> = ({
  expanded,
  onToggle,
  children,
  ...buttonProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <StyledButton
      variant="outlined"
      color="secondary"
      onClick={onToggle}
      endIcon={<AnimatedIcon $expanded={expanded} />}
      isMobile={isMobile}
      {...buttonProps}
    >
      {!isMobile && children}
    </StyledButton>
  );
};

export default ExpandButton;
