import { styled } from "@mui/material/styles";
import { Radio, RadioProps, alpha } from "@mui/material";
import { brand } from "@/app/getLPTheme";

const RadioIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 24,
  height: 24,
  border: "1px solid",
  borderColor: alpha(theme.palette.text.primary, 0.3),
  transition: "border-color 100ms ease-in",
  "input:hover ~ &": {
    borderColor: alpha(theme.palette.text.primary, 0.5),
  },
  "input:disabled ~ &": {
    border: "1px solid hsla(0, 0%, 100%, 0.2)",
  },
}));

const RadioCheckedIcon = styled(RadioIcon)({
  backgroundColor: "white",
  border: "none",
  "&::before": {
    display: "block",
    width: 24,
    height: 24,
    backgroundImage: `radial-gradient(${brand[200]},${brand[200]} 28%,transparent 32%)`,
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "hsla(0, 0%, 100%, 0.85)",
  },
});

export default function RadioButton(props: RadioProps) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<RadioCheckedIcon />}
      icon={<RadioIcon />}
      {...props}
    />
  );
}
