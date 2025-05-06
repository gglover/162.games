export type SeriesId = string;
export type TeamId = string;
export type SeasonId = string;

export interface Team {
  id: TeamId;
  name: string;
  symbol: string;
  league: string;
  division: string;
}

export interface Series {
  home: TeamId;
  away: TeamId;
  start: Date;
  end: Date;
  scores: number[];
}

export interface ScheduleData {
  schedules: Record<TeamId, SeriesId[]>;
  series: Record<SeriesId, Series>;
  records: Record<string, HistoricalRecord>;
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
