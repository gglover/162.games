import { Link, useParams } from "@tanstack/react-router";
import { CURRENT_SEASON, TEAMS } from "../constants";
import { TeamId } from "../interfaces";
import { teamLogoFromId } from "../utils";

export interface TeamLogoProps {
  id: TeamId;
  size: number;
  x: number;
  y: number;
}

export function TeamLogo({ id, size, x, y }: TeamLogoProps) {
  let { season } = useParams({ strict: false });
  season ??= CURRENT_SEASON;

  return (
    <Link
      to={`/teams/$teamSymbol/$season`}
      params={{ teamSymbol: TEAMS[id].symbol, season }}
      replace
    >
      <image
        x={x}
        y={y}
        height={size}
        width={size}
        xlinkHref={teamLogoFromId(id)}
        style={{
          transition: "all 0.2s linear",
          transformOrigin: "center",
          transformBox: "fill-box",
          transform: "translate(50%, 50%)",
        }}
      />
    </Link>
  );
}
