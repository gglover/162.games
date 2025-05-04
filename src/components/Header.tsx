import { Link } from "@tanstack/react-router";

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
          <a href="/teams#ATH">ATH</a>
        </div>
      </div>
    </header>
  );
}
