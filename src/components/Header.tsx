import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type HeaderProps = {
  title: React.ReactNode;
  children?: React.ReactNode;
};

export default function Header(props: HeaderProps) {
  return (
    <Box sx={{ marginBottom: "30px" }}>
      <Typography variant="h1" fontWeight="bold" color="title.primary">
        {props.title}
      </Typography>
      {props.children}
    </Box>
  );
}
