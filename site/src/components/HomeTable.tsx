import { TeamId } from "../interfaces";
import { teamLogoFromId } from "../utils";

export interface HomeTableProps {
  teamIds: TeamId[];
  date: Date;
}

export function HomeTable({ teamIds, date }: HomeTableProps) {
  return (
    <div className="grid grid-cols-5">
      {teamIds.map((teamId: TeamId) => (
        <HomeTableEntry date={date} teamId={teamId} />
      ))}
    </div>
  );
}

const RESULTS_MAX_HEIGHT = 100;

function HomeTableEntry({ teamId, date }: { teamId: TeamId; date: Date }) {
  // const scheduleData = useScheduleDataContext();

  const startDate = new Date();
  startDate.setTime(date.getTime());
  startDate.setDate(date.getDate() - 20);

  // const xScale = d3.scaleTime().domain([startDate, date]).range([0, 100]);

  // const seriesIds = playedSchedule(scheduleData, teamId, startDate, date);

  return (
    <div>
      <img className="w-4 h-4" src={teamLogoFromId(teamId)} />
      <svg width={150} height={RESULTS_MAX_HEIGHT}>
        {/* <g
          transform={`translate(0, ${-seriesBounds(scheduleData, teamId, seriesIds)[2] + RESULTS_MAX_HEIGHT / 2})`}
        >
          <SeriesResults
            teamId={teamId}
            seriesIds={seriesIds}
            xScale={xScale}
            xScale={xScale}
          />
        </g> */}
      </svg>
    </div>
  );
}
