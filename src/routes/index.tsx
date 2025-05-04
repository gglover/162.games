import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fetchScheduleData } from "../schedule";
import { useState } from "react";
import { SeasonSelect } from "../components/SeasonSelect";
import { SeasonDateSlider } from "../components/SeasonDateSlider";
import { Square } from "../components/Square";

export const Route = createFileRoute("/")({
  component: HomePageComponent,
});

function HomePageComponent() {
  const [season, setSeason] = useState("2025");

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
    <main className="flex justify-center flex-col mt-8 w-lg mx-auto gap-4">
      <Square />
      <SeasonDateSlider start={scheduleData.start} end={scheduleData.end} />
      <SeasonSelect onChange={setSeason} season={season} />
    </main>
  );
}
