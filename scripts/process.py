import json
import collections
from datetime import datetime, timedelta
from itertools import groupby
from pprint import pprint

# Records
#
# { 
#   [date]: { 
#       [teamId]: [wins, losses, L10wins, L10losses...] 
#   }
# }     

# Series
#
# {
#  - gameId of first game in series serves as the key
#
#  [seriesId]: {
#    home: id,
#    away: id,
#    start: date,
#    end: date,
#    scores: [homeRuns, awayRuns, homeRuns, awayRuns ...]
#   }
# }

# Teams
# 
# {
#   [key]: {
#     name: string,
#     schedule: seriesId[]
#   }
# }
#

all_records = {}
all_series = {}
all_teams = {}

with open('scripts/data/teams.json') as json_data:
    teams = json.load(json_data)

    for team in teams:
        all_teams[team['id']] = {
            'name': team['name'],
            'code': team['teamCode'].upper(),
            'schedule': [],
            'record': [0, 0],
        }  


for team_id in all_teams:
    current_team = all_teams[team_id]

    with open(f'scripts/data/{team_id}.json') as json_data:
        schedule = json.load(json_data)
        
        regular_season = [game for game in schedule if game['game_type'] == 'R']

        lastTen = collections.deque([], 10)
        lastFive = collections.deque([], 5)
        record = [0, 0]

        current_series = None
        current_series_id = None

        for game in regular_season:
            if game['status'] != 'Final':
                continue

            is_home_team = game['home_id'] == team_id
            did_home_team_win = game['status'] == 'Final' and game['home_score'] > game['away_score']
            did_team_win = (did_home_team_win and is_home_team) or (not did_home_team_win and not is_home_team)

            # Update cumulative records
            lastTen.append(1 if did_team_win else 0)
            lastFive.append(1 if did_team_win else 0)

            if did_team_win:
                record[0] += 1 
            else:
                record[1] += 1


            # See if a new series is starting
            if current_series is None or current_series['home'] != game['home_id'] or current_series['away'] != game['away_id']:
                if current_series is not None:
                    all_series[current_series_id] = current_series

                current_series_id = game['game_id']

                if current_series_id in all_series:
                    current_series = all_series[current_series_id]

                else:
                    current_series = {
                        'scores': [],
                        'home': game['home_id'],
                        'away': game['away_id'],
                        'start': game['game_date'],
                        'end': None,
                    }

                current_team['schedule'].append(current_series_id)
            
            # Calculate series info
            #
            if current_series_id not in all_series:
                current_series['end'] = game['game_date']

                current_series['scores'].extend([
                    int(game['home_score']),
                    int(game['away_score'])
                ])

            # Calculate record info
            #
            if not game['game_date'] in all_records:
                all_records[game['game_date']] = { key: None for key in all_teams }

            all_records[game['game_date']][team_id] = [
                record[0],
                record[1],
                sum(lastTen),
                len(lastTen) - sum(lastTen),
                sum(lastFive),
                len(lastFive) - sum(lastFive)
            ]

        json_data.close()

# Fill in gaps in records
prev_date = None

for date in sorted(all_records.keys(), key=lambda x: datetime.strptime(x, '%Y-%m-%d')):
    # print(date)
    for team, record in all_records[date].items():

        # If no record exists (ie. it's an off day) backfill from previous date or initialize.
        if record is None:
            if not prev_date:
                all_records[date][team] = [0, 0, 0, 0, 0, 0]
            
            else:
                all_records[date][team] = all_records[prev_date][team].copy()
    
    prev_date = date

# Calculate standings
# 
def winning_pct(wins, losses):
    if losses == 0 and wins == 0:
        return 5000
    else:
        return int(round(wins / (wins + losses), 4) * (10 ** 4))
    
for date, records in all_records.items():
    standings = [(winning_pct(data[0], data[1]), team) for team, data in records.items()]
    standings.sort(reverse=True)

    prev_win_pct = -1
    position = 1
    for i in range(len(standings)):
        win_pct, team = standings[i]
        records[team].append(i)

    # ranking_pairs = []

    # for pct, teams in groupby(records.items(), key = lambda pair: winning_pct(pair[1][0], pair[1][1])):
    #     ranking_pairs.append([pct, list(teams)])
    
    # # Sorts by first item in tuple by default
    # ranking_pairs = sorted(ranking_pairs, reverse=True)

    # for index, ranking in enumerate(ranking_pairs):
    #     for team in ranking[1]:
    #         if len(team[1]) == 6:
    #             team[1].append(index) 
    
    pprint(records)
    # pprint(standings)

with open('src/data.json', 'w', encoding='utf-8') as f:
    schedule_data = {
        'teams': all_teams,
        'series': all_series,
        'records': all_records
    }

    json.dump(schedule_data, f, ensure_ascii=False, indent=4)

# pprint(len(all_series))
# pprint(all_records)

# pprint(all_records['2024-03-28'])
# pprint(all_records['2024-03-29'])
