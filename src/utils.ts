import { Series, TeamId } from "./interfaces";
import { SVGS } from "./svgs";

export const dateToRecordsKey = (date: Date) => date.toISOString().slice(0, 10);

export const teamLogoFromId = (id: TeamId): string => SVGS[`LOGO_${id}`];

export const opponentId = (team: TeamId, series: Series): TeamId =>
  series.home === team ? series.away : series.home;

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
