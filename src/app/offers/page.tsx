import { headers } from "next/headers";
import Nav from "@/components/offers/Nav";
import Simulator from "@/components/offers/Simulator";
import { leversFromParams } from "@/lib/offers/params";
import { basePathFor, hostnameFrom } from "@/lib/offers/routes";

export const dynamic = "force-dynamic";

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, headerList] = await Promise.all([searchParams, headers()]);

  // Hydrate on the server so a shared link paints its scenario on first frame.
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
    else if (Array.isArray(value) && value[0]) query.set(key, value[0]);
  }
  const { levers, presetId } = leversFromParams(query);
  // Any lever key in the URL means the link is carrying a scenario of its own.
  const LEVER_KEYS = ["d", "pts", "u", "out", "mix", "h", "fsp", "t", "gcp", "q3d", "m", "tpm", "o", "preset"];
  const fromLink = LEVER_KEYS.some((k) => query.has(k));
  // Guided is the default: a seller opening this cold should get a
  // recommendation, not a control panel.
  const mode = query.get("mode") === "pro" ? "pro" : "guided";

  return (
    <>
      <Nav base={basePathFor(hostnameFrom(headerList))} current="simulator" />
      <Simulator
        initialLevers={levers}
        initialPresetId={presetId}
        initialMode={mode}
        initialFromLink={fromLink}
      />
    </>
  );
}
