import { SioTrackingScripts } from "../client-side-wrappers/script-wrapper";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return <html className="notranslate" translate="no" lang={params.locale}><body><SioTrackingScripts locale={params.locale} />{children}</body></html>;
}
