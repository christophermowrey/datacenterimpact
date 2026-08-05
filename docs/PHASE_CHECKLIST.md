# Texas Expansion Phase Checklist

This checklist records implementation checkpoints, not claims that a phase is fully complete. Dates use the project workspace date and Central Time where available.

## Phase 0: Definitions And Rules

- [x] **Checkpoint: 2026-08-01.** Inventory schema, candidate states, publication states, lifecycle states, location precision, evidence sources, research reports, and review events were implemented in `db/migrations/001_phase_0_inventory.sql`.
- [x] **Checkpoint: 2026-08-01.** The qualifying facility definition follows the Wikipedia-style physical data-center definition: a fixed building, campus, or facility housing computing, storage, networking, or telecommunications equipment with supporting infrastructure.
- [x] **Checkpoint: 2026-08-01.** Power plants, substations, fiber routes, ordinary network infrastructure, generic offices, warehouses, unsupported land, rumors, duplicates, and disproven projects are excluded or retained as excluded/archived research records rather than published facilities.
- [x] **Checkpoint: 2026-08-01.** Campuses, buildings, phases, aliases, network facilities, exact locations, approximate locations, unresolved locations, and city-center placeholders were defined.
- [x] **Checkpoint: 2026-08-01.** Evidence roles and confidence fields were added, but numeric confidence thresholds and source-quality scoring still need to be formalized.
- [ ] Define community-impact dimensions, units, exposure bands, lower/upper bounds, uncertainty rules, and scoring methodology.

## Phase 1: Houston Discovery

- [x] **Checkpoint: 2026-08-01 to 2026-08-03.** Legacy facilities were imported into PostgreSQL with 23 records: 21 candidates and 2 published records.
- [x] **Checkpoint: 2026-08-01.** Candidates were separated from the public map and exposed through a protected review queue.
- [ ] Build broad Houston discovery across the agreed source union.
- [ ] Add automated source ingestion, normalization, deduplication, and provenance capture.

## Phase 2: Houston Identity And Location Review

- [x] **Checkpoint: 2026-08-01.** Candidate queue and read-only candidate detail views were implemented.
- [x] **Checkpoint: 2026-08-03.** Protected staging admin access, database health, and candidate review visibility were deployed.
- [ ] Add AI-assisted identity, duplicate, campus, phase, facility-class, lifecycle, and location-resolution review.
- [ ] Define automatic acceptance, automatic exclusion, and human-escalation thresholds.
- [ ] Add review actions, evidence comparison, decision reasons, and audit history to the admin panel.

## Phase 3: Houston Community Impact Research

- [ ] Research electricity and grid effects first.
- [ ] Research water, air emissions and onsite generation, sound, vibration, construction and traffic, zoning and land use, and waste heat.
- [ ] Define near-field and regional exposure bands, beginning with 0.5, 20, and 50 miles only where the evidence supports those scales.
- [ ] Store reported, estimated, proxied, disputed, and unknown values separately.
- [ ] Do not convert unknowns into unsupported numeric certainty.

## Phase 4: Houston Publication Pilot

- [ ] Define the publication gate for built, under-construction, and announced records.
- [ ] Promote qualifying verified records from the candidate queue.
- [ ] Display evidence gaps and distinguish verified facilities from verified impact measurements.
- [ ] Run the first formal Houston publication pilot.

## Phase 5: Houston Quality And Completeness Review

- [ ] Measure candidate-to-verified promotion rate.
- [ ] Measure AI automatic-decision rate and human-review rate.
- [ ] Measure false positives, false negatives, duplicates, location corrections, source conflicts, and community corrections.
- [ ] Tune acceptance, rejection, confidence, and escalation guidelines from observed errors.

## Phase 6: Texas Expansion

- [ ] Apply the tested Houston process to Dallas-Fort Worth.
- [ ] Apply it to Austin.
- [ ] Apply it to San Antonio.
- [ ] Apply it to the Rio Grande Valley.
- [ ] Apply it to East Texas.
- [ ] Apply it to West Texas.
- [ ] Apply it to remaining Texas regions.

## Phase 7: Statewide Coverage Reporting

- [ ] Define the qualifying, publicly discoverable denominator and review date.
- [ ] Report coverage against the agreed source union.
- [ ] Track the 95% goal without claiming coverage of undisclosed private server rooms.

## Current Gate

The next gate is not broad statewide discovery. It is to complete the Phase 0 impact methodology and build the Phase 2 AI-assisted review loop, then use the 23 imported records as a controlled test set before expanding Houston discovery.
