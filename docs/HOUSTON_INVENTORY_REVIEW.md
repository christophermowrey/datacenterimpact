# Houston Data Center Inventory Review

**Review date:** 25 Jul 2026  
**Scope:** Harris County and Fort Bend County, including Katy  
**Purpose:** Determine which entries from the broad Houston-market discovery list should be retained as Built, Under construction, or Announced records.

## Executive Summary

The site currently has two records because it began with a deliberately small, source-reviewed demo inventory. That is not a defensible estimate of the Houston market.

Baxtel currently describes the broader Houston market as **55 facilities operated by 35 providers** and separately reports nine facilities under construction. Its market boundary is broader than this project’s Harris/Fort Bend MVP boundary. The directory also mixes campuses, buildings, phases, carrier rooms, crypto/HPC sites, expansions, decommissioned sites, and uncertain projects.

This review keeps uncertain records in the research inventory. The public map should use three lifecycle groups:

- **Built:** operational or substantially completed facilities.
- **Under construction:** construction evidence exists.
- **Announced:** planned, prospective, shadow-announced, or uncertain projects with enough evidence to track.

Uncertainty is represented by evidence confidence and an explicit note, not by deleting the record. A record can be **Announced / Preliminary** or **Announced / In doubt**.

## Review Rules

### Keep on the research list

Keep an entry when it appears to represent a real data-center, colocation, carrier, HPC, or compute site, even if the address, ownership, status, or project identity still needs verification.

### Show on the MVP map

Show a record when its physical point is inside Harris or Fort Bend County, or when an approximate point can be responsibly placed inside the boundary. Use an approximate marker and lower confidence when the address is not exact.

### Keep out of the MVP map

Keep outside-boundary, decommissioned, and unresolved records in this report and future research inventory, but do not place them on the Harris/Fort Bend map until a separate regional view exists.

### Deduplicate carefully

Do not automatically merge different operators at the same building. Preserve operator and provider relationships, but use a campus/building relationship when multiple listings refer to the same physical site. Impact scoring should avoid double-counting the same building or campus phase.

### Evidence levels

- **High:** primary operator, owner, permit, county, utility, or government source confirms the site and lifecycle.
- **Medium:** directory record plus corroborating public source, but some details remain unresolved.
- **Preliminary:** credible discovery record, but primary confirmation or exact location is still needed.
- **In doubt:** source itself questions whether the project exists, remains active, or is correctly identified.

## Source Notes

