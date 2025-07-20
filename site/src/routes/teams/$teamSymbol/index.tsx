import { createFileRoute, redirect } from "@tanstack/react-router";
import { TeamPage } from "../../../components/TeamPage";
import { teamIdFromTeamSymbol } from "../../../utils";
import { CURRENT_SEASON } from "../../../constants";

export const Route = createFileRoute("/teams/$teamSymbol/")({
  component: TeamsRouteComponent,
  loader: ({ params }) => {
    const { teamSymbol } = params;
    if (!teamIdFromTeamSymbol(teamSymbol)) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function TeamsRouteComponent() {
  const { teamSymbol } = Route.useParams();

  return (
    <TeamPage
      key={teamSymbol}
      teamId={teamIdFromTeamSymbol(teamSymbol)!}
      season={CURRENT_SEASON}
    />
  );
}
