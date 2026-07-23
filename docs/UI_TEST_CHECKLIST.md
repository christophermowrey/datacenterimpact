# UI Test Checklist

Run this checklist in Chrome and one mobile-sized browser window after each UI change. The application is local-only and demo data must remain labeled as demo data.

## Startup

- [ ] `docker compose up -d --build` completes without errors.
- [ ] `docker compose ps` shows `web` running and `db` healthy.
- [ ] `http://localhost:3000` loads the Gridline Houston page.
- [ ] Refreshing the page stays on Gridline Houston.
- [ ] `docker compose down` stops the project without affecting other Docker projects.

## Map

- [ ] Dragging an empty map area pans the map.
- [ ] Releasing the pointer stops panning.
- [ ] Scrolling over the map zooms in and out.
- [ ] Scrolling over the results list does not zoom the map.
- [ ] Zoom buttons change the map scale and remain bounded.
- [ ] Browser location requests permission only after the location button is clicked.
- [ ] Clicking a facility pin selects the matching result and card.
- [ ] Map card links open the matching facility detail page.

## Filters and search

- [ ] All, Operational, Under construction, and Announced / planned filters update both map pins and results.
- [ ] Additional compute is hidden by default and appears when enabled.
- [ ] Searching `Houston`, `Katy`, or a facility name updates the visible records.
- [ ] Typing `Pasadena` shows Pasadena, Texas first plus out-of-state alternatives.
- [ ] Selecting a suggestion confirms the full location before changing the map.
- [ ] Editing a confirmed location clears the old location and distances.
- [ ] Selecting a new address recalculates facility distances and nearest-first ordering.
- [ ] An outside-coverage result clearly says it is outside Harris + Fort Bend coverage.
- [ ] Search feedback appears after submit.
- [ ] Clear removes the search state.
- [ ] A no-match search displays a useful empty state.

## Facility details

- [ ] Facility detail page loads from a map card link.
- [ ] Unknown facility slugs display the not-found page.
- [ ] Status, class, confidence, score range, verification date, timeline, and disclaimer are visible.
- [ ] Back to map returns to the home page.

## Accessibility and responsive behavior

- [ ] Keyboard Tab reaches search, filters, map controls, pins, result cards, and detail links.
- [ ] Focus states are visible.
- [ ] Buttons have labels or visible text.
- [ ] Layout remains usable below 480px wide.
- [ ] Information is not conveyed by color alone.
