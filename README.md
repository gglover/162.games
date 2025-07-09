# MLB Season Timeline (working title)

This project is an effort to visualize an MLB season as series-by-series outcomes. This is conceptually what
many fans already do. There's a lot of noise with 162 individual results.

## Monorepo setup for https://d48vmuz4fbfgs.cloudfront.net/teams/SEA (DNS TBD).

### `site/`

Frontend code and bundler.

- React + Tanstack router SPA.
- D3 for charts.

### `infra/`

CDK configuration for running the site's backend.

- Static site with DNS to serve the SPA.
- Lambda to process/sync schedules. Runs nightly during the MLB season.

### `scripts/`

Logic schedule for lambda.

- Pulls from the [MLB stats API](https://statsapi.mlb.com/docs/) using [python bindings](https://github.com/toddrob99/MLB-StatsAPI).

## Inspiration

- [https://gregstoll.com/baseballdivisionraces/]
- [https://www.baseball-reference.com/teams/SEA/2025.shtml] See game results section.
