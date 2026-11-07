import LiveByLunch from "@/components/live-by-lunch/LiveByLunch";
import { TRACKS } from "@/lib/live-by-lunch/tracks";

export default function LiveByLunchPage() {
  return <LiveByLunch tracks={TRACKS} />;
}
