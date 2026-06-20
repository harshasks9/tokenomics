import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JAPANESE_HOST, isJapaneseSite } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.hostname;
  const hostname = host.split(":")[0].toLowerCase();

  if (hostname === "deck.aitokenomics.app") {
    const deckUrl = request.nextUrl.clone();
    deckUrl.pathname = "/deck/index.html";
    return NextResponse.rewrite(deckUrl, {
      headers: {
        "Content-Language": "en",
        Vary: "Host",
      },
    });
  }

  if (hostname === "gemini25.aitokenomics.app") {
    const geminiUrl = request.nextUrl.clone();
    if (geminiUrl.pathname === "/") {
      geminiUrl.pathname = "/gemini25";
    }
    return NextResponse.rewrite(geminiUrl, {
      headers: {
        "Content-Language": "en",
        Vary: "Host",
      },
    });
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
    return NextResponse.rewrite(plusUrl, {
      headers: {
        "Content-Language": "en",
        Vary: "Host",
      },
    });
  }
  if (hostname === "data.aitokenomics.app") {
    const dataUrl = request.nextUrl.clone();
    if (dataUrl.pathname === "/") {
      dataUrl.pathname = "/data";
    }
    return NextResponse.rewrite(dataUrl, {
      headers: {
        "Content-Language": "en",
        Vary: "Host",
      },
    });
  }

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
