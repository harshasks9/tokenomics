import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JAPANESE_HOST, isJapaneseSite } from "@/lib/i18n";
import { isOptionsRequestAuthenticated } from "@/lib/options/auth";

function rewriteWithLanguage(url: URL) {
  return NextResponse.rewrite(url, {
    headers: {
      "Content-Language": "en",
      Vary: "Host",
    },
  });
}

async function handleOptionsRequest(request: NextRequest, optionsHost: boolean) {
  const path = request.nextUrl.pathname;
  const isLoginPath = path === "/login" || path === "/options/login";
  const targetUrl = request.nextUrl.clone();

  if (optionsHost) {
    if (path === "/") targetUrl.pathname = "/options";
    else if (path === "/login") targetUrl.pathname = "/options/login";
    else if (!path.startsWith("/options")) targetUrl.pathname = `/options${path}`;
  }

  if (!isLoginPath && !(await isOptionsRequestAuthenticated(request))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = optionsHost ? "/login" : "/options/login";
    loginUrl.searchParams.set("next", optionsHost ? path : `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return rewriteWithLanguage(targetUrl);
}

export async function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.hostname;
  const hostname = host.split(":")[0].toLowerCase();
  const path = request.nextUrl.pathname;

  if (hostname === "options.aitokenomics.app" || path.startsWith("/options")) {
    return handleOptionsRequest(request, hostname === "options.aitokenomics.app");
  }

  if (hostname === "deck.aitokenomics.app") {
    const deckUrl = request.nextUrl.clone();
    deckUrl.pathname = "/deck/index.html";
    return rewriteWithLanguage(deckUrl);
  }

  if (hostname === "gemini25.aitokenomics.app") {
    const geminiUrl = request.nextUrl.clone();
    if (geminiUrl.pathname === "/") {
      geminiUrl.pathname = "/gemini25";
    }
    return rewriteWithLanguage(geminiUrl);
  }

  if (
    hostname === "plus.aitokenomics.app" ||
    hostname === "value.aitokenomics.app" ||
    hostname === "enterprise.aitokenomics.app"
  ) {
    const plusUrl = request.nextUrl.clone();
    if (plusUrl.pathname === "/") {
      plusUrl.pathname = "/gemini-plus";
    }
    return rewriteWithLanguage(plusUrl);
  }

  if (hostname === "data.aitokenomics.app") {
    const dataUrl = request.nextUrl.clone();
    if (dataUrl.pathname === "/") {
      dataUrl.pathname = "/data";
    }
    return rewriteWithLanguage(dataUrl);
  }

  const japanese = isJapaneseSite(host, request.nextUrl.search);
  const response = NextResponse.next();
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
