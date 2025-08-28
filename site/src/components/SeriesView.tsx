import clsx from "clsx";
import { useScheduleDataContext } from "../contexts";
import { Series, SeriesId } from "../interfaces";
import {
  bballRefLinkFromDate,
  dateToRecordsKey,
  daysBetween,
  teamLogoFromId,
} from "../utils";

export interface SeriesViewProps {
  seriesId: SeriesId;
}

export function SeriesView({ seriesId }: SeriesViewProps) {
  const scheduleData = useScheduleDataContext();
  const series = scheduleData.series[seriesId];

  const dayBeforeSeries = new Date(series.start);
  dayBeforeSeries.setDate(series.start.getDate() - 1);

  const dateKey = dateToRecordsKey(dayBeforeSeries);
  const homeRecord = scheduleData.records[dateKey]?.[series.home] ?? [0, 0];
  const awayRecord = scheduleData.records[dateKey]?.[series.away] ?? [0, 0];

  const results = [];

  const gamesToShow = Math.max(
    daysBetween(series.start, series.end),
    series.scores.length / 2
  );

  for (let i = 0; i < gamesToShow; i++) {
    const homeWon = series.scores[i * 2] > series.scores[i * 2 + 1];
    const gameDate = new Date(series.start);

    const isUnplayedGame = i * 2 >= series.scores.length;

    gameDate.setDate(series.start.getDate() + i);

    results.push(
      <div
        key={gameDate.toISOString()}
        className="flex justify-between items-center text-gray-600"
      >
        <span
          className={clsx("w-8 text-sm text-center", { "font-bold": !homeWon })}
        >
          {series.scores[i * 2 + 1] ?? "-"}
        </span>
        <GameLink
          series={series}
          gameDate={gameDate}
          isUnplayed={isUnplayedGame}
        />
        <span
          className={clsx("w-8 text-sm text-center", { "font-bold": homeWon })}
        >
          {series.scores[i * 2] ?? "-"}
        </span>
      </div>
    );
  }

  return (
    <div className="fixed left-5 top-5 shadow-2xl z-5 shadow-gray-500 rounded-sm p-3 flex flex-col h-[165px] bg-white sm:static sm:shadow-md sm:shadow-gray-300">
      <div className="flex justify-between items-center mb-1">
        <div className="text-center">
          <div className="bg-gray-300 rounded-lg p-2 w-8 m-auto">
            <img className="w-4 h-4" src={teamLogoFromId(series.away)} />
          </div>
          <span className="text-[9px] text-gray-600">
            {awayRecord[0]} - {awayRecord[1]}
          </span>
        </div>

        <div className="text-sm text-gray-600">@</div>

        <div className="text-center">
          <div className="bg-gray-300 rounded-lg p-2 w-8">
            <img className="w-4 h-4" src={teamLogoFromId(series.home)} />
          </div>
          <span className="text-[9px] text-gray-600">
            {homeRecord[0]} - {homeRecord[1]}
          </span>
        </div>
      </div>
      {results}
    </div>
  );
}

interface GameLinkProps {
  series: Series;
  gameDate: Date;
  isUnplayed: boolean;
}

function GameLink({ series, gameDate, isUnplayed }: GameLinkProps) {
  const dateText = gameDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  if (isUnplayed) {
    return (
      <span className="flex-grow text-center text-[10px]">{dateText}</span>
    );
  }

  return (
    <span className="pl-2 flex-grow text-center text-[10px]">
      <a
        href={bballRefLinkFromDate(series, gameDate)}
        target="_blank"
        className="border-b-1"
      >
        {dateText}
      </a>
      <svg
        className="inline"
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>external link</title>
        <path d="M7 7h10v10"></path>
        <path d="M7 17 17 7"></path>
      </svg>
    </span>
  );
}
