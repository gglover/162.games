// Core JSON data preprocessing (Global, one-time)

import { ScheduleData, Series } from "./interfaces";

const parseScheduleData = (json: any): ScheduleData => {
  json.start = new Date(json.start);
  json.end = new Date(json.end);

  for (let value of Object.values(json.series as Series)) {
    value.start = new Date(value.start);

    const end = new Date(value.end);
    end.setDate(end.getDate() + 1);
    value.end = end;
  }

  json.daysWithGamesPlayed = Object.keys(json.records)
    .map((isoDateKey) => new Date(isoDateKey))
    .sort((a, b) => a.getTime() - b.getTime());

  return json as ScheduleData;
};

export const fetchScheduleData = async (year: string) => {
  try {
    const scheduleResponse = await fetch(`/data_${year}.json`);
    const scheduleJson = await scheduleResponse.json();

    return parseScheduleData(scheduleJson);
  } catch {
    throw "Problem fetching schedule data.";
  }
};
