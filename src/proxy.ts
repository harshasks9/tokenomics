import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JAPANESE_HOST, isJapaneseSite } from "@/lib/i18n";
import { isOptionsRequestAuthenticated } from "@/lib/options/auth";
import { OFFERS_SESSION_COOKIE, isSessionValid } from "@/lib/offers/auth";
import {
  isGatePath,
  isOffersHost,
  isOffersPath,
  toAppPath,
} from "@/lib/offers/routes";

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

/**
 * Offers (offers.aitokenomics.app) — passcode gate.
 *
 * Everything except /gate needs a valid signed session cookie. The gate never
 * fails open: an unconfigured SITE_PASSCODE/SESSION_SECRET means no cookie can
 * validate, so every request lands on /gate. noindex is asserted here as well
 * as in the route metadata.
 */
async function handleOffersRequest(request: NextRequest, hostname: string) {
  const path = request.nextUrl.pathname;
  const targetUrl = request.nextUrl.clone();
  targetUrl.pathname = toAppPath(hostname, path);

  const noindex = (response: NextResponse) => {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Content-Language", "en");
    response.headers.set("Vary", "Host");
    return response;
  };

  if (isGatePath(hostname, path)) {
    return noindex(NextResponse.rewrite(targetUrl));
  }

  const authenticated = await isSessionValid(
    request.cookies.get(OFFERS_SESSION_COOKIE)?.value,
  );

  if (!authenticated) {
    const gateUrl = request.nextUrl.clone();
    gateUrl.pathname = isOffersHost(hostname) ? "/gate" : "/offers/gate";
    gateUrl.search = "";
    gateUrl.searchParams.set("next", `${path}${request.nextUrl.search}`);
    return noindex(NextResponse.redirect(gateUrl));
  }

  return noindex(NextResponse.rewrite(targetUrl));
}

export async function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.hostname;
  const hostname = host.split(":")[0].toLowerCase();
  const path = request.nextUrl.pathname;

  if (isOffersPath(hostname, path)) {
    return handleOffersRequest(request, hostname);
  }

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

  if (hostname === "korea.aitokenomics.app") {
    const koreaUrl = request.nextUrl.clone();
    if (koreaUrl.pathname === "/") {
      koreaUrl.pathname = "/korea";
    }
    return NextResponse.rewrite(koreaUrl, {
      headers: {
        "Content-Language": "en",
        Vary: "Host",
      },
    });
  }

  // MODELCOMP. The brief named the .com host; the rest of the family lives on
  // .app, so both are routed here rather than guessing which DNS record exists.
  if (
    hostname === "modelcomp.aitokenomics.com" ||
    hostname === "modelcomp.aitokenomics.app"
  ) {
    const modelcompUrl = request.nextUrl.clone();
    if (modelcompUrl.pathname === "/") {
      modelcompUrl.pathname = "/modelcomp";
    } else if (!modelcompUrl.pathname.startsWith("/modelcomp")) {
      modelcompUrl.pathname = `/modelcomp${modelcompUrl.pathname}`;
    }
    const response = NextResponse.rewrite(modelcompUrl, {
      headers: {
        "Content-Language": "en",
        Vary: "Host",
      },
    });
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  // FrontierOps — multi-cloud AI FinOps dashboard (DAIT).
  if (hostname === "dait.aitokenomics.app") {
    const daitUrl = request.nextUrl.clone();
    if (daitUrl.pathname === "/") {
      daitUrl.pathname = "/finops";
    } else if (!daitUrl.pathname.startsWith("/finops")) {
      daitUrl.pathname = `/finops${daitUrl.pathname}`;
    }
    const response = NextResponse.rewrite(daitUrl, {
      headers: {
        "Content-Language": "en",
        Vary: "Host",
      },
    });
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
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
