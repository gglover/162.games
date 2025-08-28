import { useRef, useState } from "react";
import { SeriesId, TeamId } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { fetchScheduleData } from "../schedule";
import { ScheduleDataContext } from "../contexts";
import { TeamSidebar } from "./schedule/TeamSidebar";
import { GraphContainer } from "./schedule/GraphContainer";
import { useNavigate } from "@tanstack/react-router";
import { TEAMS } from "../constants";
import { useClickOutside } from "../hooks";

export interface TeamPageProps {
  season: string;
  teamId: TeamId;
}

export function TeamPage({ season, teamId }: TeamPageProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [highlightedSeriesId, setHighlightedSeriesId] = useState<string | null>(
    null
  );

  useClickOutside(contentRef, () => {
    setSelectedSeriesId(null);
  });

  const handleHighlightedSeriesIdChange = (id: SeriesId | null) => {
    // Disable hover highlights on mobile
    if (screen.width > 765) {
      setHighlightedSeriesId(id);
    }
  };

  const handleSelectedSeriesIdChange = (id: SeriesId | null) => {
    setSelectedSeriesId(id);
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeriesId(null);
    setHighlightedSeriesId(null);
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
    return <></>;
  }

  if (error || !scheduleData || !teamId) {
    console.log(error);
    return <div>Error loading season data.</div>;
  }

  return (
    <div
      ref={contentRef}
      className="flex md:gap-4 md:justify-center mt-4 md:mt-10 max-w-1/1 mx-2 pb-8 flex-col md:flex-row"
    >
      <ScheduleDataContext.Provider value={scheduleData}>
        <TeamSidebar
          teamId={teamId}
          selectedSeriesId={selectedSeriesId || highlightedSeriesId}
          onSeasonChange={handleSeasonChange}
          season={season}
        />
        <GraphContainer
          teamId={teamId}
          highlightedSeriesId={highlightedSeriesId}
          onHighlightedSeriesIdChange={handleHighlightedSeriesIdChange}
          selectedSeriesId={selectedSeriesId}
          onSelectedSeriesIdChange={handleSelectedSeriesIdChange}
        />
      </ScheduleDataContext.Provider>
    </div>
  );
}
