# Phase 0: Inventory Definitions And Rules

These rules govern what the inventory retains, what the public map displays, and how future records are reviewed.

## Data Center Definition

Wikipedia defines a data center as a physical room, building, or facility used for storing, managing, and disseminating data and information, including information technology infrastructure, computer systems, and associated components. See [Wikipedia: Data center](https://en.wikipedia.org/wiki/Data_center).

For this project, a qualifying record must represent a fixed physical building, campus, or facility that houses computing, storage, networking, or telecommunications equipment, together with supporting power, cooling, security, or connectivity infrastructure.

The workload does not need to be disclosed as AI. AI, cloud, enterprise, colocation, hyperscale, edge, high-performance computing, crypto, and network facilities can qualify when the physical facility is supported by evidence.

## Verified Record

A verified record has enough evidence to reasonably assert that:

- The facility or project exists as a distinct physical entity or development.
- Its identity is sufficiently resolved.
- Its location is supported to the stated precision.
- Its lifecycle label is supported by evidence.

Verified does not mean every community impact dimension has a facility-specific measurement. A verified facility may have unknown water use, sound levels, vibration, emissions, waste heat, or actual electricity consumption. Those gaps must be displayed rather than filled with unsupported certainty.

## Candidate

A candidate is a plausible research record that has not yet met the verified-record requirements. Candidate is the only preliminary research state; “preliminary record” is not a separate category.

Candidates may have unresolved identity, location, lifecycle, facility type, duplicate relationships, or source conflicts. They remain in PostgreSQL and the candidate table. They do not appear on the normal public map. A candidate can be opened on a map only when a supported location exists.

## Lifecycle Status

Lifecycle describes the real-world stage:

- **Built:** operating or substantially completed.
- **Under construction:** evidence says physical construction is underway.
- **Announced:** a credible source identifies a planned or proposed project, but construction has not been established.

An announcement is allowed on the public map as **Announced**. It must not be labeled **Under construction** unless construction evidence exists.

## Publication Status

Publication describes the application decision:

- **Published:** eligible for the normal public map.
- **Candidate:** research-only, shown in the candidate table and optional candidate view.
- **Archived:** retained for historical purposes but no longer current.
- **Excluded:** reviewed and intentionally not considered a qualifying facility.

Lifecycle and publication are independent. A project can be `announced + published`, or `construction + candidate`.

## Facility Classes

- Major or hyperscale campus
- Commercial or enterprise colocation
- Edge or high-performance computing
- Carrier or network facility
- Other qualifying compute facility

Network facilities are included by default and can be hidden with a user toggle. They remain a separate class and should not be presented as equivalent in scale to a hyperscale campus.

## Campus And Phase Rules

A campus is one larger physical development containing multiple buildings or related infrastructure. A campus is counted as one larger development, not as unrelated facilities for inventory purposes.

A phase is a distinct construction, expansion, or development stage within that campus. When a campus has multiple phases, the inventory reports the latest relevant phase. If one building is operational and another is announced at the same campus, the campus is treated as operational while the announced phase is retained as a lifecycle event or related phase, not as a second unrelated facility.

## Location Rules

City-center placeholder points are not allowed. A location that cannot be responsibly resolved to a physical site or supported site area remains a candidate and is not shown on the map.

Location precision must be explicit:

- **Exact:** supported street address or parcel-level location.
- **Approximate:** supported facility area, campus, or nearby site, but not an exact public point.
- **Candidate:** unresolved location that is not eligible for the public map.

## Exclusions

Retain excluded records and their evidence history. Examples include:

- Power plants without a qualifying data-center facility.
- Electrical substations without a qualifying data-center facility.
- Fiber routes or ordinary network infrastructure without a qualifying fixed facility.
- Generic offices, warehouses, or industrial land without evidence of data-center use.
- Rumors with no identifiable project or physical site.
- Duplicates merged into a better-supported campus or facility record.
- Cancelled or disproven projects, which should be archived or excluded rather than deleted.

## Community Impact Dimensions

The project uses these community-facing dimensions:

- Electricity and grid
- Water consumption
- Air emissions and onsite generation
- Sound
- Vibration
- Construction and traffic
- Zoning and land-use context
- Waste heat and thermal effects

These dimensions are inspired in part by Erin Brockovich’s community-focused environmental advocacy and [Community Healthbook](https://www.communityhealthbook.com/). The categories and scoring method remain the developer’s methodology, not a claim that Brockovich endorses the project or its calculations.

Wildlife and land context may be discussed in the calculator write-up, but it is not currently a separate scored dimension because it overlaps with land use, water, construction, traffic, zoning, and flood context.
