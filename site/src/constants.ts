import * as d3 from "d3";
import teamsJson from "../../data/teams.json";
import { Division, League, Team } from "./interfaces";

export const ASSETS_BASE_PATH = "https://d48vmuz4fbfgs.cloudfront.net";

export const CHART_WIDTH = 900;
export const RANKINGS_HEIGHT = 150;
export const RANKINGS_PADDING = 10;
export const LOGOS_HEIGHT = 25;
export const FOOTER_HEIGHT = 30;

export const WIN_INTERVAL_HEIGHT = 6.5;
export const Y_AXIS_WIDTH = 30;

export const SQUARE_SIZE = 400;
export const SQUARE_PADDING = 10;

export const WC3_COLOR = "#d8d8d8";
export const DIVISION_LEADER_COLOR = "#e0e090";

export const SERIES_HIGHLIGHT_PATTERN_DEF = "series-highlight";
export const GRAYSCAPE_FILTER_DEF = "grayscale-filter";

export const SEASONS = ["2025", "2024", "2023", "2022"];
export const ALL_STAR_GAMES: Record<string, Date> = {
  2025: new Date("2025-07-15"),
  2024: new Date("2024-07-16"),
  2023: new Date("2023-07-11"),
  2022: new Date("2022-07-19"),
};

export const CURRENT_SEASON = SEASONS[0];

export const SITE_TITLE = "162.games";

const today = new Date();
today.setHours(0, 0, 0, 0);
export const TODAY = today;

const yesterday = new Date();
yesterday.setHours(0, 0, 0, 0);
yesterday.setDate(yesterday.getDate() - 1);
export const YESTERDAY = yesterday;

export const GOOD_BAD_COLOR_SCALE = d3
  .scaleLinear()
  .domain([0.0, 0.333, 0.666, 1.0])
  // @ts-ignore
  .range(["#09b52e", "white", "white", "#b50909"]);

export const PLAYOFF_INDEX: Record<League | Division, number> = {
  AL: 0,
  NL: 1,
  "AL East": 2,
  "AL Central": 3,
  "AL West": 4,
  "NL East": 5,
  "NL Central": 6,
  "NL West": 7,
};

export const TEAMS = Object.fromEntries(
  teamsJson.map((team) => [team.id, team as Team])
);
