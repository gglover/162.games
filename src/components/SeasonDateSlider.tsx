import { ChangeEventHandler } from "react";
import { useScheduleDataContext } from "../contexts";
import { daysBetween, lastDayPlayed } from "../utils";

export interface SeasonDateSliderProps {
  date: Date;
  onChange: (date: Date) => void;
}

export function SeasonDateSlider({ date, onChange }: SeasonDateSliderProps) {
  const { start, end } = useScheduleDataContext();

  const lastPlayed = lastDayPlayed(end);
  const range = daysBetween(start, lastPlayed);
  const value = daysBetween(start, date);

  const handleDateChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const days = parseInt(event.currentTarget.value);

    const nextDate = new Date(start.getTime());
    nextDate.setDate(nextDate.getDate() + days);

    onChange(nextDate);
  };

  return (
    <div>
      <input
        type="range"
        min="0"
        max={range}
        value={value}
        onChange={handleDateChange}
      />
      <div></div>
    </div>
  );
}
