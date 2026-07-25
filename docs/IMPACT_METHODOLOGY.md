# Neighborhood Impact Methodology

This is an initial transparent scoring method for local development. It is a screening tool, not a health model, property-value prediction, legal opinion, or environmental impact assessment.

## Distance model

Each local category uses a bounded decay curve:

```text
decay(distance) = 1 / (1 + (distance / characteristic_distance)^power)
```

Local parcel contributions become zero beyond five miles. Scores do not become zero: every result includes a minimal 1-2 point regional electricity baseline. The model uses different characteristic distances because effects do not travel in the same way:

- Noise: fast decay, reflecting point-source sound behavior and barriers that must be measured for a real site.
- Air and backup generation: moderate decay proxy; weather, stack height, wind, operation, and terrain can dominate actual concentration.
- Vibration: expected fast decay, but no claim is made without measurements or an engineering study.
- Construction traffic: moderate decay and route-sensitive; distance alone is not sufficient.
- Land use and proximity: slower decay because visibility, setbacks, schools, homes, and parcel context can remain relevant across a broader local area.
- Electricity and water: local contributions are distance-decayed for screening, while regional system effects are tracked separately and are not assumed to disappear at five miles.

The baseline is intentionally small and is not a claim that a particular home receives electricity from a particular facility. Houston electricity delivery is provided through local transmission and distribution utilities such as CenterPoint Energy, while ERCOT manages the interconnected Texas grid and wholesale system. A large load can therefore have system-wide planning, generation, transmission, or rate relevance even when the searched address is not near the facility. The baseline sources are [ERCOT](https://www.ercot.com/about) and [CenterPoint Energy](https://www.centerpointenergy.com/en-us/corporate/about-us).

These are conservative comparison proxies. They are not replacements for acoustic, air-dispersion, hydrologic, traffic, geotechnical, or utility studies.

## Lower and upper bounds

Every facility profile stores lower and upper normalized component inputs from 0 to 1.

- Lower bound: supported facts and conservative known inputs.
- Upper bound: supported facts plus plausible high-impact proxies for documented but incomplete systems.
- Unknowns widen the range and lower confidence; they do not automatically become zero or maximum risk.
- A high upper bound requires a credible basis, such as a published load, generator/fuel specification, permit, utility filing, or facility-scale comparison.

The weighted local components are proximity and scale (20), electricity and grid (20), generation and air (15), water and cooling (15), noise and vibration (15), construction and traffic (5), and land-use sensitivity (5). Regional electricity, water, transmission, pipeline, rate, and eminent-domain matters are separate effects.

## Source treatment

Operator brochures are useful for capacity, design, fuel, and marketing claims, but they are not independent measurements of neighborhood impacts. Each fact should retain its source, access date, precision, and whether it is measured, reported, estimated, or proxied.
