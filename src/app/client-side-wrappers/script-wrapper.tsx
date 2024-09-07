/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import DOMPurify from "isomorphic-dompurify";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export enum ConsentCategories {
  Statistics = "cookie_cat_statistic",
  Marketing = "cookie_cat_marketing",
  Functional = "cookie_cat_functional",
}

export const sitePath = "sio.no";



export const isConsentApprovedFor = (consentCategory: ConsentCategories) => {
  const cookieValue = getValueFromCookieByName("CookieInformationConsent");

  if (cookieValue && "consents_approved" in cookieValue) {
    return cookieValue.consents_approved.includes(consentCategory);
  } else {
    return false;
  }
};


export const getValueFromCookieByName = (cname: string) => {
  if (typeof window !== "undefined") {
    const cvalue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cname}=`))
      ?.split("=")[1];

    if (cvalue) {
      try {
        return JSON.parse(decodeURIComponent(cvalue));
      } catch (err) {
        console.error(err);
        return false;
      }
    } else {
      return false;
    }
  }
};



export const sanitize = (dirtyString: string): string => {
  const cleanString = DOMPurify.sanitize(dirtyString);
  return cleanString;
};




export const SioTrackingScripts = ({ locale }: { locale: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = searchParams?.get("hash");
    if (hash) {
      smoothScrollToAnchor(hash);
    }
  }, [pathname, searchParams]);


  const localhostLocations = ["127.0.0.1", "localhost"];

  const [consentsApproved, setConsentsApproved] = useState<ConsentCategories[]>(
    [],
  );



  const pathsForOpenPositionsTrackingScript = [
    "/",
    "/om-sio",
    "/om-sio/organisasjon",
    "/om-sio/ledige-stillinger",
  ];

  const shouldLoadOpenPositionsTrackingScript =
    pathsForOpenPositionsTrackingScript.includes(pathname || "");

  const [shouldLoadScripts, setShouldLoadScripts] = useState(false);

  useEffect(() => {
    if (window.location.host.includes(sitePath)) {
      setShouldLoadScripts(true);
    }
  }, []);

  useEffect(() => {
    // Looking for changes in consent cookie for each time the route.asPath changes.
    const newConsents =
      Object.values(ConsentCategories).filter(isConsentApprovedFor);

    setConsentsApproved(newConsents);
  }, [pathname]);

  return (
    <>
      {shouldLoadScripts && (
        <>
          <script
            defer
            id="CookieConsent"
            src="https://policy.app.cookieinformation.com/uc.js"
            data-culture={localeToDataCulture(locale)}
            type="text/javascript"
          ></script>

          {/* Ontame - open positions script */}
          {shouldLoadOpenPositionsTrackingScript && (
            <script
              defer
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: sanitize(
                  `!function(b,c,f,g,h,i,j) {b[h] || ((b[h] = function () {
                  (b[h].q = b[h].q || []).push(arguments);
                }), (b[h].q = b[h].q || []), (i = c.createElement(f)),
                (j = c.getElementsByTagName(f)[0]), (i.async = 1), (i.src = g),
                j.parentNode.insertBefore(i, j))}
                (window,document,"script","https://cdn.ontame.io/sio.js","ontame");`,
                ),
              }}
            ></script>
          )}

          <script
            defer
            id="matomo-snippet"
            dangerouslySetInnerHTML={{
              __html:
                sanitize(`(function(){var _mtm = window._mtm = window._mtm || [];
           _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
           var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
           g.async=true; g.src='https://cdn.matomo.cloud/sio.matomo.cloud/container_Sv6cNPks.js'; s.parentNode?.insertBefore(g,s);})()`),
            }}
          />

          {consentsApproved.includes(ConsentCategories.Marketing) && (
            <script
              defer
              dangerouslySetInnerHTML={{
                __html: sanitize(`(function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:2885464,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`),
              }}
            />
          )}
        </>
      )}
    </>
  );
};

const localeToDataCulture = (locale: string) => {
  return locale === "en" ? "EN" : "NB";
};

const smoothScrollToAnchor = (id: string) => {
  let attempts = 0;
  const maxAttempts = 20;

  const checkElement = setInterval(() => {
    const element = document.getElementById(id);

    if (element || attempts > maxAttempts) {
      clearInterval(checkElement);

      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const top = rect.top + scrollTop - 64; // Adjust for minimum header height

        window.scrollTo({
          top: top,
          behavior: "smooth",
        });
      }
    }

    attempts++;
  }, 100);
};
