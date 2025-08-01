export type SeriesId = string;
export type TeamId = string;
export type SeasonId = string;

export interface Team {
  id: TeamId;
  name: string;
  symbol: string;
  league: League;
  division: Division;
}

export interface Series {
  home: TeamId;
  away: TeamId;
  start: Date;
  end: Date;
  scores: number[];
}

export interface Stats {
  sos: number;
  sosRank: number;
  rsos: number;
  rsosRank: number;
  delta: number;
  deltaRank: number;
}

export interface ScheduleData {
  schedules: Record<TeamId, SeriesId[]>;
  series: Record<SeriesId, Series>;
  records: Record<string, HistoricalRecord>;
  playoffs: Record<
    string,
    [TeamId, TeamId, TeamId, TeamId, TeamId, TeamId, TeamId, TeamId]
  >;
  stats: Record<TeamId, Stats>;
  start: Date;
  end: Date;
}

// # {
//   #   [date]: {
//   #       [teamId]: [wins, losses, ranking, heat]
//   #   }
//   # }

export interface HistoricalRecord {
  [teamId: TeamId]: [number, number, number, number];
}

export type League = "AL" | "NL";
export type Division =
  | "AL West"
  | "NL West"
  | "AL Central"
  | "NL Central"
  | "AL East"
  | "NL East";
