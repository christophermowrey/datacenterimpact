# Neighborhood Impact Methodology

This is an initial transparent scoring method for local development. It is a screening tool, not a health model, property-value prediction, legal opinion, or environmental impact assessment.

## Distance model

Distance is not a standalone impact category. It is a category-specific modifier. The model uses a screening curve for local effects:

```text
decay(distance) = 1 / (1 + (distance / characteristic_distance)^power)
```

```text
local(distance) = 1 / (1 + (distance / characteristic_distance)^power)
factor(distance) = regional_floor + (1 - regional_floor) * local(distance)
```

The model uses different characteristic distances because effects do not travel in the same way:

- **Water:** characteristic distance 5 miles, power 0.35, regional floor 0.70. Water availability, watershed stress, utility capacity, and discharge effects are not inverse-square neighborhood effects.
- **Electricity/grid:** characteristic distance 5 miles, power 0.60, regional floor 0.80. ERCOT and utility planning effects remain significant well beyond a facility parcel.
- **Air/generation:** characteristic distance 2 miles, power 1.1, no regional floor. This is a screening approximation of atmospheric dispersion, not an inverse-square law.
- **Sound:** characteristic distance 0.5 miles, power 1.35, no regional floor. Point-source sound is commonly assessed using logarithmic level changes and propagation losses, including approximately 6 dB per doubling distance under ideal free-field conditions.
- **Vibration:** characteristic distance 0.25 miles, power 2, no regional floor. Ground transmission is site- and frequency-dependent and requires an engineering measurement for a real claim.
- **Land/wildlife:** characteristic distance 5 miles, power 1, representing diminishing site-context relevance rather than a physical pollutant plume.
- **Facility scale/site context:** characteristic distance 5 miles, power 1, with a small weight. Scale changes the amount of equipment and infrastructure that may be present but is not itself a neighborhood exposure.

The regional floors are not a claim that a particular home receives electricity or water from a particular facility. Houston electricity delivery is provided through local transmission and distribution utilities such as CenterPoint Energy, while ERCOT manages the interconnected Texas grid and wholesale system. A large load can therefore have system-wide planning, generation, transmission, or rate relevance even when the searched address is not near the facility. The baseline sources are [ERCOT](https://www.ercot.com/about) and [CenterPoint Energy](https://www.centerpointenergy.com/en-us/corporate/about-us).

These are conservative comparison proxies. They are not replacements for acoustic, air-dispersion, hydrologic, traffic, geotechnical, or utility studies.

## Lower and upper bounds

Every facility profile stores lower and upper normalized component inputs from 0 to 1.

- Lower bound: supported facts and conservative known inputs.
- Upper bound: supported facts plus plausible high-impact proxies for documented but incomplete systems.
- Unknowns widen the range and lower confidence; they do not automatically become zero or maximum risk.
- A high upper bound requires a credible basis, such as a published load, generator/fuel specification, permit, utility filing, or facility-scale comparison.

The weighted components are water and cooling (25), electricity and grid (20), air pollution and generation (20), sound (15), vibration (10), land/wildlife (5), and facility scale/site context (5). Zoning/process and traffic are retained as evidence and context fields but are not part of this physical-impact score. Health is not scored as an independent outcome because this project does not have exposure or epidemiological data; air, water, sound, and vibration are the measurable evidence categories instead.

## Scientific basis and limits

The distance functions are screening approximations informed by the methods used in environmental and engineering studies; they are not substitutes for those studies:

- [EPA Air Quality Dispersion Modeling](https://www.epa.gov/scram/air-quality-dispersion-modeling) explains that pollutant concentration modeling uses emissions plus meteorological inputs and downwind receptors. This is why the air category is not modeled as a simple inverse-square rule.
- [EPA Guideline on Air Quality Models, Appendix W](https://www.epa.gov/scram/appendix-w-guideline-air-quality-models) documents the regulatory modeling framework used for source dispersion and receptor concentrations.
- [ISO 9613-2 Acoustics](https://www.iso.org/standard/20649.html) is the recognized engineering standard for outdoor sound attenuation. The public score does not claim ISO compliance or a property-line measurement; it uses the principle that sound propagation differs from water/grid effects.
- [FTA Noise and Vibration Impact Assessment](https://www.transit.dot.gov/research-innovation/fta-noise-and-vibration-impact-assessment) describes source, propagation, receptor, and vibration assessment methods. Data-center vibration remains an evidence gap until site-specific measurements are available.
- [Uptime Institute: Measuring data-center water usage](https://journal.uptimeinstitute.com/measuring-data-center-water-usage/) describes WUE and the importance of separating cooling-system water use from broader facility water use. Facility water estimates use WUE where available.

For a water proxy, the reproducible conversion is:

```text
annual gallons = IT load kW × operating hours × WUE L/kWh ÷ 3.78541
```

Nameplate capacity is not actual average load. When utilization, cooling type, or WUE is unknown, the site receives a numerical range with those assumptions exposed rather than a single invented value.

## Source treatment

Operator brochures are useful for capacity, design, fuel, and marketing claims, but they are not independent measurements of neighborhood impacts. Each fact should retain its source, access date, precision, and whether it is measured, reported, estimated, or proxied.

## Community metric reporting

Every facility profile presents the same community-facing categories before technical specifications:

- Electricity and grid
- Water consumption
- Air pollution and onsite generation
- Sound pollution
- Vibration
- Construction and traffic
- Land and flood context

Each metric has a hidden evidence-state tooltip. `Reported` means a facility-specific source states the value. `Estimated` means the value is calculated from reported inputs. `Proxy` means a numerical benchmark or range from comparable equipment or facilities and must never be described as a site measurement. `Not publicly disclosed` means the review did not find a defensible facility-specific value. Unknown values remain visible and do not become zero by default.

Current benchmark proxies are deliberately broad: water may use a 0.0–2.0 L/kWh screening range when no facility WUE is available, and sound may use a 55–85 dBA equipment-boundary range when no site study is available. These ranges describe the basis of a screening assumption, not a predicted property-line condition. Facility-specific permits, acoustic studies, emissions inventories, water records, or vibration measurements replace proxies when found.

The canonical facility-page score uses the same impact engine as the map at a fixed illustrative distance of 0.25 miles. When a searched address is active, the map recalculates the score using the actual searched-location distance. This keeps the map and detail page ranges equal when no address context is selected while making address-specific results explicit.
