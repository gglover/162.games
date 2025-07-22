import { createFileRoute, redirect } from "@tanstack/react-router";
import { CURRENT_SEASON, SEASONS, SITE_TITLE } from "../../../constants";
import { TeamPage } from "../../../components/TeamPage";
import { teamIdFromTeamSymbol } from "../../../utils";

export const Route = createFileRoute("/teams/$teamSymbol/$season")({
  component: TeamsRouteComponent,
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.teamSymbol.toUpperCase()} • ${params.season} • ${SITE_TITLE}`,
      },
    ],
  }),
  loader: ({ params }) => {
    const { teamSymbol, season } = params;
    if (season === CURRENT_SEASON) {
      throw redirect({
        to: "/teams/$teamSymbol",
        params: { teamSymbol },
      });
    }

    if (!teamIdFromTeamSymbol(teamSymbol) || !SEASONS.includes(season)) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function TeamsRouteComponent() {
  const { teamSymbol, season } = Route.useParams();

  return (
    <TeamPage teamId={teamIdFromTeamSymbol(teamSymbol)!} season={season} />
  );
}
