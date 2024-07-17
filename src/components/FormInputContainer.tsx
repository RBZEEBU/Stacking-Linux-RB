import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const FormInputContainer = styled(Box)(({ theme }) => ({
  border: "1px solid hsla(0, 0%, 100%, 0.2)",
  borderRadius: theme.shape.borderRadius,
  padding: "8px",
  display: "flex",
  alignItems: "center",
  background:
    "linear-gradient(127.43deg, rgba(255, 255, 255, 0.1) 2.54%, rgba(153, 153, 153, 0.1) 97.47%)",
  flex: 1,
}));

export default FormInputContainer;
