import { TODAY, WIN_INTERVAL_HEIGHT } from "./constants";
import { ScheduleData, Series, SeriesId, TeamId } from "./interfaces";
import { SVGS } from "./svgs";

export const dateToRecordsKey = (date: Date) => date.toISOString().slice(0, 10);

export const teamLogoFromId = (id: TeamId): string => SVGS[`LOGO_${id}`];

export const opponentId = (team: TeamId, series: Series): TeamId =>
  series.home === team ? series.away : series.home;

export const lastDayPlayed = (seasonEnd: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let end = new Date();
  end.setTime(seasonEnd.getTime());

  return today > end ? end : today;
};

export const daysBetween = (date1: Date, date2: Date) => {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};

export const earlierDate = (date1: Date, date2: Date) =>
  date1 < date2 ? date1 : date2;

export const seriesOutcome = (team: TeamId, series: Series) => {
  let outcome: [number, number] = [0, 0];

  for (let i = 0; i < series.scores.length; i += 2) {
    if (series.scores[i] > series.scores[i + 1]) {
      outcome[0]++;
    } else {
      outcome[1]++;
    }
  }

  if (series.home != team) {
    outcome.reverse();
  }

  return outcome;
};

export const seriesOutcomeColor = (team: TeamId, series: Series) => {
  const outcome = seriesOutcome(team, series);

  if (outcome[1] === 0) {
    return "oklch(0.532 0.157 131.589)";
  } else if (outcome[0] > outcome[1]) {
    return "oklch(0.768 0.233 130.85)";
  } else if (outcome[0] === outcome[1]) {
    return "oklch(0.6 0 0)";
  } else if (outcome[0] === 0) {
    return "oklch(0.505 0.213 27.518)";
  } else {
    return "oklch(0.704 0.191 22.216)";
  }
};

export const heatIndexIcon = (heatIndex: number) => {
  if (heatIndex >= 0.5) {
    return "🔥";
  } else if (heatIndex <= -0.5) {
    return "❄️";
  }

  return "";
};

export const heatIndexSize = (heatIndex: number) => {
  heatIndex = Math.abs(heatIndex);
  if (heatIndex >= 0.8 || heatIndex <= 0.2) {
    return "18px";
  } else if (heatIndex >= 0.8 || heatIndex <= 0.6) {
    return "10px";
  }

  return "10px";
};

export const ordinalSuffixFormat = (n: number) => {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

//
// ScheduleData operations
//
export const playedSchedule = (
  scheduleData: ScheduleData,
  teamId: TeamId,
  start: Date,
  end: Date
) =>
  scheduleData.schedules[teamId].filter(
    (id: SeriesId) =>
      scheduleData.series[id].start < TODAY &&
      scheduleData.series[id].start > start &&
      scheduleData.series[id].end < end
  );

export const recordBeforeSeries = (
  scheduleData: ScheduleData,
  seriesId: SeriesId,
  teamId: TeamId
) => {
  const series = scheduleData.series[seriesId];

  const dayBeforeSeries = new Date(series.start);
  dayBeforeSeries.setDate(series.start.getDate() - 1);

  const dateKey = dateToRecordsKey(dayBeforeSeries);

  if (!scheduleData.records[dateKey]) {
    return [0, 0, 0, 0];
  }

  return scheduleData.records[dateKey][
    teamId === series.home ? series.home : series.away
  ];
};

export const seriesOutcomeY = (
  scheduleData: ScheduleData,
  teamId: TeamId,
  id: SeriesId
) => {
  const outcome = seriesOutcome(teamId, scheduleData.series[id]);
  const recordChange = outcome[1] - outcome[0];

  const record = recordBeforeSeries(scheduleData, id, teamId);
  let initialY = (record[0] - record[1]) * -WIN_INTERVAL_HEIGHT;

  return initialY + (recordChange < 0 ? recordChange * WIN_INTERVAL_HEIGHT : 0);
};

export const seriesBounds = (
  scheduleData: ScheduleData,
  teamId: TeamId,
  seriesIds: SeriesId[]
) => {
  if (seriesIds.length === 0) {
    return [0, 0, 0];
  }

  const initial = seriesOutcomeY(scheduleData, teamId, seriesIds[0]);
  let bounds = [initial, initial, initial];

  for (let seriesId of seriesIds) {
    bounds[0] = Math.min(
      bounds[0],
      seriesOutcomeY(scheduleData, teamId, seriesId)
    );
    bounds[1] = Math.min(
      bounds[0],
      seriesOutcomeY(scheduleData, teamId, seriesId)
    );
  }

  return bounds;
};
