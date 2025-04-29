import itertools
import json
import collections
from datetime import datetime, timedelta
from itertools import groupby
from math import ceil
from pprint import pprint
import random

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

with open('scripts/data_2024/teams.json') as json_data:
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

    processed_game_ids = set()

    with open(f'scripts/data_2024/{team_id}.json') as json_data:
        schedule = json.load(json_data)
        
        regular_season = [game for game in schedule if game['game_type'] == 'R']

        record = [0, 0]

        current_series = None
        current_series_id = None

        for game in regular_season:
            is_home_team = game['home_id'] == team_id
            did_home_team_win = game['home_score'] > game['away_score']
            did_team_win = (did_home_team_win and is_home_team) or (not did_home_team_win and not is_home_team)

            if game['status'] == 'Final':
                if did_team_win:
                    record[0] += 1 
                else:
                    record[1] += 1

            # Tally team's record for this day.
            #
            if not game['game_date'] in all_records:
                all_records[game['game_date']] = { key: None for key in all_teams }

            all_records[game['game_date']][team_id] = [
                record[0],
                record[1]
            ]

            # The series ID will reuse the ID of the first game in the series.
            # Skip the rest of this loop if we've already processed this game via opponent.
            #
            if game['game_id'] in processed_game_ids:
                if game['game_id'] in all_series:
                    current_team['schedule'].append(game['game_id'])

                continue

            # We need to add series blocks if this is the first time iterating over the games.
            # See if a new series is starting or if we're adding to an existing one.
            #
            if current_series is None or current_series['home'] != str(game['home_id']) or current_series['away'] != str(game['away_id']):
                if current_series is not None:
                    all_series[current_series_id] = current_series

                current_series_id = game['game_id']

                current_series = {
                    'scores': [],
                    'home': str(game['home_id']),
                    'away': str(game['away_id']),
                    'start': game['game_date'],
                    'end': None,
                }

                current_team['schedule'].append(current_series_id)
            
            current_series['end'] = game['game_date']

            current_series['scores'].extend([
                int(game['home_score']),
                int(game['away_score'])
            ])

            processed_game_ids.add(game['game_id'])
        
        all_series[current_series_id] = current_series

        json_data.close()

# Fill in gaps in records
#
prev_date = None

for date in sorted(all_records.keys(), key=lambda x: datetime.strptime(x, '%Y-%m-%d')):
    # print(date)
    for team, record in all_records[date].items():

        # If no record exists (ie. it's an off day) backfill from previous date or initialize.
        if record is None:
            if not prev_date:
                all_records[date][team] = [0, 0]
            
            else:
                all_records[date][team] = all_records[prev_date][team].copy()
    
    prev_date = date

# Convert winning pct to integer so that comparison is stable.
# 
def winning_pct(wins, losses):
    if losses == 0 and wins == 0:
        return 5000
    else:
        return int(round(wins / (wins + losses), 4) * (10 ** 4))
    
# Calculate heat index (placeholder)
#
def heat_index():
    return random.random()
    
for date, records in all_records.items():
    standings = [(winning_pct(data[0], data[1]), team) for team, data in records.items()]
    standings.sort(reverse=True)

    # Resolve ties by grouping identical winning percentages and resolving to the median rank.
    #
    counted_teams = 0
    for key, group in itertools.groupby(standings, lambda x: x[0]):
        group = list(group)

        resolved_ranking = counted_teams + ceil(len(group) / 2)

        for pct, team in group:
            records[team].append(resolved_ranking)
            records[team].append(heat_index())
        
        counted_teams = counted_teams + len(group)

# Output results to file
#
with open('src/data.json', 'w', encoding='utf-8') as f:
    schedule_data = {
        'teams': all_teams,
        'series': all_series,
        'records': all_records
    }

    json.dump(schedule_data, f, ensure_ascii=False, indent=4)

# pprint(len(all_series))
# pprint(all_records)

# pprint(all_records['2025-03-18'])
# pprint(all_records['2025-03-19'])
