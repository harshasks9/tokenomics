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

  if (hostname === "agentic.aitokenomics.app") {
    const agenticUrl = request.nextUrl.clone();
    agenticUrl.pathname = "/agentic/index.html";
    return rewriteWithLanguage(agenticUrl);
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

  if (hostname === "voice.aitokenomics.app") {
    const voiceUrl = request.nextUrl.clone();
    if (voiceUrl.pathname === "/") {
      voiceUrl.pathname = "/voice";
    } else if (!voiceUrl.pathname.startsWith("/voice")) {
      voiceUrl.pathname = `/voice${voiceUrl.pathname}`;
    }
    return rewriteWithLanguage(voiceUrl);
  }

  if (hostname === "brief.aitokenomics.app") {
    const briefUrl = request.nextUrl.clone();
    if (briefUrl.pathname === "/") {
      briefUrl.pathname = "/brief";
    }
    return rewriteWithLanguage(briefUrl);
  }

  if (hostname === "strategy.aitokenomics.app") {
    const strategyUrl = request.nextUrl.clone();
    if (strategyUrl.pathname === "/") {
      strategyUrl.pathname = "/strategy/index.html";
    } else if (!strategyUrl.pathname.startsWith("/strategy")) {
      strategyUrl.pathname = `/strategy${strategyUrl.pathname}`;
    }
    return NextResponse.rewrite(strategyUrl, {
      headers: {
        "Content-Language": "en",
        Vary: "Host",
      },
    });
  }

  if (hostname === "agents.aitokenomics.app" || hostname === "agent.aitokenomics.app") {
    const agentsUrl = request.nextUrl.clone();
    if (agentsUrl.pathname === "/") {
      agentsUrl.pathname = "/agents/index.html";
    } else if (!agentsUrl.pathname.startsWith("/agents")) {
      agentsUrl.pathname = `/agents${agentsUrl.pathname}`;
    }
    return NextResponse.rewrite(agentsUrl, {
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
    return rewriteWithLanguage(dataUrl);
  }

  if (hostname === "casestudies.aitokenomics.app") {
    const caseUrl = request.nextUrl.clone();
    caseUrl.pathname =
      caseUrl.pathname === "/"
        ? "/casestudies/index.html"
        : `/casestudies${caseUrl.pathname}`;
    return NextResponse.rewrite(caseUrl, {
      headers: {
        "Content-Language": "en",
        Vary: "Host",
      },
    });
  }

  if (hostname === "news.aitokenomics.app") {
    const newsUrl = request.nextUrl.clone();
    if (newsUrl.pathname === "/") {
      newsUrl.pathname = "/brief";
    }
    return NextResponse.rewrite(newsUrl, {
      headers: {
        "Content-Language": "en",
        Vary: "Host",
      },
    });
  }

  if (hostname === "prudential.aitokenomics.app") {
    const prudentialUrl = request.nextUrl.clone();
    if (prudentialUrl.pathname === "/") {
      prudentialUrl.pathname = "/prudential";
    }
    return NextResponse.rewrite(prudentialUrl, {
      headers: {
        "Content-Language": "en",
        Vary: "Host",
      },
    });
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
