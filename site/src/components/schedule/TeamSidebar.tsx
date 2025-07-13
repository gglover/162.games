import { TEAMS } from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import {
  dateToRecordsKey,
  lastDayPlayed,
  ordinalSuffixFormat,
  teamLogoFromId,
} from "../../utils";
import { SeasonSelect } from "../SeasonSelect";
import { SeriesView } from "../SeriesView";

export interface TeamSidebarProps {
  teamId: TeamId;
  selectedSeriesId: SeriesId | null;
  season: string;
  onSeasonChange: (season: string) => void;
}

export function TeamSidebar({
  teamId,
  selectedSeriesId,
  season,
  onSeasonChange,
}: TeamSidebarProps) {
  const scheduleData = useScheduleDataContext();
  const seasonEnd = lastDayPlayed(scheduleData.end);
  const records = scheduleData.records[dateToRecordsKey(seasonEnd)][teamId];
  const team = TEAMS[teamId];

  return (
    <div className="flex flex-col gap-2 team-overview w-38 mt-12">
      <div className="h-[150px] flex items-center mb-5">
        <div className="w-30 h-30 mx-auto bg-gray-300 p-7 rounded-full relative">
          <img
            className="object-contain w-1/1 h-1/1"
            src={teamLogoFromId(teamId)}
          />
          <div className="absolute rounded-full border-b-gray-100 border border-gray-200 bg-white w-7 h-7 text-center bottom-0 right-0">
            🔥
          </div>
        </div>
      </div>
      <h1 className="text-lg text-gray-800 team-name">{team.name}</h1>
      <p className="text-black text-xs mb-6 team-record">
        {records[0]} – {records[1]}
      </p>
      <p className="text-black text-xs team-mlb-ranking flex gap-1 items-center  justify-between">
        {team.division}
        <span className="font-bold ">1st</span>
      </p>
      <p className="text-black text-xs team-mlb-ranking flex gap-1 items-center justify-between">
        MLB
        <span className="font-bold">{ordinalSuffixFormat(records[2])}</span>
      </p>

      {/* <p className="text-black text-xs mb-2">Strength of Schedule</p>
      <p className="text-black text-xs mb-2">Strength of Remaining Schedule</p> */}
      {selectedSeriesId && <SeriesView seriesId={selectedSeriesId} />}

      <div className="flex-grow content-end mb-7">
        <SeasonSelect onChange={onSeasonChange} season={season} />
      </div>
    </div>
  );
}
