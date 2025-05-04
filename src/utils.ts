import { HistoricalRecord, Series, TeamId } from "./interfaces";
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
  if (heatIndex >= 0.8) {
    return "🔥";
  } else if (heatIndex <= 0.2) {
    return "❄️";
  }

  return "";
};

export const heatIndexSize = (heatIndex: number) => {
  if (heatIndex === 10 || heatIndex === 0) {
    return "20px";
  } else if (heatIndex === 9 || heatIndex === 1) {
    return "16px";
  } else if (heatIndex === 8 || heatIndex === 2) {
    return "12px";
  }

  return "7px";
};
