import { Link } from "@tanstack/react-router";
import { TEAMS } from "../chart/constants";

export function Header() {
  return (
    <header className="text-black bg-gray-200">
      <div className="w-xl m-auto py-2">
        <div className="flex justify-end align-middle">
          <h1 className="flex-grow">
            <Link to="/">MLB HeatIDX</Link>
          </h1>
          <Link to="/teams">Teams</Link>
          <Link to="/about">About</Link>
        </div>
        <div className="team-links">
          {Object.values(TEAMS).map((team) => (
            <Link key={team.id} to={`/teams/${team.symbol}`}>
              {team.symbol}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
