import { TODAY, WIN_INTERVAL_HEIGHT } from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import {
  dateToRecordsKey,
  earlierDate,
  heatIndexIcon,
  heatIndexSize,
  opponentId,
  seriesOutcome,
  seriesOutcomeColor,
} from "../../utils";

const OPPONENT_HEAT_INDEX_SIZE = 12;

export interface SeriesResultsProps {
  teamId: TeamId;
  seriesIds: SeriesId[];
  xScale: d3.ScaleTime<number, number>;
}

export function SeriesResults({
  teamId,
  seriesIds,
  xScale,
}: SeriesResultsProps) {
  const scheduleData = useScheduleDataContext();

  const seriesOutcomeHeight = (id: SeriesId) => {
    const outcome = seriesOutcome(teamId, scheduleData.series[id]);
    const recordChange = outcome[1] - outcome[0];

    return WIN_INTERVAL_HEIGHT * Math.abs(recordChange) || 1;
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
    let initialY = (record[0] - record[1]) * -WIN_INTERVAL_HEIGHT;

    return (
      initialY + (recordChange < 0 ? recordChange * WIN_INTERVAL_HEIGHT : 0)
    );
  };

  const opponentRecordForSeries = (id: SeriesId) => {
    const opponent = opponentId(teamId, scheduleData.series[id]);
    const dateKey = dateToRecordsKey(scheduleData.series[id].start);
    return scheduleData.records[dateKey][opponent];
  };

  return (
    <g>
      {seriesIds.map((id: SeriesId) => (
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

      {seriesIds.map((id: SeriesId) => (
        <text
          key={id}
          x={xScale(scheduleData.series[id].start)}
          fontSize={heatIndexSize(opponentRecordForSeries(id)[3])}
          height={OPPONENT_HEAT_INDEX_SIZE}
          width={OPPONENT_HEAT_INDEX_SIZE}
          y={-190 + OPPONENT_HEAT_INDEX_SIZE / 2}
        >
          {heatIndexIcon(opponentRecordForSeries(id)[3])}
        </text>
      ))}
    </g>
  );
}
