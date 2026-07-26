# UI Test Checklist

Run this checklist in Chrome and one mobile-sized browser window after each UI change. The application is local-only and demo data must remain labeled as demo data.

## Startup

- [ ] `docker compose up -d --build` completes without errors.
- [ ] `docker compose ps` shows `web` running and `db` healthy.
- [ ] `http://localhost:3000` loads the Data Center Impact page.
- [ ] `/open-map` loads the standalone OpenStreetMap view.
- [ ] `/about` explains coverage, sources, scoring, and limitations.
- [ ] `/privacy` explains that search storage is disabled by default.
- [ ] Refreshing the page stays on Data Center Impact.
- [ ] `docker compose down` stops the project without affecting other Docker projects.

## Map

- [ ] Dragging an empty map area pans the map.
- [ ] Releasing the pointer stops panning.
- [ ] Scrolling over the map zooms in and out.
- [ ] Scrolling over the results list does not zoom the map.
- [ ] Zoom buttons change the map scale and remain bounded.
- [ ] Browser location requests permission only after the location button is clicked.
- [ ] Clicking a facility pin selects the matching result and card.
- [ ] The map legend identifies Built, Under construction, Announced, and the searched address.
- [ ] Facility pins remain easy to select at the default zoom and are visibly larger than the searched-address pin.
- [ ] Map card links open the matching facility detail page.

## Filters and search

- [ ] All, Built, Under construction, and Announced filters update both map pins and results.
- [ ] Smaller carrier and network facilities are shown by default and can be toggled off.
- [ ] Searching `Houston`, `Katy`, or a facility name updates the visible records.
- [ ] Typing `Pasadena` shows Pasadena, Texas first plus out-of-state alternatives.
- [ ] Selecting a suggestion confirms the full location before changing the map.
- [ ] Editing a confirmed location clears the old location and distances.
- [ ] Selecting a new address recalculates facility distances and nearest-first ordering.
- [ ] A location outside the current Houston-area envelope clearly explains that coverage is expanding.
- [ ] An unresolved exact address with a recognizable city explains that the map provider lacked the street address and offers the city-area fallback.
- [ ] An unresolved search with no recognizable city tells the user to add a city, state, or ZIP code.
- [ ] Search feedback appears after submit.
- [ ] The search action is labeled Address Impact.
- [ ] Clear removes the search state.
- [ ] Successful address search scrolls to the map and leaves the searched-location pin visually clear.
- [ ] Searching does not auto-select the nearest facility.
- [ ] Clicking a selected facility again deselects its map card.
- [ ] Deselecting a facility after an address search returns the map focus to the searched address.
- [ ] A no-match search displays a useful empty state.

## Facility details

- [ ] Facility detail page loads from a map card link.
- [ ] Unknown facility slugs display the not-found page.
- [ ] Status, class, Community Impact score range with `/100`, evidence quality, verification date, timeline, and limitations are visible.
- [ ] Listed power shows an approximate Texas-home equivalent and identifies capacity versus actual consumption.
- [ ] Back to map returns to the home page.

## Accessibility and responsive behavior

- [ ] Keyboard Tab reaches search, filters, map controls, pins, result cards, and detail links.
- [ ] Focus states are visible.
- [ ] Buttons have labels or visible text.
- [ ] Layout remains usable below 480px wide.
- [ ] Information is not conveyed by color alone.
