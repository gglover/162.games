import { createFileRoute } from "@tanstack/react-router";
import { TeamSidebar } from "../../components/schedule/TeamSidebar";
import { GraphContainer } from "../../components/schedule/GraphContainer";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchScheduleData } from "../../schedule";
import { ScheduleDataContext } from "../../contexts";
import { SeasonSelect } from "../../components/SeasonSelect";
import { TEAMS } from "../../chart/constants";

export const Route = createFileRoute("/teams/$teamSymbol")({
  component: TeamsComponent,
});

function TeamsComponent() {
  const [season, setSeason] = useState("2025");
  const { teamSymbol } = Route.useParams();

  const teamId = Object.keys(TEAMS).find(
    (teamId) => TEAMS[teamId].symbol === teamSymbol
  );

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

  if (error || !scheduleData) {
    return <div>Error</div>;
  }

  return (
    <main>
      <div className="flex gap-4 justify-center">
        <ScheduleDataContext.Provider value={scheduleData}>
          <TeamSidebar teamId={teamId} />
          <GraphContainer teamId={teamId} />
        </ScheduleDataContext.Provider>
      </div>
      <SeasonSelect season={season} onChange={setSeason} />
    </main>
  );
}
