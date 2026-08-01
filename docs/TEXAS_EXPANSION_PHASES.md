# Texas Inventory Expansion Phases

This plan starts with Houston, validates the research and publication process, and only then expands to the rest of Texas.

## Phase 0: Definitions And Rules

Set the rules before adding more records:

- Define what qualifies as a data center.
- Define verified records and candidates.
- Define lifecycle status separately from publication status.
- Define built, under construction, and announced.
- Define network facilities, campuses, buildings, and phases.
- Define what is excluded and why.
- Define location precision and prohibit city-center placeholder points.
- Define evidence roles and review requirements.
- Define the community impact dimensions.
- Define how a single reviewer records decisions.

The rules in Phase 0 become the reference for programmatic validation and editorial review.

## Phase 1: Houston Discovery

Collect a broad research inventory for Houston and surrounding communities. Use operator pages, government records, permits, utilities, directories, reputable news, search results, Wikipedia, Facebook, Reddit, and community reports.

Discovery records are candidates. They are not automatically placed on the public map.

Candidates live in PostgreSQL and are reviewed in a table. A candidate may be opened on a map only when it has a responsibly supported location.

## Phase 2: Houston Identity And Location Review

Resolve whether each candidate represents a real physical facility or project.

- Deduplicate names and aliases.
- Identify campuses and buildings.
- Identify phases and expansions.
- Assign the current lifecycle status.
- Assign exact, approximate, or unresolved location precision.
- Keep network facilities as a separate class.
- Preserve conflicts and rejected interpretations.

Records without a responsibly supported location remain candidates and do not appear on the public map.

## Phase 3: Houston Community Impact Research

Research the community impact dimensions for each qualifying record:

- Electricity and grid
- Water consumption
- Air emissions and onsite generation
- Sound
- Vibration
- Construction and traffic
- Zoning and land-use context
- Waste heat and thermal effects

Each dimension records whether the value is reported, estimated, proxied, disputed, or unknown. A comparable facility may be used when the facility-specific value is unavailable, but the result must remain labeled as a proxy.

## Phase 4: Houston Publication Pilot

Promote qualifying records to the public map:

- Built facilities with sufficient existence and location evidence.
- Under-construction projects with evidence construction is underway.
- Announced projects with credible project and location evidence.
- Network facilities by default.

Unknown impact dimensions do not automatically prevent publication. The UI must show the unknowns and the difference between a verified facility and verified measurements.

## Phase 5: Houston Quality And Completeness Review

Measure the pilot before expanding:

- Duplicate and merge rate.
- Candidate-to-verified promotion rate.
- Missing evidence by impact dimension.
- Location correction rate.
- Source conflicts.
- Coverage against the union of known discovery sources.
- Community corrections and review outcomes.

## Phase 6: Texas Expansion

Apply the tested Houston process region by region:

1. Dallas-Fort Worth
2. Austin
3. San Antonio
4. Rio Grande Valley
5. East Texas
6. West Texas
7. Remaining Texas regions

Each region gets discovery, review, impact research, and publication work. “Statewide” is the destination, not a reason to skip the Houston pilot.

## Phase 7: Statewide Coverage Reporting

Report coverage against a defined denominator: qualifying, publicly discoverable facilities and projects within a stated geography and review date.

The 95% goal means 95% of the deduplicated qualifying records found across the agreed source union, not 95% of every private or undisclosed server room in Texas.
