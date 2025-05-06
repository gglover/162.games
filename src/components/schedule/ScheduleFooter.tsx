import * as d3 from "d3";
import { CHART_WIDTH, FOOTER_HEIGHT } from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import { dateToRecordsKey, heatIndexIcon, heatIndexSize } from "../../utils";
import { useEffect, useRef } from "react";

export interface ScheduleFooterProps {
  teamId: TeamId;
  xScale: d3.ScaleTime<number, number>;
}

export function ScheduleFooter({ teamId, xScale }: ScheduleFooterProps) {
  const xAxisRef = useRef(null);

  useEffect(() => {
    const element = d3.select(xAxisRef.current);
    const axisGenerator = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
    element.append("g").call(axisGenerator);
  }, []);

  const scheduleData = useScheduleDataContext();

  const schedule = scheduleData.schedules[teamId].filter(
    (id) => scheduleData.series[id]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const playedSchedule = schedule.filter(
    (id) => scheduleData.series[id].start < today
  );

  const opponentHeatIndex = (id: SeriesId) => {
    const dateIndex = dateToRecordsKey(scheduleData.series[id].start);
    const records = scheduleData.records[dateIndex][teamId];

    return records[3];
  };

  return (
    <svg width={CHART_WIDTH} height={FOOTER_HEIGHT}>
      {playedSchedule.map((id: SeriesId) => (
        <text
          key={id}
          x={xScale(scheduleData.series[id].start)}
          y={15}
          fontSize={heatIndexSize(opponentHeatIndex(id))}
        >
          {heatIndexIcon(opponentHeatIndex(id))}
        </text>
      ))}

      <g ref={xAxisRef} className="axis" transform="translate(0, 20)"></g>
      {/* <Axis
        y={25}
        scale={xScale}
        orientation={AxisOrientation.Horizontal}
        tickFormat={abbreviatedMonthTickFormatter}
      /> */}
    </svg>
  );
}
