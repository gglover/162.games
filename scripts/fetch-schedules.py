import statsapi
import json
import time
from pprint import pprint

SEASON_START = '03/18/2025'
SEASON_END = '10/5/2025'

teams = statsapi.lookup_team('', activeStatus='Y')

with open('scripts/data/teams.json', 'w', encoding='utf-8') as f:
    json.dump(teams, f, ensure_ascii=False, indent=4)

team_ids = [team["id"] for team in teams]

for team_id in team_ids:
    games = statsapi.schedule(start_date=SEASON_START, end_date=SEASON_END, team=team_id)
    time.sleep(10)

    print(team_id)

    with open(f'scripts/data/{team_id}.json', 'w', encoding='utf-8') as f:
        json.dump(games, f, ensure_ascii=False, indent=4)

 

