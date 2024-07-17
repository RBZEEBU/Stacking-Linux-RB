/** @type {import('@lingui/conf').LinguiConfig} */
const { i18nConfig } = require("./src/i18nConfig");

module.exports = {
  locales: i18nConfig.locales,
  sourceLocale: "en",
  fallbackLocales: {
    default: i18nConfig.defaultLocale,
  },
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src/"],
    },
  ],
};
