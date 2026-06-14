import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JAPANESE_HOST, isJapaneseSite } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.hostname;
  const japanese = isJapaneseSite(host, request.nextUrl.search);
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;
  const english = `https://aitokenomics.app${path}`;
  const japaneseUrl = `https://${JAPANESE_HOST}${path}`;

  response.headers.set("Content-Language", japanese ? "ja" : "en");
  response.headers.set("Vary", "Host");
  response.headers.set(
    "Link",
    `<${english}>; rel="alternate"; hreflang="en", <${japaneseUrl}>; rel="alternate"; hreflang="ja", <${english}>; rel="alternate"; hreflang="x-default"`,
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
