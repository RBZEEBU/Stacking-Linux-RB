import React, { ReactNode } from "react";
import { allI18nInstances } from "../appRouterI18n";
import { setI18n } from "@lingui/react/server";

export type PageLocaleParam = {
  params: { locale: string };
};

type PageProps = PageLocaleParam & {
  searchParams?: any; // in query
};

type LayoutProps = PageLocaleParam & {
  children: React.ReactNode;
};

type PageExposedToNextJS<Props extends PageProps> = (props: Props) => ReactNode;

export const withLinguiPage = <Props extends PageProps>(
  AppRouterPage: React.ComponentType<PageLocaleParam & Props>,
): PageExposedToNextJS<Props> => {
  return function WithLingui(props) {
    const lang = props.params.locale;
    const i18n = allI18nInstances[lang]!;
    setI18n(i18n);

    return <AppRouterPage {...props} lang={lang} />;
  };
};

type LayoutExposedToNextJS<Props extends LayoutProps> = (
  props: Props,
) => ReactNode;

export const withLinguiLayout = <Props extends LayoutProps>(
  AppRouterPage: React.ComponentType<PageLocaleParam & Props>,
): LayoutExposedToNextJS<Props> => {
  return function WithLingui(props) {
    const locale = props.params.locale;
    const i18n = allI18nInstances[locale]!;
    setI18n(i18n);

    return <AppRouterPage {...props} locale={locale} />;
  };
};
