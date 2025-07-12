import { DIVISION_LEADER_COLOR, WC3_COLOR } from "../../constants";

export function ScheduleKey() {
  return (
    <div className="m-2 flex flex-col justify-end">
      <div
        className="pt-1 text-gray-600 text-[10px] mb-2 border-t-2"
        style={{ borderColor: DIVISION_LEADER_COLOR }}
      >
        Division Leader
      </div>
      <div
        className="pt-1 text-gray-600 text-[10px] border-t-2"
        style={{ borderColor: WC3_COLOR }}
      >
        Wild Card 3
      </div>
    </div>
  );
}
