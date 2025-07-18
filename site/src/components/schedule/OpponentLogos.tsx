import {
  ALL_STAR_GAMES,
  CHART_WIDTH,
  DIVISION_LEADER_COLOR,
  LOGOS_HEIGHT,
} from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import { opponentId, seriesHalfwayPoint } from "../../utils";
import { TeamLogo } from "../TeamLogo";

const LOGO_SIZE = 12;

export interface OpponentLogosProps {
  teamId: TeamId;
  xScale: d3.ScaleTime<number, number>;
}

export function OpponentLogos({ teamId, xScale }: OpponentLogosProps) {
  const scheduleData = useScheduleDataContext();

  const schedule = scheduleData.schedules[teamId].filter(
    (id) => scheduleData.series[id]
  );

  return (
    <svg
      width={CHART_WIDTH}
      height={LOGOS_HEIGHT}
      style={{ cursor: "pointer" }}
    >
      <g transform={`translate(-${LOGO_SIZE}, 0)`}>
        {schedule.map((id: SeriesId) => (
          <TeamLogo
            key={id}
            id={opponentId(teamId, scheduleData.series[id])}
            size={LOGO_SIZE}
            x={seriesHalfwayPoint(scheduleData.series[id], xScale)}
            y={0}
          />
        ))}
      </g>
      <g
        transform={`translate(${xScale(ALL_STAR_GAMES[scheduleData.start.getFullYear()])} 0)`}
      >
        <path
          transform="scale(0.5) translate(0 12)"
          fill={DIVISION_LEADER_COLOR}
          stroke="#444"
          strokeWidth={2}
          d="m4.178 20.801 6.758-4.91 6.756 4.91-2.58-7.946 6.758-4.91h-8.352L10.936 0 8.354 7.945H0l6.758 4.91-2.58 7.946z"
        />
      </g>
    </svg>
  );
}
