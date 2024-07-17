import * as React from "react";
import { msg, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentLocale } from "next-i18n-router/client";
import { i18nConfig } from "@/i18nConfig";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { tooltipClasses } from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import AppBarMenu from "./AppBarMenu";
import LanguageIcon from "./icons/LanguageIcon";

type LOCALES = "en" | "es";

const languages = {
  en: msg`English`,
  es: msg`Spanish`,
} as const;

export default function LanguageSelect() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { i18n } = useLingui();
  const pathname = usePathname();
  const locale = useCurrentLocale(i18nConfig);

  function handleClick(selectedLocale: string) {
    const newLocale = selectedLocale as LOCALES;
    const currentLocalIsDefault = i18nConfig.defaultLocale === locale;
    const splitIndex = currentLocalIsDefault ? 1 : 2;

    const pathNameWithoutLocale = pathname?.split("/")?.slice(splitIndex) ?? [];
    const newPath = `/${newLocale}/${pathNameWithoutLocale.join("/")}`;

    router.push(newPath);
    setOpen(false);
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        <AppBarMenu
          open={open}
          onClose={() => setOpen(false)}
          offsetTop={6}
          sx={{
            [`& .${tooltipClasses.tooltip}`]: {
              paddingY: 0,
              width: 200,
              border:'1px solid',
              "& .MuiBox-root": {
                py: "10px",
              },
            },
          }}
          title={
            <>
              {Object.keys(languages).map((currentLocale) => (
                <MenuItem
                  key={currentLocale}
                  selected={currentLocale === locale}
                  onClick={() => handleClick(currentLocale)}
                >
                  {i18n._(languages[currentLocale as keyof typeof languages])}
                </MenuItem>
              ))}
            </>
          }
        >
          <IconButton
            aria-label={t(i18n)`Language`}
            sx={{ padding: 0 }}
            onClick={() => setOpen(true)}
          >
            <LanguageIcon />
          </IconButton>
        </AppBarMenu>
      </div>
    </ClickAwayListener>
  );
}
