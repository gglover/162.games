import { TODAY, WIN_INTERVAL_HEIGHT } from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import {
  dateToRecordsKey,
  earlierDate,
  heatIndexIcon,
  heatIndexSize,
  opponentId,
  seriesHalfwayPoint,
  seriesOutcome,
  seriesOutcomeColor,
} from "../../utils";

const OPPONENT_HEAT_INDEX_OFFSET = 12;

export interface SeriesResultsProps {
  teamId: TeamId;
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  minimal?: boolean;
}

export function SeriesResults({
  teamId,
  xScale,
  yScale,
  minimal = false,
}: SeriesResultsProps) {
  const scheduleData = useScheduleDataContext();

  const seriesIds = scheduleData.schedules[teamId].filter(
    (id) => scheduleData.series[id]
  );

  const playedSchedule = seriesIds.filter(
    (id) => scheduleData.series[id].start <= TODAY
  );

  const seriesOutcomeHeight = (id: SeriesId) => {
    const outcome = seriesOutcome(teamId, scheduleData.series[id]);
    const recordChange = outcome[1] - outcome[0];

    return WIN_INTERVAL_HEIGHT * Math.abs(recordChange) || 2;
  };

  const recordBeforeSeries = (seriesId: SeriesId, teamId: TeamId) => {
    const series = scheduleData.series[seriesId];

    const dayBeforeSeries = new Date(series.start);
    dayBeforeSeries.setDate(series.start.getDate() - 1);

    const dateKey = dateToRecordsKey(dayBeforeSeries);

    if (!scheduleData.records[dateKey]) {
      return [0, 0, 0, 0];
    }

    return scheduleData.records[dateKey][
      teamId === series.home ? series.home : series.away
    ];
  };

  const seriesOutcomeY = (id: SeriesId) => {
    const outcome = seriesOutcome(teamId, scheduleData.series[id]);
    const recordChange = outcome[1] - outcome[0];

    const record = recordBeforeSeries(id, teamId);
    let initialY = yScale(record[0] - record[1]);

    if (recordChange === 0) {
      return initialY - 1;
    } else if (recordChange < 0) {
      return initialY + recordChange * WIN_INTERVAL_HEIGHT;
    } else {
      return initialY;
    }
  };

  const opponentHeatIndexBeforeSeries = (id: SeriesId) => {
    const opponent = opponentId(teamId, scheduleData.series[id]);

    const dayBeforeSeries = new Date(scheduleData.series[id].start);
    dayBeforeSeries.setDate(scheduleData.series[id].start.getDate() - 1);
    const dateKey = dateToRecordsKey(dayBeforeSeries);

    return scheduleData.records[dateKey]?.[opponent][3] ?? 0;
  };

  return (
    <g className={minimal ? "grayscale opacity-60" : ""}>
      {playedSchedule.map((id: SeriesId) => (
        <rect
          key={id}
          height={seriesOutcomeHeight(id)}
          width={
            xScale(earlierDate(scheduleData.series[id].end, TODAY)) -
            xScale(scheduleData.series[id].start)
          }
          fill={seriesOutcomeColor(teamId, scheduleData.series[id])}
          x={xScale(scheduleData.series[id].start)}
          y={seriesOutcomeY(id)}
        />
      ))}

      {!minimal &&
        playedSchedule.map((id: SeriesId) => (
          <text
            key={id}
            textAnchor="middle"
            x={seriesHalfwayPoint(scheduleData.series[id], xScale)}
            fontSize={`${heatIndexSize(opponentHeatIndexBeforeSeries(id))}px`}
            height={OPPONENT_HEAT_INDEX_OFFSET}
            width={
              xScale(scheduleData.series[id].end) -
              xScale(scheduleData.series[id].start)
            }
            y={seriesOutcomeY(id) - OPPONENT_HEAT_INDEX_OFFSET / 2}
          >
            {heatIndexIcon(opponentHeatIndexBeforeSeries(id))}
          </text>
        ))}
    </g>
  );
}
