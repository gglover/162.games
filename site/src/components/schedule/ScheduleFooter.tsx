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
  const scheduleData = useScheduleDataContext();

  useEffect(() => {
    const element = d3.select(xAxisRef.current);
    // @ts-ignore
    const axisGenerator = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
    // @ts-ignore
    element.append("g").call(axisGenerator);
  }, []);

  const schedule = scheduleData.schedules[teamId].filter(
    (id) => scheduleData.series[id]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // const playedSchedule = schedule.filter(
  //   (id) => scheduleData.series[id].start <= today
  // );

  const dateList = [];
  const startDate = scheduleData.start;
  let currentDate = new Date(startDate);

  while (currentDate <= today) {
    // Format as YYYY-MM-DD (optional)
    dateList.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 2);
  }

  // const rankColorScale = d3.scaleSequential(d3.interpolateSpectral);

  const rankColorScale = d3
    .scaleLinear()
    .domain([0.0, 0.333, 0.666, 1.0])
    .range(["darkgreen", "white", "white", "darkred"]);

  const heatIndex = (date: Date) => {
    const dateIndex = dateToRecordsKey(date);
    const records = scheduleData.records[dateIndex][teamId];

    return records[3];
  };

  return (
    <svg width={CHART_WIDTH} height={FOOTER_HEIGHT}>
      {/* {playedSchedule.map((id: SeriesId) => (
        <text
          key={id}
          x={xScale(scheduleData.series[id].start) - 20}
          y={15}
          fontSize={heatIndexSize(heatIndex(scheduleData.series[id].start))}
        >
          {heatIndexIcon(heatIndex(scheduleData.series[id].start))}
        </text>
      ))} */}
      {dateList.map((date: Date) => (
        // <text x={xScale(date)} y={15} fontSize={heatIndexSize(heatIndex(date))}>
        //   {heatIndexIcon(heatIndex(date))}
        // </text>
        <rect
          x={xScale(date)}
          y={0}
          width={10}
          height={10}
          fill={rankColorScale(1 - (heatIndex(date) + 1) / 2)}
        ></rect>
      ))}

      <g ref={xAxisRef} className="axis" transform="translate(0, 10)"></g>
    </svg>
  );
}
