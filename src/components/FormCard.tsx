import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";

const FormCard = styled(Card)(({ theme }) => ({
  borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
  display: "flex",
  padding: "20px",
  background:
    "linear-gradient(127.43deg, rgba(255, 255, 255, 0.1) 2.54%, rgba(153, 153, 153, 0.1) 97.47%)",
  border: "1px solid hsla(0, 0%, 100%, 0.2)",
}));

export default FormCard;
