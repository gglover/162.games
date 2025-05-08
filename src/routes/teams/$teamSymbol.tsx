import { createFileRoute } from "@tanstack/react-router";
import { TeamSidebar } from "../../components/schedule/TeamSidebar";
import { GraphContainer } from "../../components/schedule/GraphContainer";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchScheduleData } from "../../schedule";
import { ScheduleDataContext } from "../../contexts";
import { SeasonSelect } from "../../components/SeasonSelect";
import { TEAMS } from "../../constants";
import { SeriesId } from "../../interfaces";

export const Route = createFileRoute("/teams/$teamSymbol")({
  component: TeamsComponent,
});

function TeamsComponent() {
  const [season, setSeason] = useState("2025");
  const [selectedSeriesId, setSelectedSeriesId] = useState("");

  const { teamSymbol } = Route.useParams();

  const teamId = Object.keys(TEAMS).find(
    (teamId) => TEAMS[teamId].symbol === teamSymbol
  );

  const handleSelectedSeriesIdChange = (id: SeriesId) => {
    setSelectedSeriesId(id);
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeriesId("");
    setSeason(season);
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
    return <div>Error</div>;
  }

  return (
    <div className="flex gap-4 justify-center mt-10">
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
