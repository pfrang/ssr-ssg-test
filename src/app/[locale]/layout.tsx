import { PORTAL_COMPONENT_ATTRIBUTE } from "@enonic/nextjs-adapter";
import { SioTrackingScripts } from "../client-side-wrappers/script-wrapper";

export default function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {

    const bodyAttrs: { [key: string]: string } = {
        className: "edit",
        [PORTAL_COMPONENT_ATTRIBUTE]: "page",
    };

    // const locale = Localization.toAppLocale(params.locale);
    return <html className="notranslate" translate="no" lang={params.locale}><body {...bodyAttrs}><SioTrackingScripts locale={params.locale} />{children}</body></html>;
}
