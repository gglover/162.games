import { ChangeEventHandler } from "react";
import { SEASONS } from "../constants";

export interface SeasonSelectProps {
  season: string;
  onChange: (season: string) => void;
}

export function SeasonSelect({ season, onChange }: SeasonSelectProps) {
  const handleSeasonChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <select
      onChange={handleSeasonChange}
      value={season}
      className="bg-transparent placeholder:text-gray-400 text-gray-700 text-xs border border-gray-200 rounded pl-2 pr-5 py-1 transition duration-300 ease focus:outline-none focus:border-gray-400 hover:border-gray-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
    >
      {SEASONS.map((seasonOption) => (
        <option value={seasonOption} key={seasonOption}>
          {seasonOption} Season
        </option>
      ))}
    </select>
  );
}
