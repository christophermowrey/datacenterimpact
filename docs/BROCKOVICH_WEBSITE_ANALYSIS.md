# Brockovich Data Center Reporting Analysis

**Reviewed:** 26 Jul 2026  
**URL:** https://brockovichdatacenter.com/

## Executive Summary

Brockovich Data Center Reporting is stronger than the current Data Center Impact demo at communicating urgency, explaining why the subject matters, and giving visitors several ways to continue exploring. Its main weakness for our use case is the absence of an address-first lookup and a normalized, local impact result.

The site is a static, advocacy-oriented information hub. It uses a narrative homepage, a national map, educational pages, news, community reporting, FAQs, facts-versus-myths content, and a noise simulation page. The map is not an authoritative inventory: its markers are hard-coded in page JavaScript and many notes cite a mixture of company releases, news, and general reporting.

## What It Does Better

### Immediate emotional framing

The hero immediately frames AI data centers as a community issue. It uses a large editorial headline, a person/advocate identity, a strong quote, and language about communities being affected before public awareness catches up. The visitor understands the site’s purpose before reaching the map.

### Clear content journey

The navigation offers Map, Statistics, Communities & Legislation, Photos, News, FAQ, Facts & Myths, Noise Simulation, and Report an Issue. This creates multiple entry points for users who do not know exactly what they want yet.

### Useful map layering

The map distinguishes operational, under-construction, proposed, and community-reported locations. It also uses a heat layer for reports. The legend is visible and the map is explained in plain language.

### Community reporting

The reporting form gives residents a way to contribute photos, concerns, contact information, and issue descriptions. This creates a feedback loop instead of treating the inventory as finished.

### Educational packaging

The site has dedicated pages for concerns, legislation, news, FAQs, facts and myths, and noise. It does not force every explanation into a map popup.

### Search and social metadata

The page includes title and description metadata, canonical URL, Open Graph tags, Twitter card tags, organization/site/page structured data, and FAQ structured data. It also includes a favicon and social-share image.

### Simple technical stack

The map uses Leaflet 1.9.4, Leaflet.heat 0.2.0, and Carto-hosted basemap resources. The implementation is straightforward and likely inexpensive to host.

## What We Should Adopt

- Address-first homepage funnel
- Strong AI-data-center acquisition language
- A large editorial hero before the map
- Dedicated learning and methodology pages
- Separate map layers for Built, Under construction, Announced, and community reports
- A visible legend and explanation of approximate locations
- Community correction/reporting workflow
- Social metadata, favicon, share image, and structured data
- Plain-language concern cards for electricity, water, air, noise, traffic, land use, and waste
- A page that states what the map does not cover

## What We Should Not Copy Blindly

- Hard-coded national marker data without a normalized inventory
- Treating every AI-related claim as verified
- Presenting maximum water-use or pollution statements as universal outcomes
- Mixing community reports with facility facts without separate evidence states
- Using a single directory count as the market total
- Treating a heat map as a measured health or property-value risk map
- Relying on advocacy language where a claim needs a source and uncertainty label

## Technical and Content Findings

### Map implementation

The page loads Leaflet from `unpkg.com`, Leaflet.heat from `unpkg.com`, and references Carto basemap infrastructure. Facility markers are stored in a JavaScript array with latitude, longitude, status, note, and source fields. The map is approximately 560 pixels tall and is followed by a note that smaller or unannounced facilities may be missing.

### Data limitations

The marker dataset appears curated around major U.S. AI facilities rather than being a complete directory. It includes several exact locations, but many descriptions are derived from secondary reporting. Community-reported locations are intentionally approximate and should not be treated as facility records.

### Accessibility and performance

The site has a skip link, semantic headings, ARIA labels, image alt text, responsive layouts, and lazy loading for some images. It also loads several external fonts and scripts and includes a large inline page. We should preserve the accessibility patterns while keeping our Next.js bundle and map loading smaller.

### Privacy and analytics

The site includes Google Analytics and a community-reporting form. This is materially different from the current local-only demo. If we later store searches or reports, the privacy policy, retention, consent, deletion, and security model must be explicit.

## Product Direction For Data Center Impact

The homepage should become an address-checking tool with advocacy-level clarity but evidence-level discipline.

Recommended headline rotation:

- `Is an AI data center affecting your home?`
- `Is an AI data center coming to your neighborhood?`
- `Check what’s near your address.`

The first screen should contain the address field and CTA. Supporting explanations should move to the header, `/learn`, `/sources`, and facility pages. After a search, the site should scroll to the map, show the searched location marker, and present nearby Built, Under construction, and Announced records.

The homepage may say **AI data center** because that is the public acquisition language. The map and inventory should continue to say **data center** because the useful answer includes facilities that do not publicly disclose AI workloads.

## Source Strategy

Data Center Map, Baxtel, and similar B2B directories should be used as high-value discovery and address sources. They should not be the sole truth. Our normalized inventory becomes the source of truth and stores every external listing as a source record with:

- Source URL
- Publisher
- Access time
- Captured title and visible description
- Address and coordinates as published
- Operator and facility name as published
- Lifecycle/status as published
- Source snapshot or archived capture when permitted
- Hash or content fingerprint for change detection
- Review status and reviewer notes

This matters because directory listings can change, disappear, be sold, or be corrected. A removed source must not erase the historical basis for a published record.

## Decision

Adopt Brockovich’s communication and content architecture, not its hard-coded inventory model. Keep Data Center Impact’s normalized records, source provenance, uncertainty ranges, distance-sensitive screening, and local search result as the differentiator.
