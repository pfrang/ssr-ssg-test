/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ASSET = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  //   if (
  //     request.nextUrl.pathname.startsWith("/_next") ||
  //     request.nextUrl.pathname.includes("/api") ||
  //     request.nextUrl.pathname.startsWith("/_/enonic") ||
  //     PUBLIC_ASSET.test(request.nextUrl.pathname)
  //   ) {
  //     return;
  //   }

  const requestURL = request.nextUrl.clone();

  if (requestURL.searchParams.has("path")) {
    requestURL.searchParams.delete("path");
  }

  // Redirect from https://sio.no to https://www.sio.no
  if (
    requestURL.href.includes("https://sio.no") &&
    requestURL.host !== "www.sio.no"
  ) {
    const urlToRedirectTo = requestURL
      .toString()
      .replace("sio.no", "www.sio.no");
    return NextResponse.redirect(urlToRedirectTo);
  }

  const housingHost = {
    no: "https://www.sio.no/bolig",
    en: "https://www.sio.no/housing",
  }


  if (
    requestURL.pathname.startsWith("/bolig") ||
    requestURL.pathname.startsWith("/minside/min-okonomi")
  ) {
    return NextResponse.redirect(housingHost.no);
  }

  if (
    requestURL.pathname.startsWith("/housing") ||
    requestURL.pathname.startsWith("/en/housing") ||
    requestURL.pathname.startsWith("/mypage/my-finances") ||
    requestURL.pathname.startsWith("/shortcuts/contact/housing")
  ) {
    return NextResponse.redirect(housingHost.en);
  }

  const slug = requestURL.pathname;
  // const shouldRedirect = await new UrlScopedFeatureToggle().shouldRedirect(
  //   Slug.from(slug),
  // );

  // if (shouldRedirect) {
  //   const defaultSlug = "/404";
  //   requestURL.pathname = Slug.from(defaultSlug).toString();
  //   // eslint-disable-next-line no-console
  //   console.info(`Middleware redirecting from ${slug}`);
  //   return NextResponse.redirect(requestURL);
  // }

  const headers = new Headers(request.headers);
  headers.set("x-current-path", slug);
  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     * see: https://nextjs.org/docs/advanced-features/middleware
     */
    "/((?!favicon.ico|_next/webpack-hmr|_next/static|_next/image|api/|images/|pwa/|illustrations/|badges/|sw.js).*)",
  ],
};
