import sys
import statsapi
import datetime
import boto3
import json
import time
import os
import logging
from pprint import pprint

# # Safe bounds for the offseason.
# # Unless MLB schedules a unprecedented early season series we should be safe with these.
SEASON_START = '03/1'
SEASON_END = '10/30'

s3_client = boto3.client('s3')
logger = logging.getLogger()
logger.setLevel("INFO")

def lambda_handler(event, context):
  """
  Main lambda handler. Fetches data from mlb stats API then processes / writes resulting blob to S3.

  Event options:
  year:           Optional. Season to fetch. Defaults to current year.
  skip_fetch:     Skip fetching schedules from stats API. Use whatever is on S3.
  """
  try:
    # Fallback to current year
    year = event.get('year', datetime.now().year)
    skip_fetch = event.get('skip_fetch', False)
    bucket_name = os.environ.get('SCHEDULE_DATA_BUCKET')

    if not bucket_name:
      raise ValueError("Missing required environment variable SCHEDULE_DATA_BUCKET")
    
    teams_json = None

    try:
      response = s3_client.get_object(
        Bucket=bucket_name,
        Key='teams.json'
      )

      # Read the body and decode it
      body = response['Body'].read().decode('utf-8')

      teams_json = json.loads(body)

    except Exception as e:
      logger.error(f"Failed to fetch teams data from S3.")
      raise
    
    team_ids = [team["id"] for team in teams_json]

    if not skip_fetch:
      for team_id in team_ids:
        games = statsapi.schedule(start_date=f'{SEASON_START}/{year}', end_date=f'{SEASON_END}/{year}', team=team_id)
        time.sleep(10)

        logger.info(team_id)

        try:
          s3_client.put_object(
            Bucket=bucket_name,
            Key=f'{year}/{team_id}',
            Body=json.dumps(games),
            ContentType='application/json'
          )

        except Exception as e:
          logger.error(f"Failed to upload schedule data to S3: {str(e)}")
          raise


    logger.info(f"Successfully processed schedule for {year}.")
    
    return {
      "statusCode": 200,
      "message": "Schedule processed successfully"
    }

  except Exception as e:
    logger.error(f"Error processing schedule: {str(e)}")
    raise