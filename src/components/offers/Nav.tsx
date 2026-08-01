import Link from "next/link";

export default function Nav({
  base,
  current,
}: {
  base: string;
  current: "simulator" | "playbook";
}) {
  const home = base || "/";
  const items = [
    { key: "simulator" as const, label: "Simulator", href: home },
    { key: "playbook" as const, label: "Playbook", href: `${base}/playbook` },
  ];

  return (
    <nav
      className="flex items-center gap-1 border-b px-4 py-2.5 sm:px-6"
      style={{ borderColor: "var(--line)" }}
      aria-label="Offers"
    >
      {items.map((item, index) => (
        <span key={item.key} className="flex items-center">
          {index > 0 ? (
            <span className="o-mono o-faint px-1 text-[11px]" aria-hidden="true">
              ·
            </span>
          ) : null}
          <Link
            href={item.href}
            className="o-mono text-[11px] tracking-[0.08em] uppercase"
            style={{
              color: current === item.key ? "var(--ink)" : "var(--ink-faint)",
              padding: "6px 4px",
            }}
            aria-current={current === item.key ? "page" : undefined}
          >
            {item.label}
          </Link>
        </span>
      ))}

      <span className="o-mono o-faint px-1 text-[11px]" aria-hidden="true">
        ·
      </span>
      <form action="/api/offers/logout" method="post" className="contents">
        <button
          type="submit"
          className="o-mono text-[11px] tracking-[0.08em] uppercase"
          style={{
            color: "var(--ink-faint)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 4px",
          }}
        >
          Lock
        </button>
      </form>

      <span className="o-mono o-faint ml-auto hidden text-[10px] sm:inline">
        offers.aitokenomics.app
      </span>
    </nav>
  );
}
