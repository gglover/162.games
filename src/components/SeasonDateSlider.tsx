import { daysBetween, lastDayPlayed } from "../utils";

export interface SeasonDateSliderProps {
  start: Date;
  end: Date;
}

export function SeasonDateSlider({ start, end }: SeasonDateSliderProps) {
  const lastPlayed = lastDayPlayed(end);
  const range = daysBetween(start, lastPlayed);

  return (
    <div>
      <input type="range" min="1" max={range} value="1" />
      <div></div>
    </div>
  );
}
