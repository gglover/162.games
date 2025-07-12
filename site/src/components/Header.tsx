import { Link } from "@tanstack/react-router";
import { TEAMS } from "../constants";

export function Header() {
  return (
    <header className="text-black bg-gray-200">
      <div className="w-xl m-auto py-2">
        <div className="flex justify-end align-middle">
          <h1 className="flex-grow">
            <Link to="/">[ ]</Link>
          </h1>
          <Link to="/about">About</Link>
          <a href="https://github.com/gglover/mlb-season-data-vis">gh</a>
        </div>
        <div className="team-links">
          {Object.values(TEAMS).map((team) => (
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
    </header>
  );
}
