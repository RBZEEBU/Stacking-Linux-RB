import { Box, Typography } from "@mui/material";
import React from "react";

export default function TransactionInfo({
  title,
  description,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        textAlign: "center",
        width: { md: 329 },
      }}
    >
      <Box sx={{ padding: 2 }}>
        <img src="/tx.svg" style={{ maxWidth: "80px", maxHeight: "80px" }} />
      </Box>
      <Typography variant="h5" mb={1}>
        {title}
      </Typography>
      <Typography>{description}</Typography>
    </Box>
  );
}
