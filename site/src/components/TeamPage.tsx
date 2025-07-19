import { useState } from "react";
import { SeriesId, TeamId } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { fetchScheduleData } from "../schedule";
import { ScheduleDataContext } from "../contexts";
import { TeamSidebar } from "./schedule/TeamSidebar";
import { GraphContainer } from "./schedule/GraphContainer";
import { useNavigate } from "@tanstack/react-router";
import { TEAMS } from "../constants";

export interface TeamPageProps {
  season: string;
  teamId: TeamId;
}

export function TeamPage({ season, teamId }: TeamPageProps) {
  const navigate = useNavigate();

  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);

  const handleSelectedSeriesIdChange = (id: SeriesId | null) => {
    setSelectedSeriesId(id);
  };

  const handleSeasonChange = (season: string) => {
    navigate({
      to: "/teams/$teamSymbol/$season",
      params: { season, teamSymbol: TEAMS[teamId].symbol },
    });
  };

  const {
    error,
    isLoading,
    data: scheduleData,
  } = useQuery({
    queryKey: ["schedule", season],
    queryFn: fetchScheduleData,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !scheduleData || !teamId) {
    console.log(error);
    return <div>error.</div>;
  }

  return (
    <div className="flex gap-4 justify-center mt-15 max-w-1/1 mx-2 pb-8">
      <ScheduleDataContext.Provider value={scheduleData}>
        <TeamSidebar
          teamId={teamId}
          selectedSeriesId={selectedSeriesId}
          onSeasonChange={handleSeasonChange}
          season={season}
        />
        <GraphContainer
          teamId={teamId}
          selectedSeriesId={selectedSeriesId}
          onSelectedSeriesIdChange={handleSelectedSeriesIdChange}
        />
      </ScheduleDataContext.Provider>
    </div>
  );
}
