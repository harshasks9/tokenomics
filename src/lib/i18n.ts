export const JAPANESE_HOST =
  process.env.NEXT_PUBLIC_JAPANESE_HOST ?? "jp.aitokenomics.app";

export function isJapaneseSite(hostname: string, search = "") {
  const host = hostname.toLowerCase().split(":")[0];
  const params = new URLSearchParams(search);

  return (
    host === JAPANESE_HOST ||
    host.startsWith("jp.") ||
    host.startsWith("ja.") ||
    params.get("lang") === "ja"
  );
}

export function englishUrl(pathname: string, search = "") {
  const params = new URLSearchParams(search);
  params.delete("lang");
  const query = params.toString();

  return `https://aitokenomics.app${pathname}${query ? `?${query}` : ""}`;
}
