# GRAPHS

The purpose of the task is to implement graphers libraries for benchmarking. The initial aim is to display analogic and all or nothing signal.

## Technologies

- docker + compose as orchestrator
- mysql as database
- nest + prisma for the API
- angular 21 for the front
- echarts, highcharts and scicharts (the 3 libs to be benchmarked)
- use HTTP everywhere as it is a simple benchmarking project (no need of traefik)

## Back-office

Use simple repositories + controller pattern, do not return directly entities, use response/request pattern with mappers to transform object accross both layer.

Use scalar to access API.

### Datamodel

The back office will be a CRUD on a table *series* and a table *points*

The *serie* entity will have the following properties :

- Id (long)
- Type (an enum with 10 flowers types, unique)
- Description (string 256 char)

The *point* entity will have the following properties :

- Id (long)
- SerieId (FK to the *serie* entity linked)
- CreationDate (Datetime, UTC format)
- Value (decimal between -65535 and 65535)
- Quality (Enum : Good, degraded or error)

### Seed

Create an overrall endpoint to seed 1 000 000 points accross the 10 flowers on one month timeframe.

### Test

Test using vitest.

## Front-office

Use component > store (with ngrx signal store) > client (httpClient) pattern. Client manipulate response/request and component objects, the store will ensure the mapping.

Each re-usable UI component should be created in a separated ui folder.

### Page 1 (Simple analogic)

Create a form with 3 inputs :

- Start date (text field)
- End date (text field)
- Flowers (checkboxes list)

Create a graph for each library that display a curve for each selected serie and the points associated with the timeframe.

### Page 2 (All or nothing graph)

Create a form with 4 inputs :

- Start date (text field)
- End date (text field)
- Flower (dropdown list)
- Threshold (text field)

Create a graph for each library that display a all-or-nothing signal for the selected serie and the points associated with the timeframe, that will display 1 if over threshold, 0 if under.

### Tests

Test using vitest.

## Inspiration

- Use https://github.com/TataneCode/dockers for API and Angular logic.
- For the charts use :
    - https://github.com/highcharts/highcharts
    - https://github.com/apache/echarts
    - https://github.com/ABTSoftware/SciChart.JS.Examples

