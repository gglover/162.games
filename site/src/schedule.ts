// Core JSON data preprocessing (Global, one-time)

import { QueryFunction } from "@tanstack/react-query";
import { ScheduleData, Series } from "./interfaces";
import { dateToRecordsKey } from "./utils";

const parseScheduleData = (json: any): ScheduleData => {
  json.start = new Date(json.start);
  json.end = new Date(json.end);

  for (let value of Object.values(json.series as Series)) {
    value.start = new Date(value.start);

    const end = new Date(value.end);

    end.setDate(end.getDate() + 1);
    value.end = end;
  }

  // Temp: model heat as L10 Record

  for (let teamId in json.schedules) {
    for (let dateKey in json.records) {
      const record = json.records[dateKey][teamId];

      const date = new Date(dateKey);
      date.setDate(date.getDate() - 20);
      const compareKey = dateToRecordsKey(date);

      const compareRecord = json.records[compareKey]
        ? json.records[compareKey][teamId]
        : [0, 0];

      const last10 = [
        record[0] - compareRecord[0],
        record[1] - compareRecord[1],
      ];

      record[3] = last10[0] / (last10[1] + last10[0]);
    }
  }

  return json as ScheduleData;
};

export const fetchScheduleData: QueryFunction<ScheduleData> = async ({
  queryKey,
}) => {
  const year = queryKey[1];

  try {
    const scheduleResponse = await fetch(`/data_${year}.json`);
    const scheduleJson = await scheduleResponse.json();

    return parseScheduleData(scheduleJson);
  } catch {
    throw "Problem fetching schedule data.";
  }
};