- [Baxtel Houston market](https://baxtel.com/data-center/houston) reports 55 facilities, 35 providers, and nine under construction. It is the discovery-list source for the review below, not the sole publication source.
- [Data Center Map Houston](https://www.datacentermap.com/usa/texas/houston/) is a second discovery source and often separates operators, campuses, and buildings differently.
- [Texas Comptroller data-center list](https://comptroller.texas.gov/economy/local/ch313/data-centers.php) is useful for qualifying facilities and large projects but is not a complete colocation directory.
- Primary operator, county, permit, utility, property, and local reporting sources must be attached before a record is upgraded to high confidence.

The pasted ChatGPT response is not identical to the current Baxtel page. Baxtel currently uses names such as **Global Hub**, **South Ridge**, **Iozera: Houston**, and **Viridien: Brenham**. The pasted response calls some of these CleanSpark South Park, CleanSpark Center Three, or other names. Those aliases must not be treated as confirmed identities without source reconciliation.

## Entry-by-Entry Review

### 1. LOGIX Houston — 777 Walker

- **Directory evidence:** Baxtel lists an operational extra-small carrier facility at 777 Walker, operated by LOGIX Fiber Networks.
- **Boundary:** Harris County, downtown Houston.
- **Recommendation:** **ADD — Built / Preliminary.**
- **Reason:** A central-Houston carrier facility is plausible and the address is specific. Confirm current operation and whether this is a distinct data-center suite or a provider presence inside the 777 Walker building.
- **Review questions:** Is it a separately operated facility, and does it materially qualify under this project’s data-center definition?

### 2. LOGIX — 4635 Southwest Freeway

- **Directory evidence:** Baxtel lists an operational extra-small carrier facility operated by LOGIX.
- **Boundary:** Harris County, Houston.
- **Recommendation:** **ADD — Built / Preliminary.**
- **Reason:** Specific address and operator are supplied. Keep it as Additional Compute or Network Facility until the physical facility and scale are confirmed.
- **Review questions:** Confirm address, current operation, and whether the listing is a carrier room rather than a standalone facility.

### 3. LOGIX — Primewest Parkway

- **Directory evidence:** Baxtel lists an operational small carrier-neutral facility operated by LOGIX.
- **Boundary:** Likely Katy/Harris or Fort Bend boundary; exact parcel must be verified.
- **Recommendation:** **ADD — Built / Preliminary, approximate until parcel verified.**
- **Reason:** The Prime West/Katy area is within the project’s intended geography, but the county and address need confirmation.
- **Review questions:** Confirm street address, county, and relationship to EdgeConneX or another Prime West campus listing.

### 4. Cogent — 12061 North Freeway

- **Directory evidence:** Baxtel lists an operational extra-small carrier facility at 12061 North Freeway.
- **Boundary:** Harris County, Houston.
- **Recommendation:** **ADD — Built / Preliminary.**
- **Reason:** Specific physical address and carrier operator. It should not be treated as equivalent to a major campus without scale evidence.
- **Review questions:** Resolve the possible overlap with the Digital Realty 12001–12235 North Freeway campus and Fibertown Houston.

### 5. DataBank Houston Galleria

- **Directory evidence:** Baxtel lists a small operational DataBank carrier-neutral facility.
- **Boundary:** Harris County, Houston/Galleria area.
- **Recommendation:** **ADD — Built / Preliminary.**
- **Reason:** DataBank is an identifiable operator, and the facility is distinct from the Westway Park campus if the address is confirmed.
- **Review questions:** Obtain the official DataBank location page and exact address.

### 6. DataBank Westway Park I

- **Directory evidence:** DataBank’s official Westway Park I page confirms HOU1 at 5150 Westway Park Blvd, Houston, TX 77041.
- **Boundary:** Harris County.
- **Recommendation:** **ADD — Built / High.**
- **Reason:** Already source-reviewed and present in the application.
- **Review questions:** Relate HOU1 to the Westway Park campus without counting the campus as a fourth duplicate site.

### 7. DataBank Westway Park II

- **Directory evidence:** Baxtel lists a small operational DataBank facility on the Westway Park campus.
- **Boundary:** Harris County.
- **Recommendation:** **ADD — Built / Preliminary.**
- **Reason:** The campus and operator are credible, but HOU2 needs its own official source and location record.
- **Review questions:** Confirm whether HOU2 is a separate building, phase, or marketing name and obtain its exact address.

### 8. DataBank Westway Park III

- **Directory evidence:** Baxtel lists a small operational DataBank facility on the Westway Park campus.
- **Boundary:** Harris County.
- **Recommendation:** **ADD — Built / Preliminary.**
- **Reason:** Keep as a related campus building/phase, not an unlinked duplicate.
- **Review questions:** Confirm official status, building identity, and whether it is operational or planned expansion.

### 9. Digital Realty — 12001–12235 North Freeway

- **Directory evidence:** Baxtel lists an operational small carrier-neutral Digital Realty campus.
- **Boundary:** Harris County, Houston.
- **Recommendation:** **ADD — Built / Preliminary.**
- **Reason:** Specific multi-address campus record with a recognizable operator.
- **Review questions:** Resolve overlap with Cogent 12061 North Freeway and Fibertown Houston; preserve separate facilities only when the buildings or parcels are distinct.

### 10. EdgeConneX Houston

- **Directory evidence:** Baxtel lists EdgeConneX Houston as operational and planned at 1510 Prime West Parkway.
- **Boundary:** Katy-area county assignment requires parcel verification.
- **Recommendation:** **ADD — Built plus Announced expansion / Preliminary.**
- **Reason:** This is exactly the kind of facility with an operational base and a planned expansion. Keep lifecycle states separate rather than forcing one status.
- **Review questions:** Confirm county, exact parcel, operational building, and expansion scope.

### 11. Equinix Houston HO1

- **Directory evidence:** Equinix maintains an official Houston HO1 location page; Baxtel lists it as operational and carrier-neutral.
- **Boundary:** Harris County, Houston metro.
- **Recommendation:** **ADD — Built / Medium pending exact address confirmation.**
- **Reason:** Recognized operator and named facility. Attach the official Equinix source and exact address.
- **Review questions:** Confirm the public street address and whether HO1 is a standalone facility or a suite within another building.

### 12. Two Shell Plaza — 777 Walker

- **Directory evidence:** Baxtel lists an operational small real-estate facility at 777 Walker, operated by Hines Interests.
- **Boundary:** Harris County.
- **Recommendation:** **MERGE/RELATE — Built / Preliminary.**
- **Reason:** Same street address as LOGIX Houston. This is likely the building/real-estate record underlying a provider listing, not automatically a second physical data center.
- **Review questions:** Preserve the building and operator relationship, but prevent duplicate campus scoring.

### 13. 11:11 Systems Houston

- **Directory evidence:** Baxtel lists an operational extra-small content/data-center facility.
- **Boundary:** Likely Harris County, but exact address is not visible in the market summary.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** Keep because the operator and facility name are specific, but do not map until the address and facility type are verified.
- **Review questions:** Obtain operator location, exact address, and determine if it is a distinct site or hosted service at another facility.

### 14. Lumen Houston 5

- **Directory evidence:** Baxtel lists an operational extra-small Lumen carrier facility.
- **Boundary:** Houston market; exact address requires source review.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** Keep carrier facilities under Additional Compute when they are physical data-center locations, but require exact address and current status.
- **Review questions:** Confirm address and separate it from Lumen Houston 1, 3, and 4.

### 15. Lumen Houston 4

- **Directory evidence:** Baxtel lists an operational extra-small Lumen carrier facility.
- **Boundary:** Houston market; exact address requires source review.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** Same treatment as Lumen Houston 5.
- **Review questions:** Confirm independent physical location and current operation.

### 16. Lumen Houston 1

- **Directory evidence:** Baxtel lists an operational small Lumen carrier facility.
- **Boundary:** Houston market; exact address requires source review.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** Larger than the extra-small Lumen entries but still requires address and facility-source verification.
- **Review questions:** Confirm address and whether this is a building, network node, or data-center suite.

### 17. Lumen Houston 3

- **Directory evidence:** Baxtel lists an operational extra-small Lumen carrier facility.
- **Boundary:** Houston market; exact address requires source review.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** Retain as a candidate rather than silently dropping a named facility.
- **Review questions:** Confirm independent location and current operation.

### 18. Prescott Realty Group — 5959 Corporate

- **Directory evidence:** Baxtel lists an operational small real-estate facility.
- **Boundary:** Likely Harris County, Houston; exact parcel must be confirmed.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** Specific property name and operator, but real-estate ownership alone does not prove a data center.
- **Review questions:** Find tenant/operator, address, data-center use, and current status.

### 19. Quasar Data Center Houston

- **Directory evidence:** Quasar’s public materials describe a Houston data center; Baxtel lists it as operational and carrier-neutral.
- **Boundary:** Harris County likely; exact address must be confirmed.
- **Recommendation:** **ADD — Built / Medium pending address.**
- **Reason:** The operator itself identifies as a data-center provider.
- **Review questions:** Confirm current facility address and avoid treating marketing capacity as independently measured impact data.

### 20. Serverfarm Houston HTX1

- **Directory evidence:** Baxtel lists a large operational Serverfarm facility and identifies it as the largest Houston facility in its market summary.
- **Boundary:** Houston-area location; exact Harris/Fort Bend parcel must be verified.
- **Recommendation:** **ADD — Built / Medium.**
- **Reason:** Major facility with strong market evidence and material neighborhood relevance.
- **Review questions:** Attach Serverfarm’s official page, verify address, and reconcile the acquired-facility naming history.

### 21. Serverfarm Houston CTX1

- **Directory evidence:** Baxtel lists a large operational Serverfarm facility.
- **Boundary:** Houston-area location; exact county and address require verification.
- **Recommendation:** **ADD — Built / Medium.**
- **Reason:** Keep as a separate building only after confirming it is not the same physical facility as CTX1 DC2.
- **Review questions:** Establish campus/building identity and exact address.

### 22. Serverfarm CTX1 DC2

- **Directory evidence:** Baxtel lists a large operational Serverfarm building/phase.
- **Boundary:** Houston-area location; exact county and address require verification.
- **Recommendation:** **RELATE — Built / Medium.**
- **Reason:** Keep the record, but model it as a related CTX1 campus phase/building unless evidence proves it is physically independent.
- **Review questions:** Confirm whether CTX1 DC2 shares the CTX1 parcel, utility service, and impact footprint.

### 23. Serverfarm HTX2

- **Directory evidence:** Baxtel lists HTX2 as under construction; its market page gives an estimated 100 MW and Q3 2026 launch.
- **Boundary:** Houston-area location; exact parcel must be verified.
- **Recommendation:** **ADD — Under construction / Medium.**
- **Reason:** Clear construction lifecycle in the discovery source and high potential impact.
- **Review questions:** Verify active construction with a permit, developer announcement, county record, or local reporting.

### 24. Serverfarm CTX2

- **Directory evidence:** Baxtel lists CTX2 as construction and planned; its market page gives an estimated 438,000 square feet, 36 MW, and Q3 2026 launch.
- **Boundary:** Houston-area location; a Data Center Map result associates CTX2 with 15555 Cutten Rd, Houston.
- **Recommendation:** **ADD — Under construction / Medium.**
- **Reason:** Specific phase, scale, and lifecycle evidence. Relate it to the Serverfarm campus rather than counting it as an unrelated provider.
- **Review questions:** Confirm address, permits, relationship to CTX1/CTX1 DC2, and current construction status.

### 25. Verizon — 1301 Fannin

- **Directory evidence:** Baxtel lists an operational extra-small Verizon facility at 1301 Fannin.
- **Boundary:** Harris County.
- **Recommendation:** **MERGE/RELATE — Built / Preliminary.**
- **Reason:** Same building as the Netrality 1301 Fannin record. Preserve Verizon as a tenant/operator relationship, not a separate physical site by default.
- **Review questions:** Determine whether Verizon operates a distinct facility or network suite within the Netrality building.

### 26. Verizon — 2401 Portsmouth

- **Directory evidence:** Baxtel lists an operational extra-small Verizon facility.
- **Boundary:** Harris County likely; exact address and use need confirmation.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** Retain as a carrier/network candidate pending exact site verification.
- **Review questions:** Confirm address and qualify the facility under Additional Compute.

### 27. Windstream Houston

- **Directory evidence:** Baxtel lists an operational extra-small Windstream carrier facility.
- **Boundary:** Houston/Harris likely; exact address requires review.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** Keep named carrier infrastructure when physically verifiable.
- **Review questions:** Confirm exact address and whether it is a standalone facility or network presence.

### 28. Windstream Sugar Land

- **Directory evidence:** Baxtel lists an operational extra-small Windstream facility in Sugar Land.
- **Boundary:** Fort Bend County likely, but Sugar Land spans Harris and Fort Bend.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** This is within the intended geography if the parcel is in Fort Bend or Harris.
- **Review questions:** Confirm county, address, and physical data-center function.

### 29. 1301 Fannin — Netrality Houston

- **Directory evidence:** Netrality’s official materials identify a Houston facility at 1301 Fannin; Baxtel lists it as operational and planned.
- **Boundary:** Harris County.
- **Recommendation:** **ADD — Built plus Announced expansion / Medium.**
- **Reason:** Strong building/operator evidence. Represent expansion separately if the planned component has a distinct scope.
- **Review questions:** Reconcile Verizon and other tenants without duplicate scoring.

### 30. Switch Houston 2

- **Directory evidence:** Baxtel lists Switch Houston 2 as operational and planned; it is a large carrier-neutral facility.
- **Boundary:** Katy/Houston area; exact county and address must be confirmed.
- **Recommendation:** **ADD — Built plus Announced expansion / Medium.**
- **Reason:** Recognized operator and material facility. Keep the planned component visible as an announcement when independently sourced.
- **Review questions:** Confirm the physical campus and relationship to Switch Houston 3.

### 31. Switch Houston 3

- **Directory evidence:** Baxtel lists Houston 3 as planned.
- **Boundary:** Katy/Houston area; exact county and address must be confirmed.
- **Recommendation:** **ADD — Announced / Preliminary.**
- **Reason:** Retain planned projects under the announced category, clearly marked as not operational.
- **Review questions:** Obtain Switch or permitting evidence and confirm it is not merely a phase of Houston 2.

### 32. DataCanopy Houston

- **Directory evidence:** Baxtel lists an operational extra-small DataCanopy carrier-neutral facility.
- **Boundary:** Houston market; exact address requires verification.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** Named operator and facility, but insufficient location detail in the market summary.
- **Review questions:** Obtain official location and confirm it is a physical facility in the MVP counties.

### 33. Skybox Houston One

- **Directory evidence:** Skybox’s official Houston page and brochure identify Houston One; the public source does not provide a precise street address. Baxtel lists it as operational.
- **Boundary:** Houston/Katy-area approximate point; exact county requires confirmation.
- **Recommendation:** **ADD — Built / Medium, approximate.**
- **Reason:** Already present in the application with explicit uncertainty. Keep the approximate marker and source caveats.
- **Review questions:** Confirm parcel and reconcile possible overlap with Element Critical Houston One.

### 34. Stream Houston — The Woodlands

- **Directory evidence:** Baxtel marks it decommissioned.
- **Boundary:** Montgomery County, outside MVP scope.
- **Recommendation:** **RETAIN RESEARCH ONLY — Decommissioned / Exclude from MVP map.**
- **Reason:** The record is useful for historical completeness but does not belong in the three current-lifecycle map groups.
- **Review questions:** Confirm decommission date and whether a successor facility occupies the site.

### 35. ScaleMatrix Houston

- **Directory evidence:** Baxtel lists an operational extra-small carrier-neutral facility.
- **Boundary:** Houston market; exact county and address require verification.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** Keep as a possible Additional Compute facility until location and operation are confirmed.
- **Review questions:** Obtain operator location and current facility evidence.

### 36. Consolidated Woodlands

- **Directory evidence:** Baxtel lists an operational and planned small carrier facility.
- **Boundary:** The Woodlands is Montgomery County, outside MVP scope.
- **Recommendation:** **RETAIN RESEARCH ONLY — Built plus Announced / Outside MVP.**
- **Reason:** Keep in the regional inventory, but do not show on the Harris/Fort Bend map.
- **Review questions:** Confirm the exact municipality/county and any relationship to other Woodlands records.

### 37. Fibertown Houston

- **Directory evidence:** Baxtel lists an operational small carrier-neutral facility at Houston’s North Freeway cluster.
- **Boundary:** Harris County likely.
- **Recommendation:** **ADD — Built / Preliminary.**
- **Reason:** Specific operator and market identity; likely relevant to the MVP.
- **Review questions:** Confirm exact address and avoid duplicate scoring with the Digital Realty/Cogent North Freeway listings.

### 38. Element Critical Houston One

- **Directory evidence:** Baxtel lists a large operational and planned Element Critical facility; other discovery results associate Houston One with 22000 Franz Road.
- **Boundary:** Katy/Houston area; county must be verified.
- **Recommendation:** **ADD — Built plus Announced expansion / Medium, with merge review.**
- **Reason:** Material campus record, but the relationship to Skybox Houston One needs resolution.
- **Review questions:** Determine whether Skybox and Element Critical are the same campus, predecessor/successor brands, or separate sites.

### 39. Element Critical Houston One — Building 2

- **Directory evidence:** Baxtel lists Building 2 as construction and planned.
- **Boundary:** Same Houston One campus; county must be verified.
- **Recommendation:** **RELATE — Under construction / Preliminary.**
- **Reason:** Keep the phase, but attach it to Houston One and avoid treating it as an unrelated site.
- **Review questions:** Confirm permit, construction status, and whether the building is the same expansion described by Skybox.

### 40. The Houston Bunker

- **Directory evidence:** Baxtel lists an operational medium carrier-neutral facility operated by Westland Bunker.
- **Boundary:** Houston-area location; exact county and address require verification.
- **Recommendation:** **ADD AS CANDIDATE — Built / Preliminary.**
- **Reason:** Named facility with material scale, but location and current ownership need primary confirmation.
- **Review questions:** Confirm operator, address, and relationship to Data Journey Houston Bunker.

### 41. Comcast Willis

- **Directory evidence:** Baxtel lists an operational extra-small Comcast MSO facility.
- **Boundary:** Willis is Montgomery County, outside MVP scope.
- **Recommendation:** **RETAIN RESEARCH ONLY — Built / Outside MVP.**
- **Reason:** Keep for a future broader Houston region, but do not map in Harris/Fort Bend.
- **Review questions:** Confirm whether this is a data center or a cable/network headend.

### 42. TRG Datacenters Houston HOU1

- **Directory evidence:** Baxtel lists an operational small carrier-neutral facility; discovery results identify 2626 Spring Cypress Road, Spring, Texas.
- **Boundary:** Harris County likely; Spring crosses county boundaries and must be verified.
- **Recommendation:** **ADD — Built / Medium pending parcel confirmation.**
- **Reason:** Operator and specific facility identity are credible.
- **Review questions:** Confirm county, exact address, and official TRG page.

### 43. TRG Datacenters HOU2

- **Directory evidence:** Baxtel lists HOU2 as construction and planned.
- **Boundary:** Houston/Spring area; exact county and address require confirmation.
- **Recommendation:** **ADD — Under construction / Preliminary.**
- **Reason:** Retain as a lifecycle record tied to TRG, not as a generic future project.
- **Review questions:** Obtain construction permit or TRG announcement and determine whether it is a separate parcel or HOU1 expansion.

### 44. CleanSpark — Global Hub

- **Directory evidence:** The current Baxtel page uses “Global Hub” and places it in Brazoria County; it is listed as construction, planned, and prospective expansion. The pasted response called this CleanSpark South Park.
- **Boundary:** Brazoria County, outside MVP scope.
- **Recommendation:** **RETAIN RESEARCH ONLY — Announced/Under construction / Outside MVP.**
- **Reason:** Keep the identity discrepancy visible rather than choosing between aliases. Do not map it in the current counties.
- **Review questions:** Obtain the project’s official name, exact parcel, construction evidence, and relationship to any South Park or Center Three names.

### 45. CleanSpark — South Ridge

- **Directory evidence:** The current Baxtel page uses “South Ridge” and lists it in Sealy, Texas as construction and planned. The pasted response called this CleanSpark Center Three.
- **Boundary:** Sealy is outside the Harris/Fort Bend MVP area; exact county likely Austin or Waller.
- **Recommendation:** **RETAIN RESEARCH ONLY — Announced/Under construction / Outside MVP.**
- **Reason:** Keep the alias conflict for review, but do not map outside the boundary.
- **Review questions:** Confirm project name, address, county, and whether it is a Houston-market classification only.

### 46. Cipher Digital — Milsing

- **Directory evidence:** Baxtel lists an extra-large HPC facility as construction and planned, with an estimated 100 MW and Q4 2027 launch.
- **Boundary:** Houston-market classification, but exact county and site need verification.
- **Recommendation:** **ADD AS ANNOUNCED CANDIDATE — Announced / Preliminary.**
- **Reason:** Material HPC project and relevant shadow-announced record, but the location and primary evidence need confirmation before mapping.
- **Review questions:** Identify Milsing’s street address, county, permit, developer, and relationship to Houston market boundaries.

### 47. ViVaVerse — Viva Center

- **Directory evidence:** Baxtel lists an extra-large facility as operational and planned. Its summary identifies a major data-center expansion in Harris County near Houston.
- **Boundary:** Harris County likely; exact parcel required.
- **Recommendation:** **ADD — Built plus Announced expansion / Preliminary.**
- **Reason:** High-impact candidate that should not be omitted. Its relationship to Serverfarm CTX2 or another campus must be resolved.
- **Review questions:** Obtain the site plan, exact address, operator/developer relationship, and lifecycle evidence.

### 48. ECL — TerraSite-TX1

- **Directory evidence:** Baxtel lists an extra-large HPC facility as construction and planned, with an estimated 50 MW and Q1 2026 launch.
- **Boundary:** Houston-market classification; exact county and parcel unconfirmed.
- **Recommendation:** **ADD AS ANNOUNCED/CONSTRUCTION CANDIDATE — Preliminary.**
- **Reason:** Keep because it is a material compute project, but do not assign a final boundary or lifecycle label until the primary site evidence is found.
- **Review questions:** Confirm whether construction actually began, identify county/address, and obtain ECL or permit documentation.

### 49. ECL — Beaumont

- **Directory evidence:** Baxtel lists the site as planned.
- **Boundary:** Beaumont is Jefferson County, outside MVP scope.
- **Recommendation:** **RETAIN RESEARCH ONLY — Announced / Outside MVP.**
- **Reason:** Keep in the broader regional inventory, not the Harris/Fort Bend map.
- **Review questions:** Confirm project status and exact location.

### 50. Data Journey — Houston Bunker

- **Directory evidence:** Baxtel lists an operational and planned large carrier-neutral site and states that Data Journey acquired The Houston Bunker site in 2024.
- **Boundary:** Houston-area location; exact county and address require verification.
- **Recommendation:** **MERGE/RELATE — Built plus Announced expansion / Preliminary.**
- **Reason:** Strong evidence that this is related to The Houston Bunker, not an independent physical site. Preserve ownership history and planned expansion.
- **Review questions:** Confirm acquisition, current operator, and whether the expansion has a separate building/permit.

### 51. Dataprana — La Marque

- **Directory evidence:** Baxtel lists an operational medium HPC facility in La Marque.
- **Boundary:** Galveston County, outside MVP scope.
- **Recommendation:** **RETAIN RESEARCH ONLY — Built / Outside MVP.**
- **Reason:** Keep for the broader regional list but do not map in the current counties.
- **Review questions:** Confirm whether this is truly Houston-market relevant or should be a separate Gulf Coast market.

### 52. Dataprana — Galveston County

- **Directory evidence:** Baxtel lists an operational and planned large HPC facility.
- **Boundary:** Galveston County, outside MVP scope.
- **Recommendation:** **RETAIN RESEARCH ONLY — Built plus Announced / Outside MVP.**
- **Reason:** Same boundary treatment as La Marque.
- **Review questions:** Determine whether this is a separate site or phase of the La Marque operation.

### 53. Barrio — Project Blue Beam

- **Directory evidence:** Baxtel marks the project “In Doubt” and its construction summary shows zero MW.
- **Boundary:** Exact location is unresolved.
- **Recommendation:** **KEEP FOR REVIEW — Announced / In doubt.**
- **Reason:** This is precisely the type of shadow-announced record the project should preserve, but it must be labeled in doubt and should not receive a confident exact map point.
- **Review questions:** Find the original announcement, proposed county/address, current status, and evidence that it is a data-center project rather than a stale or misclassified record.

### 54. Iozera — Houston, Texas

- **Directory evidence:** Baxtel lists a small carrier-neutral facility as construction and operational.
- **Boundary:** Houston market; exact address and county require verification.
- **Recommendation:** **ADD AS CANDIDATE — Built plus Under construction / Preliminary.**
- **Reason:** The conflicting lifecycle labels require preservation rather than deletion.
- **Review questions:** Obtain operator location, determine whether construction refers to expansion, and verify the physical site.

### 55. Viridien — Brenham, Texas

- **Directory evidence:** Baxtel lists a small enterprise facility as planned.
- **Boundary:** Brenham is Washington County, outside MVP scope.
- **Recommendation:** **RETAIN RESEARCH ONLY — Announced / Outside MVP.**
- **Reason:** Keep for regional completeness but do not map in Harris/Fort Bend.
- **Review questions:** Confirm the exact project and whether it belongs in a broader Central/Southeast Texas market rather than Houston.

## Immediate Map Candidate Set

The first expansion should not publish all 55 as equally verified. The recommended first pass is:

### Built candidates

HOU1, Westway Park II, Westway Park III, Houston Galleria, Digital Realty North Freeway, Fibertown, Equinix HO1, Quasar, Serverfarm HTX1, Serverfarm CTX1, 1301 Fannin/Netrality, Switch Houston 2, TRG HOU1, EdgeConneX Houston, Element Critical Houston One, Skybox Houston One, and the smaller carrier/network records after exact-address verification.

### Under-construction candidates

Serverfarm HTX2, Serverfarm CTX2, TRG HOU2, Element Critical Houston One Building 2, and any of ViVaVerse, ECL TerraSite-TX1, or Iozera that can be confirmed inside the MVP boundary.

### Announced or shadow-announced candidates

Switch Houston 3, expansions attached to 1301 Fannin, EdgeConneX, Switch Houston 2, Element Critical Houston One, ViVaVerse, Cipher Milsing, ECL TerraSite-TX1, Iozera’s unresolved phase, and Barrio Project Blue Beam.

## Recommended Data Model Treatment

The existing `publicationStatus` field should not be used to hide every uncertain record. Use separate fields:

- `lifecycleStatus`: `built`, `construction`, or `announced`
- `evidenceConfidence`: `high`, `medium`, `preliminary`, or `in_doubt`
- `locationPrecision`: `exact`, `approximate`, or `candidate`
- `publicationStatus`: `published`, `candidate`, `archived`, or `excluded`
- `campusSlug` or `parentFacilitySlug` for buildings, phases, and aliases
- `boundaryStatus`: `inside_mvp`, `outside_mvp`, or `unknown`

This lets the map show a clearly labeled uncertain announced project without pretending that it is a verified built facility.

## Open Review Queue

The following issues deserve joint review before final publication:

1. Skybox Houston One versus Element Critical Houston One and Building 2.
2. Serverfarm CTX1 versus CTX1 DC2 and CTX2 campus relationships.
3. 777 Walker operator listings versus the Two Shell Plaza building record.
4. 1301 Fannin Verizon versus Netrality relationships.
5. Cogent, Digital Realty, and Fibertown North Freeway overlap.
6. CleanSpark alias mismatch between the supplied list and Baxtel’s current Global Hub/South Ridge names.
7. ViVaVerse relationship to Serverfarm or other Harris County campuses.
8. ECL TerraSite-TX1 and Cipher Milsing exact counties and addresses.
9. Barrio Project Blue Beam’s original announcement and current status.
10. Whether very small carrier rooms should be shown by default or only under Additional Compute.

## Conclusion

The supplied list is a strong discovery starting point, but it is not a ready-to-publish inventory. The correct next step is to preserve the broad set, add credible Harris/Fort Bend records as explicitly uncertain candidates, and resolve campus duplicates before assigning independent impact scores. The two current records should be treated as the verified demo subset, not as the market total.
