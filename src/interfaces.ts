export type SeriesId = string;
export type TeamId = string;
export type SeasonId = string;

export interface Team {
  name: string;
  code: string;
  schedule: SeriesId[];
  record: [number, number];
}

export interface Series {
  home: TeamId;
  away: TeamId;
  start: Date;
  end: Date;
  scores: number[];
}

export interface ScheduleData {
  teams: Record<TeamId, Team>;
  series: Record<SeriesId, Series>;
  records: Record<string, HistoricalRecord>;
  start: Date;
  end: Date;
}

export type DayWithGames = keyof ScheduleData["records"];

export enum SeriesLocation {
  Home = "Home",
  Away = "Away",
}

export interface TravelScheduleBlock {
  location: SeriesLocation;
  start: Date;
  end: Date;
  series: SeriesId[];
  outcome: [number, number];
}

// # {
//   #   [date]: {
//   #       [teamId]: [wins, losses, ranking, heat]
//   #   }
//   # }

export interface HistoricalRecord {
  [teamId: TeamId]: [number, number, number, number];
}
