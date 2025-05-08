import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fetchScheduleData } from "../schedule";
import { useState } from "react";
import { SeasonSelect } from "../components/SeasonSelect";
import { SeasonDateSlider } from "../components/SeasonDateSlider";
import { Square } from "../components/Square";
import { ScheduleDataContext } from "../contexts";

export const Route = createFileRoute("/")({
  component: HomePageComponent,
});

function HomePageComponent() {
  const [season, setSeason] = useState("2025");
  const [date, setDate] = useState(new Date());

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
    <div className="flex justify-center flex-col mt-8 w-lg mx-auto gap-4">
      <ScheduleDataContext.Provider value={scheduleData}>
        <Square date={date} />
        <SeasonDateSlider date={date} onChange={setDate} />
        <SeasonSelect season={season} onChange={setSeason} />
      </ScheduleDataContext.Provider>
    </div>
  );
}
