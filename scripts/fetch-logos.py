
import requests
import json
import time

SVG_LOGO_PATH = 'https://www.mlbstatic.com/team-logos/team-cap-on-light/'

with open('src/teams.json') as json_data:
    teams = json.load(json_data)

    for team in teams:
        team_id = team['id']
        logo_data = requests.get(f'{SVG_LOGO_PATH}{team_id}.svg').content

        with open(f'../src/svgs/{team_id}.svg', 'wb') as svg_file:
            svg_file.write(logo_data)
        
        time.sleep(10)
