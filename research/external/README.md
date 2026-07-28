# External Data Research

These files are public research artifacts downloaded for comparison and later manual review. They are not imported into the application and are not treated as verified facility records.

## ArcGIS U.S. Data Centers Tracker

Source application: https://experience.arcgis.com/experience/5a4d072ad01449bba5698a80103fb909

Public owner: `jones_ft`

Public download source: https://docs.google.com/spreadsheets/d/1JJ6kcVo-NjlAYtznwHOki2DVl4WWV6lhy-eXhFCdKKU/export?format=csv&gid=386766486

Downloaded file: `us-data-centers-tracker.csv`

The CSV includes facility names, addresses, coordinates, lifecycle status, location confidence, operator, tenant, MW, power source, dedicated generation, generator count, building count, cooling, facility/property size, project cost, expected online date, community pushback, resistance status, NDA flags, community links, and source URLs.

Public ArcGIS web-map configuration files:

- `arcgis-dc-main.json`
- `arcgis-dc-community.json`
- `arcgis-dc-grid.json`
- `arcgis-dc-resistance.json`

These came from the public ArcGIS item-data endpoints for web maps `DC_Main`, `DC_Community`, `DC_Grid`, and `DC_Resistance`. They should be reviewed for layer/source relationships before any import.

## Usage and restrictions

- Preserve the original source, download URL, and access date when deriving any record.
- Do not treat a source listing as verified without independent review.
- Do not redistribute Data Center Map full exports. Its public Data Explorer explicitly limits unauthenticated exports to three demo records and its terms restrict redistribution.
- Cleanview's API is public documentation but requires an API key. No unauthenticated API data was retrieved.
- Business Insider's tracker was reviewed through its public article description and methodology claims; no paywall bypass or private dataset extraction was attempted.
