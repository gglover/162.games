import { Link } from "@tanstack/react-router";
import { TEAMS } from "../constants";
import { TeamId } from "../interfaces";
import { teamLogoFromId } from "../utils";

export interface TeamLogoProps {
  id: TeamId;
  size: number;
  x: number;
  y: number;
}

export function TeamLogo({ id, size, x, y }: TeamLogoProps) {
  return (
    <Link to={`/teams/${TEAMS[id].symbol}`}>
      <image
        x={x}
        y={y}
        height={size}
        width={size}
        xlinkHref={teamLogoFromId(id)}
        style={{
          transformOrigin: "center",
          transformBox: "fill-box",
          transform: "translate(50%, 50%)",
        }}
      />
    </Link>
  );
}
