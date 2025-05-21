import { TEAMS } from "../constants";
import { useScheduleDataContext } from "../contexts";
import { dateToRecordsKey, lastDayPlayed } from "../utils";
import { HomeTable } from "./HomeTable";

export interface HotAndColdProps {
  date: Date;
}

export function HotAndCold({ date }: HotAndColdProps) {
  const scheduleData = useScheduleDataContext();

  const recordKey = dateToRecordsKey(date);

  const heatRankings = [...Object.keys(TEAMS)];

  heatRankings.sort(
    (teamA, teamB) =>
      scheduleData.records[recordKey][teamB][3] -
      scheduleData.records[recordKey][teamA][3]
  );

  return <HomeTable date={date} teamIds={heatRankings} />;
}
