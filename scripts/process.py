import json
import boto3
import os
from datetime import datetime, timedelta
from collections import defaultdict
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

s3_client = boto3.client('s3')

def process(teams_json, year):
    """
    """
    all_records = {}
    all_series = {}
    all_schedules = {}
    all_teams = {}
    playoffs = {}
    processed_game_ids = set()

    schedule_bucket_name = os.environ.get('SCHEDULE_DATA_BUCKET')

    for team in teams_json:
        all_schedules[team['id']] = []
        all_teams[team['id']] = team

    for team_id in all_schedules:
        current_team = all_schedules[team_id]

        response = s3_client.get_object(
            Bucket=schedule_bucket_name,
            Key=f'{year}/{team_id}.json'
        )

        # Read the body and decode it
        body = response['Body'].read().decode('utf-8')
        schedule = json.loads(body)
        regular_season = [game for game in schedule if game['game_type'] == 'R' and game['status'] != 'Postponed']

        record = [0, 0]

        current_series = None
        current_series_id = None

        for game in regular_season:
            is_home_team = str(game['home_id']) == team_id
            did_home_team_win = game['home_score'] > game['away_score']
            did_team_win = (did_home_team_win and is_home_team) or (not did_home_team_win and not is_home_team)

            if game['status'] == 'Final':
                if did_team_win:
                    record[0] += 1 
                else:
                    record[1] += 1

            # Create a new entry in the records log if this is our first time processing this day.
            #
            if not game['game_date'] in all_records:
                all_records[game['game_date']] = { key: None for key in all_schedules }

            all_records[game['game_date']][team_id] = [
                record[0],
                record[1]
            ]

            # The series ID will reuse the ID of the first game in the series.
            # Skip this loop if we've already processed this game via opponent.
            #
            if game['game_id'] in processed_game_ids:
                if game['game_id'] in all_series and game['game_id'] not in current_team:
                    current_team.append(game['game_id'])

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

                current_team.append(current_series_id)
            
            current_series['end'] = game['game_date']

            if game['status'] == 'Final':
                current_series['scores'].extend([
                    int(game['home_score']),
                    int(game['away_score'])
                ])

            processed_game_ids.add(game['game_id'])
        
        if current_series_id is not None:
            all_series[current_series_id] = current_series

    # Fill in gaps in records
    #
    sorted_dates = sorted([datetime.strptime(date, '%Y-%m-%d') for date in all_records.keys()])
    # sorted_dates = sorted(all_records.keys(), key=lambda x: datetime.strptime(x, '%Y-%m-%d'))

    season_start = sorted_dates[0]
    season_end = sorted_dates[-1]

    current_date = season_start

    while current_date <= season_end:
        prev_date_key = (current_date - timedelta(days = 1)).strftime("%Y-%m-%d")
        date_key = current_date.strftime("%Y-%m-%d")

        if not date_key in all_records:
            all_records[date_key] = { key: None for key in all_schedules }


        for team, record in all_records[date_key].items():

            # If no record exists (ie. it's an off day) backfill from previous date or initialize.
            if record is None:
                if not prev_date_key in all_records:
                    all_records[date_key][team] = [0, 0]
                
                else:
                    all_records[date_key][team] = all_records[prev_date_key][team].copy()
        
        current_date = current_date + timedelta(days=1)

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
        for key, group in groupby(standings, lambda tuple: tuple[0]):
            group = list(group)

            resolved_ranking = counted_teams + ceil(len(group) / 2)

            for pct, team in group:
                records[team].append(resolved_ranking)
                records[team].append(heat_index())
            
            counted_teams = counted_teams + len(group)
        
        # Division leaders
        #
        divisions = defaultdict(list)
        for tuple in standings:
            division_key = all_teams[tuple[1]]['division']

            divisions[division_key].append(tuple[1])

        divison_leaders = [divisions[key][0] for key in divisions]

        al_standings = [tuple[1] for tuple in standings if all_teams[tuple[1]]['league'] == 'AL' and tuple[1] not in divison_leaders]
        nl_standings = [tuple[1] for tuple in standings if all_teams[tuple[1]]['league'] == 'NL' and tuple[1] not in divison_leaders]

        playoffs[date] = [
            al_standings[2],
            nl_standings[2],
            divisions['AL East'][0],
            divisions['AL Central'][0],
            divisions['AL West'][0],
            divisions['NL East'][0],
            divisions['NL Central'][0],
            divisions['NL West'][0],
        ]

    # Calculate last-in for playoffs
    #
    # division_leaders = ....

    # last_wild_card = [AL, NL]

    # filter standings AL / NL

    # for each team in standings:
    #    if not division leader [league] +1
    #    if [league] === 3: push teamId

    return {
        'schedules': all_schedules,
        'series': all_series,
        'records': all_records,
        'playoffs': playoffs,
        'start': season_start.strftime("%Y-%m-%d"),
        'end': season_end.strftime("%Y-%m-%d"),
    }

    # json.dump(schedule_data, f, ensure_ascii=False, indent=4)

    # pprint(len(all_series))
    # pprint(all_records)

    # pprint(all_records['2025-03-18'])
    # pprint(all_records['2025-03-19'])
    # pprint(all_records['2025-03-20'])
