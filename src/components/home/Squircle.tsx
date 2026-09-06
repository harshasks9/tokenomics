import type { CatalogItem } from "@/lib/home/catalog";

export default function Squircle({
  item,
  size = 64,
}: {
  item: CatalogItem;
  size?: number;
}) {
  const Icon = item.icon;
  return (
    <div
      className="flex items-center justify-center shadow-md transition-shadow duration-200 group-hover:shadow-lg"
      style={{
        width: size,
        height: size,
        borderRadius: "22.37%",
        background: item.gradient,
        border: "1px solid rgba(255,255,255,0.18)",
      }}
    >
      <Icon size={Math.round(size * 0.42)} className="text-white" strokeWidth={1.6} />
    </div>
  );
}
