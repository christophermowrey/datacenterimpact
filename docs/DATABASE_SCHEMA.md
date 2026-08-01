# Inventory Database Schema

The Phase 0 schema lives in `db/migrations/001_phase_0_inventory.sql`.

## Design Principle

The database separates:

- **Research reports:** raw discovery signals and candidate submissions.
- **Entities:** normalized physical developments, facilities, buildings, and projects.
- **Claims:** individual facts with evidence status and source attribution.
- **Publication decisions:** the review decision that controls public visibility.
- **Lifecycle events:** the historical and current built/construction/announced timeline.

This prevents a directory listing, social post, or candidate report from becoming a public facility merely because it was imported.

## Main Tables

| Table | Purpose |
| --- | --- |
| `inventory.sources` | External pages, documents, posts, and source metadata. |
| `inventory.research_reports` | Raw discovery inputs and candidate queue. |
| `inventory.entities` | Canonical normalized records. |
| `inventory.entity_locations` | Current and historical supported locations. |
| `inventory.entity_aliases` | Alternate names and source identifiers. |
| `inventory.entity_relationships` | Campus, phase, duplicate, and related-entity relationships. |
| `inventory.lifecycle_events` | Built, construction, and announced history. |
| `inventory.claims` | Field-level evidence and community impact observations. |
| `inventory.publication_decisions` | Review history for published, candidate, archived, and excluded states. |
| `inventory.review_events` | Single-reviewer audit trail. |

## Important Invariants

- A published entity must be verified.
- An exact or approximate public location must have coordinates.
- Candidate reports can exist without coordinates and do not become map records automatically.
- A proxy claim must identify a comparable entity or methodology.
- Unknown values are represented explicitly, not as zero.
- Historical sources and excluded records are retained.
- A campus or development is represented as a related group rather than silently duplicated.

## Not Yet Connected

The current Next.js app still reads `lib/facilities.ts`. This migration establishes the data model without changing the live map. The next implementation step is a one-time import into the new tables, followed by read-only admin review queries before replacing the application data source.

## Initial Import

Run migrations with `DATABASE_URL` set:

```text
DATABASE_URL=postgres://... npm run db:migrate
```

The legacy import is deliberately a separate one-time operation:

```text
DATABASE_URL=postgres://... npm run db:import-facilities
```

The importer maps the legacy `demo` records to published records, maps legacy `Preliminary` confidence to candidate confidence, and creates research reports for candidate records. It does not treat unresolved candidate coordinates as public map locations. Do not rerun the importer against a populated database until a deduplication/import-run policy is added.
