# Vehicle profile schema, version 1

The guide is organized as a shared viewer with one or more `vehicleProfiles`. The first profile is `dodge-grand-caravan-2012`. It is the default (`body[data-vehicle-profile]`) and remains the only selectable profile until another fully reviewed profile is integrated. Do not add a selector for a profile that is not present.

## Required fields

```js
{
  schemaVersion: 1,
  id: "make-model-year",             // stable, lowercase slug
  identity: {
    year: 2012, make: "Dodge", model: "Grand Caravan",
    market: null, trim: null, powertrain: null
  },
  coverage: {
    ownerGuide: "exact publication name / edition",
    userFuseImages: true, serviceManual: false,
    trimVerified: false,
    options: "State what is unknown; preserve if-equipped qualifiers"
  },
  model: {
    kind: "three-webgl-procedural",
    geometry: "photo-referenced procedural exterior calibrated to published body and axle dimensions, plus approximate selectable under-hood and underbody massing; no factory CAD",
    proportions: { width: 1.71, length: 4.4, height: 1.47 }, // scaled from 2012 Dodge published exterior dimensions
    palette: { body: "#641116" }, // approximate Redline 2 Coat Pearl from user-provided report
    cameraViews: {
      exterior: { position: [4.5, 2.8, -5.4], target: [0, .82, 0] },
      underside: { position: [3.3, -2.2, -2.2], target: [0, .32, 0] }
    },
    scenes: ["exterior", "underhood", "underside", "exploded"]
  },
  data: {
    fuses: [], groupInfo: {}, guides: [],
    components: {}, scenarios: {}
  },
  provenance: {
    manual: "direct primary-source URL",
    screenshots: "user-supplied source description"
  },
  trainingDataSynthetic: true
}
```

## Record conventions

- A fuse record includes `visualIndex` (or the existing `n` field), `blockId`, and `cavity` as separate values. Do not infer one from another. Different vehicles may have separate underhood and instrument-panel number sequences. For the current source set, screenshot references #1–58 and Mopar cavity J12 are deliberately distinct.
- Add source and confidence metadata at the record level when the data is not uniformly sourced, e.g. `{sourceId:"owner-guide", page:"109", confidence:"manual-confirmed"}` or `{sourceId:"user-image-2", confidence:"visual-transcription"}`. A user screenshot is not automatically an OEM physical-location diagram.
- Mark optional equipment as conditional. Unknown market, trim, engine, and option fields stay `null` or “unknown” until a document tied to that configuration supports them. A VIN alone must not be used to assert equipment or eligibility.
- Symptom guides are general owner-level observations and should state what they cannot prove, a result-dependent next step, and when to stop. Cite vehicle-specific limits to the relevant owner publication.
- Simulator scenarios must be explicitly synthetic (`trainingDataSynthetic: true`). Every reading, failure cause, scan result, wiring path, and repair is invented for practice, never telemetry or an OEM diagnostic threshold. Do not include invented DTCs.
- Components are approximate selectable labels/roles/positions for the model. Do not represent connector pins, wire colors, internal construction, or actual OEM routing without sourced service data and careful review.
- A personal repair report or historic price quote is a case-study artifact, not authoritative service data. Keep it as a separately labeled source with author/date/context and verify each technical claim before turning it into a reusable profile fact.

## Adding a profile

1. Gather the exact year/make/model owner publication and any vehicle fuse images. Record market/trim/powertrain only when those records establish them.
2. Transcribe references with labels and ratings, then independently compare against primary source pages. Preserve the original picture index separately from molded cavity codes.
3. Add owner-guide citations, per-feature uncertainty, and coverage notes. Keep all unverified fields explicit.
4. Add approximate model component definitions and only sourced component roles. Keep one generic geometry/template until legitimate profile geometry data exists; do not imply exact factory CAD.
5. Add symptom guides and synthetic training scenarios only with the boundary labels above.
6. Add the profile object to `vehicleProfiles`; run shared search, guide, print, and model rendering from the active profile. Only expose vehicle switching after both profiles have complete, reviewed data and all controls consume the selected profile.

## Current profile coverage

The embedded 2012 Dodge Grand Caravan profile uses the linked Mopar Owner Guide, a secondary StartMyCar fuse-table cross-check, the user-supplied fuse reference screenshots and exterior photos, and clearly labeled general training content. Its locally bundled Three.js viewer has a photo-referenced body contour, cut side-window openings, wheel arches and axle stations calibrated to published wheelbase/overhang/track dimensions, reference-size tires, split-spoke wheels, and the published 2/2/3 seating layout, plus an exploded structure view, wireframe overlay, selectable approximate under-hood and underside parts, a label toggle, and Canvas fallback. The underbody scene shows generic FWD transaxle/half-shafts, exhaust, tank, and suspension massing informed by the published FWD, MacPherson front, and twist-beam rear layout; it is not a repair/lifting diagram or exact OEM routing. The SE trim and Redline 2 Coat Pearl color are taken from the user-provided vehicle-report screenshot and have not been independently decoded; wheel option and exact body configuration are not confirmed by VIN. The model surfaces and parts remain educational approximations, not factory CAD. It does not provide service-manual wiring, connector pinouts, live diagnostic codes, or vehicle telemetry. See `assets/THIRD_PARTY_NOTICES.md` for bundled-runtime licensing.
