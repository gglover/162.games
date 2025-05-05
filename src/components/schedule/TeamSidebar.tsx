export function TeamSidebar() {
  return (
    <div className="flex flex-col gap-2 team-overview w-36 mt-12">
      <div className="h-[150px] flex items-center mb-5">
        <div className="w-30 h-30 mx-auto bg-gray-300 p-8 rounded-full relative">
          <img className="team-logo object-contain w-1/1 h-1/1" />
          <div className="absolute rounded-full border-b-gray-100 border border-gray-200 bg-white w-7 h-7 text-center bottom-0 right-0">
            🔥
          </div>
        </div>
      </div>
      <h1 className="text-lg text-gray-800 team-name">Seattle Mariners</h1>
      <p className="text-black text-xs team-record">16 - 12</p>
      <p className="text-black text-xs team-division-ranking">1st [AL West]</p>
      <p className="text-black text-xs mb-2 team-mlb-ranking">7th [MLB]</p>

      <p className="text-black text-xs mb-2">Strength of Schedule</p>
      <p className="text-black text-xs mb-2 flex-grow">
        Strength of Remaining Schedule
      </p>
    </div>
  );
}
