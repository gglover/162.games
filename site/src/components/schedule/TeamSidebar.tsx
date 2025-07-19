import { TEAMS, TODAY } from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import {
  dateToRecordsKey,
  heatIndexIcon,
  heatIndexSize,
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

  const heatIndex = scheduleData.records[dateToRecordsKey(TODAY)]?.[teamId][3];

  const divisionTeams = [];
  for (let teamId in TEAMS) {
    TEAMS[teamId].division === team.division && divisionTeams.push(teamId);
  }
  divisionTeams.sort(
    (a, b) =>
      scheduleData.records[dateToRecordsKey(seasonEnd)][a][2] -
      scheduleData.records[dateToRecordsKey(seasonEnd)][b][2]
  );

  const divisionRanking = ordinalSuffixFormat(
    divisionTeams.indexOf(teamId) + 1
  );
  const mlbRanking = ordinalSuffixFormat(records[2]);

  return (
    <div className="flex flex-col gap-2 team-overview w-38 mt-12">
      <div className="h-[150px] flex items-center mb-5">
        <div className="w-30 h-30 mx-auto bg-gray-300 p-7 rounded-full relative shadow-sm border-1 border-gray-400">
          <img
            className="object-contain w-1/1 h-1/1"
            src={teamLogoFromId(teamId)}
          />
          {heatIndexIcon(heatIndex) && (
            <div className="absolute rounded-full border-b-gray-100 border border-gray-200 bg-white w-7 h-7 text-center bottom-0 right-0">
              <span style={{ fontSize: `${heatIndexSize(heatIndex)}px` }}>
                {heatIndexIcon(heatIndex)}
              </span>
            </div>
          )}
        </div>
      </div>
      <h1 className="text-lg text-gray-800 team-name">{team.name}</h1>
      <p className="text-black text-xs mb-6 team-record">
        {records[0]} – {records[1]}
      </p>
      <p className="text-black text-xs team-mlb-ranking flex gap-1 items-center  justify-between">
        {team.division}
        <span className="font-bold ">{divisionRanking}</span>
      </p>
      <p className="text-black text-xs team-mlb-ranking flex gap-1 items-center justify-between">
        MLB
        <span className="font-bold">{mlbRanking}</span>
      </p>

      <div className="flex-grow"></div>

      {selectedSeriesId && <SeriesView seriesId={selectedSeriesId} />}

      <div className="content-end my-3">
        <SeasonSelect onChange={onSeasonChange} season={season} />
      </div>
    </div>
  );
}
