// Core JSON data preprocessing (Global, one-time)

import { QueryFunction } from "@tanstack/react-query";
import { ScheduleData, Series } from "./interfaces";
import { ASSETS_BASE_PATH } from "./constants";

const parseScheduleData = (json: any): ScheduleData => {
  json.start = new Date(json.start);
  json.end = new Date(json.end);

  for (let value of Object.values(json.series as Series)) {
    value.start = new Date(value.start);

    const end = new Date(value.end);

    end.setDate(end.getDate() + 1);
    value.end = end;
  }

  return json as ScheduleData;
};

export const fetchScheduleData: QueryFunction<ScheduleData> = async ({
  queryKey,
}) => {
  const year = queryKey[1];

  try {
    const scheduleResponse = await fetch(
      `${ASSETS_BASE_PATH}/data_${year}.json`
    );
    const scheduleJson = await scheduleResponse.json();

    return parseScheduleData(scheduleJson);
  } catch {
    throw "Problem fetching schedule data.";
  }
};
