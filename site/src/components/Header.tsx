import { Link, useParams } from "@tanstack/react-router";
import { CURRENT_SEASON, SITE_TITLE, TEAMS } from "../constants";

export function Header() {
  const teamLinks = Object.values(TEAMS).sort((a, b) =>
    a.symbol.localeCompare(b.symbol)
  );
  let { season } = useParams({ strict: false });
  season ??= CURRENT_SEASON;

  // Group teams by division
  const teamsByDivision = teamLinks.reduce(
    (acc, team) => {
      acc[team.division] ??= [];
      acc[team.division].push(team);
      return acc;
    },
    {} as Record<string, typeof teamLinks>
  );

  // Get division order (optional: you can define a specific order if needed)
  const divisionOrder = Object.keys(teamsByDivision).sort();

  return (
    <header>
      <div className="text-white bg-gray-800 border-gray-200 shadow-md">
        <div className="p-2 text-[12px]">
          <h1 className="text-center font-bold">{SITE_TITLE}</h1>
        </div>
      </div>

      <div className="text-black bg-gray-200 border-b-2 border-gray-300 shadow-md">
        <div className="p-3">
          <div className="flex gap-5 justify-center flex-wrap">
            {divisionOrder.map((division) => (
              <div
                key={division}
                className="flex gap-0.5 text-[10px] items-center flex-col md:flex-row"
              >
                {teamsByDivision[division].map((team) => (
                  <Link
                    key={team.id}
                    replace
                    to="/teams/$teamSymbol/$season"
                    params={{ teamSymbol: team.symbol, season }}
                  >
                    <span className="px-0.5">{team.symbol}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
