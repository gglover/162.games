import * as d3 from "d3";
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  RANKINGS_HEIGHT,
  RANKINGS_PADDING,
  WIN_INTERVAL_HEIGHT,
  Y_AXIS_WIDTH,
} from "../../chart/constants";
import { useScheduleDataContext } from "../../contexts";
import { Axis, AxisOrientation } from "../Axis";
import { TitleBadge } from "../TitleBadge";
import { Rankings } from "./Rankings";
import { TeamId } from "../../interfaces";
import { OpponentLogos } from "./OpponentLogos";

export interface GraphContainerProps {
  teamId: TeamId;
}

export function GraphContainer({ teamId }: GraphContainerProps) {
  const scheduleData = useScheduleDataContext();

  const xScale = d3
    .scaleTime()
    .domain([scheduleData.start, scheduleData.end])
    .range([0, CHART_WIDTH]);

  const scheduleYScale = d3
    .scaleLinear()
    .domain([
      CHART_HEIGHT / WIN_INTERVAL_HEIGHT / 2,
      CHART_HEIGHT / WIN_INTERVAL_HEIGHT / -2,
    ])
    .range([0, CHART_HEIGHT]);

  const rankingsYScale = d3
    .scaleLinear()
    .domain([1, 30])
    .range([0, RANKINGS_HEIGHT - RANKINGS_PADDING]);

  return (
    <div className={`grid grid-cols-[${Y_AXIS_WIDTH}px_${CHART_WIDTH}px]`}>
      <div></div>
      <div className="flex">
        <TitleBadge>MLB Ranking</TitleBadge>
      </div>

      <svg width={Y_AXIS_WIDTH} height={RANKINGS_HEIGHT}>
        <Axis
          x={15}
          y={RANKINGS_PADDING / 2}
          orientation={AxisOrientation.Vertical}
          scale={rankingsYScale}
        />
      </svg>
      <div className="rankings border-y-1 border-gray-500">
        <Rankings teamId={teamId} xScale={xScale} yScale={rankingsYScale} />
      </div>

      <div></div>
      <OpponentLogos teamId={teamId} xScale={xScale} />

      <svg width={Y_AXIS_WIDTH} height={CHART_HEIGHT}>
        <Axis
          x={5}
          y={0}
          orientation={AxisOrientation.Vertical}
          scale={scheduleYScale}
        />
      </svg>
      <div className="border border-x-0 border-gray-500 relative">
        <div className="absolute top-0 left-0">
          <TitleBadge>Net Record</TitleBadge>
        </div>
        <div className="schedule"></div>
      </div>

      <div>
        <img className="team-logo object-contain w-5 h-5" />
      </div>
      <div className="footer"></div>
    </div>
  );
}
