import { CHART_WIDTH, LOGOS_HEIGHT } from "../../chart/constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import { opponentId } from "../../utils";
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
    <svg width={CHART_WIDTH} height={LOGOS_HEIGHT}>
      <g transform={`translate(${LOGO_SIZE / -2}, 0)`}>
        {schedule.map((id: SeriesId) => (
          <TeamLogo
            key={id}
            id={opponentId(teamId, scheduleData.series[id])}
            size={LOGO_SIZE}
            x={xScale(scheduleData.series[id].start)}
            y={0}
          />
        ))}
      </g>
    </svg>
  );
}
