import {
  CHART_HEIGHT,
  CHART_WIDTH,
  FIVE_HUNDRED_RECORD_Y,
  WIN_INTERVAL_HEIGHT,
} from "../../chart/constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import {
  dateToRecordsKey,
  opponentId,
  seriesOutcome,
  seriesOutcomeColor,
  heatIndexIcon,
  heatIndexSize,
  earlierDate,
} from "../../utils";

const HOME_BLOCK_COLOR = "#f0f0f0";
const AWAY_BLOCK_COLOR = "#f7f7f7";
const FIVE_HUNDRED_STROKE_COLOR = "#d0d0d0";
const OPPONENT_HEAT_INDEX_SIZE = 12;

export interface NetRecordProps {
  teamId: TeamId;
  xScale: d3.ScaleTime<number, number>;
}

export function NetRecord({ teamId, xScale }: NetRecordProps) {
  const scheduleData = useScheduleDataContext();

  const schedule = scheduleData.schedules[teamId].filter(
    (id) => scheduleData.series[id]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const playedSchedule = schedule.filter(
    (id) => scheduleData.series[id].start < today
  );

  const currentSeriesId = schedule.find(
    (id: SeriesId) =>
      scheduleData.series[id].start < today &&
      scheduleData.series[id].end > today
  );

  let rollingY = FIVE_HUNDRED_RECORD_Y;

  const opponentRecordForSeries = (id: SeriesId) => {
    const opponent = opponentId(teamId, scheduleData.series[id]);
    const dateKey = dateToRecordsKey(scheduleData.series[id].start);
    return scheduleData.records[dateKey][opponent];
  };

  const seriesOutcomeHeight = (id: SeriesId) => {
    const outcome = seriesOutcome(teamId, scheduleData.series[id]);
    const recordChange = outcome[1] - outcome[0];

    return WIN_INTERVAL_HEIGHT * Math.abs(recordChange) || 1;
  };

  const seriesOutcomeY = (id: SeriesId) => {
    const outcome = seriesOutcome(teamId, scheduleData.series[id]);
    const recordChange = outcome[1] - outcome[0];

    const current = rollingY;
    rollingY += recordChange * WIN_INTERVAL_HEIGHT;

    return (
      current + (recordChange < 0 ? recordChange * WIN_INTERVAL_HEIGHT : 0)
    );
  };

  // .gradient-repeating-lines {
  //   background-image: repeating-linear-gradient(
  //     45deg,
  //     #eee 10px,
  //     #eee 12px,
  //     transparent 12px,
  //     transparent 20px
  //   );
  // }

  return (
    <svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      <defs>
        <pattern
          id="Pattern"
          x="0"
          y="0"
          width="2"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="100" y2="0" stroke="blue" />
        </pattern>
      </defs>

      <g>
        {schedule.map((id: SeriesId) => (
          <rect
            key={id}
            width={
              xScale(scheduleData.series[id].end) -
              xScale(scheduleData.series[id].start)
            }
            height={CHART_HEIGHT}
            fill={
              scheduleData.series[id].home === teamId
                ? HOME_BLOCK_COLOR
                : AWAY_BLOCK_COLOR
            }
            x={xScale(scheduleData.series[id].start)}
            y="0"
          />
        ))}
      </g>

      <line
        x1="0"
        y1={FIVE_HUNDRED_RECORD_Y}
        x2={CHART_WIDTH}
        y2={FIVE_HUNDRED_RECORD_Y}
        style={{
          strokeDasharray: "5,3",
          stroke: FIVE_HUNDRED_STROKE_COLOR,
        }}
      />

      {playedSchedule.map((id: SeriesId) => (
        <rect
          key={id}
          height={seriesOutcomeHeight(id)}
          width={
            xScale(earlierDate(scheduleData.series[id].end, today)) -
            xScale(scheduleData.series[id].start)
          }
          fill={seriesOutcomeColor(teamId, scheduleData.series[id])}
          x={xScale(scheduleData.series[id].start)}
          y={seriesOutcomeY(id)}
        />
      ))}

      {(rollingY = FIVE_HUNDRED_RECORD_Y)}

      {playedSchedule.map((id: SeriesId) => (
        <text
          key={id}
          x={xScale(scheduleData.series[id].start)}
          fontSize={heatIndexSize(opponentRecordForSeries(id)[3])}
          height={OPPONENT_HEAT_INDEX_SIZE}
          width={OPPONENT_HEAT_INDEX_SIZE}
          y={seriesOutcomeY(id) - OPPONENT_HEAT_INDEX_SIZE / 2}
        >
          {heatIndexIcon(opponentRecordForSeries(id)[3])}
        </text>
      ))}

      {currentSeriesId && (
        <rect
          height={CHART_HEIGHT}
          width={
            xScale(scheduleData.series[currentSeriesId].end) -
            xScale(scheduleData.series[currentSeriesId].start)
          }
          x={xScale(scheduleData.series[currentSeriesId].start)}
          y="0"
          className="gradient-repeating-lines"
          fill="url(#Pattern)"
        />
      )}
    </svg>
  );
}
