"use client";

import * as React from "react";
import { Trans } from "@lingui/macro";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FacebookIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/X";
import { Grid, Theme } from "@mui/material";

function Copyright() {
  return (
    <Typography mt={1} color="text.primary" sx={{ opacity: "50%" }}>
      <Trans>
        Copyright ©{" "}
        <Link href="#" color="text.primary">
          Zeebu&nbsp;
        </Link>
        {new Date().getFullYear()}
      </Trans>
    </Typography>
  );
}

export default function Footer() {
  const getIconStyles = (theme: Theme) => ({
    color: theme.palette.mode === "dark" ? "white" : "black",
  });

  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: "space-between",
        pt: { xs: 4, sm: 8 },
        pb: "50px",
        width: "100%",
        borderColor: "divider",
      }}
    >
      <Grid item>
        <Link color="text.primary" href="#">
          <Trans>Privacy Policy</Trans>
        </Link>
        <Typography display="inline" sx={{ mx: 0.5, opacity: 0.5 }}>
          &nbsp;•&nbsp;
        </Typography>
        <Link color="text.primary" href="#">
          <Trans>Terms of Service</Trans>
        </Link>
        <Copyright />
      </Grid>
      <Grid item>
        <Stack direction="row" justifyContent="left" spacing={1} useFlexGap>
          <IconButton
            color="inherit"
            href="#"
            aria-label="GitHub"
            sx={{ alignSelf: "center" }}
          >
            <FacebookIcon sx={getIconStyles} />
          </IconButton>
          <IconButton
            color="inherit"
            href="#"
            aria-label="X"
            sx={{ alignSelf: "center" }}
          >
            <TwitterIcon sx={getIconStyles} />
          </IconButton>
          <IconButton
            color="inherit"
            href="#"
            aria-label="LinkedIn"
            sx={{ alignSelf: "center" }}
          >
            <LinkedInIcon sx={getIconStyles} />
          </IconButton>
        </Stack>
      </Grid>
    </Grid>
  );
}
