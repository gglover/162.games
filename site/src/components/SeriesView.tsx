import clsx from "clsx";
import { useScheduleDataContext } from "../contexts";
import { SeriesId } from "../interfaces";
import { dateToRecordsKey, daysBetween, teamLogoFromId } from "../utils";

export interface SeriesViewProps {
  seriesId: SeriesId;
}

export function SeriesView({ seriesId }: SeriesViewProps) {
  const scheduleData = useScheduleDataContext();
  const series = scheduleData.series[seriesId];
  const length = daysBetween(series.start, series.end);

  const dayBeforeSeries = new Date(series.start);
  dayBeforeSeries.setDate(series.start.getDate() - 1);

  const dateKey = dateToRecordsKey(dayBeforeSeries);
  const homeRecord = scheduleData.records[dateKey][series.home];
  const awayRecord = scheduleData.records[dateKey][series.away];

  const results = [];

  // Link to day's games https://www.mlb.com/scores/2025-05-04 ex.

  for (let i = 0; i < length; i++) {
    const homeWon = series.scores[i * 2] > series.scores[i * 2 + 1];

    results.push(
      <div className="flex justify-between items-center text-gray-600">
        <span
          className={clsx("w-8 text-sm text-center", { "font-bold": homeWon })}
        >
          {series.scores[i * 2] ?? "-"}
        </span>
        <span className="text-[10px]">
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <span
          className={clsx("w-8 text-sm text-center", { "font-bold": !homeWon })}
        >
          {series.scores[i * 2 + 1] ?? "-"}
        </span>
      </div>
    );
  }

  return (
    <div className="shadow-md rounded-sm p-3 flex flex-col h-[175px] bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <div className="text-center">
          <div className="bg-gray-300 rounded-full p-2 w-8 m-auto">
            <img className="w-4 h-4" src={teamLogoFromId(series.home)} />
          </div>
          <span className="text-[9px] text-gray-600">
            {homeRecord[0]} - {homeRecord[1]}
          </span>
        </div>

        <div className="text-xs text-gray-600">vs</div>

        <div className="text-center">
          <div className="bg-gray-300 rounded-full p-2 w-8">
            <img className="w-4 h-4" src={teamLogoFromId(series.away)} />
          </div>
          <span className="text-[9px] text-gray-600">
            {awayRecord[0]} - {awayRecord[1]}
          </span>
        </div>
      </div>
      {results}
    </div>
  );
}
