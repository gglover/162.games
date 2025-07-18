import { goodBadColorScale } from "../../utils";
import { RankingPoint } from "./RankingPoint";

export function RankingsKey() {
  return (
    <div className="flex flex-col justify-end text-gray-600 text-[10px] px-2">
      <div>Opponent rank during series</div>
      <svg width={20} height={50}>
        <RankingPoint
          x={5}
          yStart={5}
          yEnd={45}
          color={goodBadColorScale(0.2)}
          seriesId="1"
        />
      </svg>
      <div>Opponent latest rank</div>
    </div>
  );
}
