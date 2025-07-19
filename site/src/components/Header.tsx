import { Link } from "@tanstack/react-router";
import { TEAMS } from "../constants";

export function Header() {
  const teamLinks = Object.values(TEAMS).sort((a, b) =>
    a.symbol.localeCompare(b.symbol)
  );

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
      <div className="text-black bg-gray-100 border-y-2 border-gray-200 shadow-md">
        <div className="text-center  py-2 text-[12px] bg-gray-200 ">
          {/* <img src="/logo.png" width="40" height="40" className="inline" /> */}
          <h1 className="text-black font-bold">Baseball Season Charts</h1>
        </div>

        <div className="w-2xl m-auto py-4">
          {/* <img className="w-12 h-12" src="/logo.png" /> */}
          <div className="flex justify-center gap-2">
            {divisionOrder.map((division) => (
              <div
                key={division}
                className="flex gap-2 text-[10px] items-center"
              >
                {teamsByDivision[division].map((team) => (
                  <Link
                    key={team.id}
                    to="/teams/$teamSymbol"
                    params={{ teamSymbol: team.symbol }}
                  >
                    {team.symbol}
                  </Link>
                ))}
                <div className="mx-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
