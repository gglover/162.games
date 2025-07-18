import { Link } from "@tanstack/react-router";
import { TEAMS } from "../constants";

export function Header() {
  const teamLinks = Object.values(TEAMS).sort((a, b) =>
    a.symbol.localeCompare(b.symbol)
  );

  return (
    <header className="text-black bg-gray-200">
      <div className="w-xl m-auto py-4">
        <div className="flex justify-end align-middle">
          <h1 className="flex-grow">
            <Link to="/">⚾</Link>
          </h1>
          <div className="team-links">
            {teamLinks.map((team) => (
              <Link
                key={team.id}
                to="/teams/$teamSymbol"
                params={{ teamSymbol: team.symbol }}
              >
                {team.symbol}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
