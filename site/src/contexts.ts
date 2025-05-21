// Contexts.js
import { createContext, useContext } from "react";
import { ScheduleData } from "./interfaces";

export const ScheduleDataContext = createContext<ScheduleData | undefined>(
  undefined
);

export const useScheduleDataContext = () => {
  const data = useContext(ScheduleDataContext);

  if (!data) {
    throw new Error("No scheduleData present.");
  }

  return data;
};
