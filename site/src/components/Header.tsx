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
      <div className="text-white bg-gray-800 border-gray-200 shadow-md">
        <div className="p-2 text-[12px]">
          {/* <img src="/logo.png" width="40" height="40" className="inline" /> */}
          <h1 className=" text-center font-bold">Baseball Series Charts</h1>
        </div>
      </div>

      <div className="text-black bg-gray-200 border-b-2 border-gray-300 shadow-md">
        <div className="p-3">
          {/* <img className="w-12 h-12" src="/logo.png" /> */}
          <div className="flex gap-5 justify-center flex-wrap">
            {divisionOrder.map((division) => (
              <div
                key={division}
                className="flex gap-0.5 text-[10px] items-center"
              >
                {teamsByDivision[division].map((team) => (
                  <Link
                    key={team.id}
                    to="/teams/$teamSymbol"
                    params={{ teamSymbol: team.symbol }}
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
