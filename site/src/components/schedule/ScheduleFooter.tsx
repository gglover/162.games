import * as d3 from "d3";
import { CHART_WIDTH, FOOTER_HEIGHT, TODAY } from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { TeamId } from "../../interfaces";
import { dateToRecordsKey, goodBadColorScale } from "../../utils";
import { useEffect, useRef } from "react";

export interface ScheduleFooterProps {
  teamId: TeamId;
  xScale: d3.ScaleTime<number, number>;
}

export function ScheduleFooter({ teamId, xScale }: ScheduleFooterProps) {
  const xAxisRef = useRef(null);
  const scheduleData = useScheduleDataContext();

  useEffect(() => {
    const element = d3.select(xAxisRef.current);
    // @ts-ignore
    const axisGenerator = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
    // @ts-ignore
    element.append("g").call(axisGenerator);
  }, []);

  const dateList = [];
  const startDate = scheduleData.start;
  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  while (currentDate < TODAY && currentDate < scheduleData.end) {
    // Format as YYYY-MM-DD (optional)
    currentDate.setDate(currentDate.getDate() + 1);
    dateList.push(new Date(currentDate));
  }

  const heatIndex = (date: Date) => {
    const dateIndex = dateToRecordsKey(date);
    const records = scheduleData.records[dateIndex][teamId];

    return records[3];
  };

  return (
    <svg width={CHART_WIDTH} height={FOOTER_HEIGHT}>
      {dateList.map((date: Date) => (
        <rect
          key={date.toISOString()}
          x={xScale(date)}
          y={0}
          width={5}
          height={10}
          // @ts-ignore
          fill={goodBadColorScale(1 - (heatIndex(date) + 1) / 2)}
        ></rect>
      ))}

      <g ref={xAxisRef} className="axis" transform="translate(0, 10)"></g>
    </svg>
  );
}
