import { FRONT_PATHS, BACK_PATHS } from "@/components/booking/steps/bodyDiagramPaths";
import { DATA_KEY_TO_LABEL } from "@/components/booking/steps/bodyDiagramLabels";

interface PlacementPreviewProps {
  placement: string | null;
  className?: string;
}

function parsePlacementToDataKey(placement: string | null): string | null {
  if (!placement) return null;
  const [partLabel, sideLabel] = placement.split(" - ");
  if (!partLabel?.trim() || !sideLabel?.trim()) return null;
  const isFront = sideLabel.trim() === "Урд тал";
  const prefix = isFront ? "front-" : "back-";
  const entry = Object.entries(DATA_KEY_TO_LABEL).find(
    ([k, v]) => v === partLabel.trim() && k.startsWith(prefix)
  );
  return entry?.[0] ?? null;
}

export function PlacementPreview({ placement, className }: PlacementPreviewProps) {
  const dataKey = parsePlacementToDataKey(placement);
  const isFront = dataKey?.startsWith("front-") ?? true;
  const paths = isFront ? FRONT_PATHS : BACK_PATHS;

  return (
    <svg
      viewBox="0 0 226 373"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {paths.map(({ key, d }) => (
        <path
          key={key}
          d={d}
          fill="currentColor"
          className={dataKey === key ? "opacity-100" : "opacity-25"}
        />
      ))}
    </svg>
  );
}
