# Request Tracker

This file is the working checklist for product and research requests. A request is not complete until its code, documentation, verification, and deployment state are recorded here.

## Statuses

- **Complete:** implemented, tested, and reflected in the current intended product behavior.
- **Partial:** some implementation exists, but data, sources, tests, or deployment are incomplete.
- **Pending:** accepted work that has not been implemented.
- **Blocked:** requires a decision, external source, or infrastructure action.

## Current Requests

| Request | Status | Acceptance criteria | Next action |
| --- | --- | --- | --- |
| Keep local development available | Complete | README documents direct Next.js and Docker local runs | Keep local and staging configuration separate |
| Deploy current local changes to staging | Complete | Current worktree changes committed, pushed, and staging health/build verified | Monitor the deployment workflow; GitHub CLI is unavailable in this environment |
| Community metric cards for every facility | Partial | Every facility has source-backed or explicitly numerical proxy values for water, electricity, air, sound, vibration, and land context | Research and attach source records to remaining facilities |
| Hide metric evidence state in tooltip | Complete | Evidence basis is only exposed through the metric information control | Add source links and dates to the same tooltip |
| Element Critical Houston One | Partial | Parent campus, related phases, sources, and duplicate relationship represented | Formalize Skybox/Element parent and phase records |
| Detailed facility records | Partial | Every published/candidate record has operator, lifecycle, technical facts, sources, milestones, unknowns, and community evidence | Complete facility-by-facility research pass |
| Map/detail score parity | Complete | Same canonical 0.25-mile baseline without a searched address; searched maps use searched distance | Add regression test for representative facilities |
| Score breakdown | Partial | Component ranges are shown in the detail dropdown | Add weights, distance factors, score version, and source assumptions |
| Lifecycle colors | Complete | Built red, construction orange, announced purple across filters, map, cards, legend, and details | Add visual regression coverage |
| Address marker consistency | Partial | Green shared marker appears on map and impact overlay | Replace remaining legacy search glyphs |
| Impact model terminology and weights | Complete | Remove Proximity, remove zoning/traffic, use Water 25%, Electricity 20%, Air 20%, Noise 15%, Vibration 10%, Land/Wildlife 5%, Scale/Site Context 5% | Review revised ranges with representative facilities |
| Distance science | Complete | Category-specific formulas and cited literature appear in methodology and product education pages | Validate formulas against representative facilities |
| Water-use approximation | Pending | WUE-based numerical ranges distinguish capacity, utilization, cooling, and direct water use | Add facility-specific WUE claims and benchmark source records |
| First-use results scrolling cue | Complete | Cue appears only when the list overflows and dismisses after scroll or activation | Add browser-level interaction coverage |
| Calculator work-in-progress page | Partial | A clearly provisional page describes separate immediate and address calculators without showing scores on the home or facility pages | Gather feedback and define score ranges, thresholds, and cumulative rules before implementation |
| Heat production impact | Pending | Research-backed heat-output or cooling-exhaust evidence can be represented separately from electricity and water | Identify public measurements, proxies, and appropriate distance behavior |
| Illumination / light pollution impact | Pending | Nighttime lighting, glare, shielding, and sleep/dark-sky concerns have an explicit evidence category | Identify public permitting, site-design, and measurement sources |
| Autocomplete provider behavior | Partial | Enter and suggestion selection apply the first resolved result; Google, Nominatim, and ArcGIS address fallback support suggestions and direct results | Add browser-level coverage for provider modes, keyboard selection, and failed lookups; verify ArcGIS production terms and quotas |

## Deployment Rule

Do not describe local changes as staged. The staging environment changes only after the intended files are committed and pushed through the deployment workflow. Score-model changes should be deployed as a separately identifiable change from the current UI baseline.
