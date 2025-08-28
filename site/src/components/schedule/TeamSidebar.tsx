import { CURRENT_SEASON, TEAMS, TODAY, YESTERDAY } from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import {
  dateToRecordsKey,
  heatIndexIcon,
  heatIndexSize,
  lastDayPlayed,
  ordinalSuffixFormat,
  teamLogoFromId,
  truncate3Digits,
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

  const heatIndex =
    scheduleData.records[dateToRecordsKey(YESTERDAY)]?.[teamId][3];

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
    <div className="flex px-5 min-w-[160px] border-b-gray-300 border-b-1 md:border-0 md:px-0 gap-10 items-center md:flex-col md:gap-2 team-overview md:w-38 md:mt-12">
      <div className="md:h-[150px] flex mb-2">
        <div className="w-30 h-30 mx-auto bg-gray-200 p-6 rounded-3xl relative shadow-md border-1 border-gray-300">
          <img
            className="object-contain w-1/1 h-1/1"
            src={teamLogoFromId(teamId)}
          />
          {heatIndexIcon(heatIndex) && (
            <div className="absolute pt-[2px] rounded-full bg-white w-8 h-8 border-1 border-gray-300 shadow-md text-center -bottom-2 -right-2">
              <span style={{ fontSize: `${heatIndexSize(heatIndex)}px` }}>
                {heatIndexIcon(heatIndex)}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-grow w-1/1 flex flex-col gap-1 md:gap-2">
        <h1 className="text-lg text-gray-800 team-name">{team.name}</h1>
        <p className="text-black text-xs team-record">
          {records[0]} – {records[1]}
        </p>
        <hr className="text-gray-300" />
        <p className="text-black text-xs team-mlb-ranking flex gap-1 items-center  justify-between">
          {team.division}
          <span className="font-bold ">{divisionRanking}</span>
        </p>
        <p className="text-black text-xs team-mlb-ranking flex gap-1 items-center justify-between">
          MLB
          <span className="font-bold">{mlbRanking}</span>
        </p>
        <hr className="text-gray-300" />
        {season === CURRENT_SEASON && (
          <StatEntry
            name="Remaining SoS"
            value={scheduleData.stats[teamId].rsos}
            ranking={scheduleData.stats[teamId].rsosRank}
          />
        )}

        <StatEntry
          name="Played SoS"
          value={scheduleData.stats[teamId].sos}
          ranking={scheduleData.stats[teamId].sosRank}
        />

        <StatEntry
          name="Opponent WP ∆"
          value={scheduleData.stats[teamId].delta}
          ranking={scheduleData.stats[teamId].deltaRank}
          annotation="Difference between opponents’ combined winning percentage using latest records and records at time of the matchup. A larger value means opponents generally improved after playing this team, suggesting that this team has faced opponents at advantageous times."
        />

        <div className="flex-grow"></div>

        {selectedSeriesId && <SeriesView seriesId={selectedSeriesId} />}

        <div className="content-end mb-3">
          <SeasonSelect onChange={onSeasonChange} season={season} />
        </div>
      </div>
    </div>
  );
}

interface StatEntryProps {
  name: string;
  value: number;
  ranking: number;
  annotation?: string;
}

function StatEntry({ name, value, ranking, annotation }: StatEntryProps) {
  const statFormatted = truncate3Digits(value);
  const rankingFormatted = ordinalSuffixFormat(ranking);

  return (
    <p className="text-black relative text-[10px] team-mlb-ranking flex gap-3 items-center justify-between">
      <span
        className={`flex-grow group ${annotation && "underline decoration-dashed underline-offset-2 cursor-help"}`}
      >
        {annotation && (
          <span className="absolute z-10 w-60 left-0 mt-2 p-2 top-1 bg-white shadow-lg hidden group-hover:block">
            {annotation}
          </span>
        )}
        {name}
      </span>
      <span>{statFormatted}</span>
      <span className="font-bold w-6 text-right">{rankingFormatted}</span>
    </p>
  );
}
