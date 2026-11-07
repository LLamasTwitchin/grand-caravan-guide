# 2012 Dodge Grand Caravan Interactive Learning Lab

A self-contained troubleshooting and electrical learning guide with a real-time WebGL vehicle scene.

- Orbit, pan, zoom, reset, and auto-orbit the approximate 3D minivan model.
- Switch between exterior and under-hood learning views; select labeled components and trace a simplified training path.
- Work through four clearly simulated diagnostic cases with meter, scan, wiring, repair, and verification interactions.
- Search 58 user-screenshot fuse references and consult the separate Mopar J12 cavity reference. Each row shows the screenshot index and the J/M cavity as different labels, and the printable TIPM PDF is linked from the fuse section.
- Read expanded symptom guides, including a sourced limp-home guide that separates owner-guide facts from possibilities, plus circuit lessons, owner safety notes, and print/save the guide as PDF.
- Open functional diagrams for power distribution, starting and charging, cooling, HVAC, and lighting. Each diagram says it is not an OEM wiring diagram.
- Read the NHTSA recall snapshot for this model year. Campaigns are listed with their limits. They are not a ranking of common problems.
- Walk a no-crank, rear-blower, or reopening-fuse sequence; take a practice quiz that stays on this browser; inject a simulated open fuse, open return, or high-resistance connection; and read component roles that are not connector pinouts.
- Filter the fuse list by J/M cavity, amperage, and circuit group. Save favorites and walk bookmarks in this browser only.
- Turn on the x-ray shell, high contrast, or a larger type size. Copy a link to a section. Install the page for an offline cache of the guide files.

## Accuracy and limits

The model is procedural educational geometry, not factory CAD or exact trim representation. Component placement, wiring paths, meter readings, faults, and scan results are illustrative. The guide does not connect to a vehicle. Use the vehicle's fuse-cover label and official service information for repairs. Screenshot lookup numbers are kept separate from the molded J/M fuse cavity labels.

The active profile is the 2012 Dodge Grand Caravan, with trim and options unverified. See [VEHICLE_PROFILE_SCHEMA.md](./VEHICLE_PROFILE_SCHEMA.md) for the versioned structure used to add future vehicle profiles. No VIN or owner documents are included in this repository.

The WebGL viewer and OrbitControls are bundled locally under `assets/`, so the page does not load third-party scripts at runtime. See [third-party notices](./assets/THIRD_PARTY_NOTICES.md) and the included MIT license.

Primary vehicle reference: [2012 Dodge Grand Caravan Owner Guide](https://vehicleinfo.mopar.com/assets/publications/en-us/Dodge/2012/Grand_Caravan/328.pdf).

## Live guide

https://llamastwitchin.github.io/grand-caravan-guide/

Check the screenshot-index and cavity split with `node scripts/check-guide.js`.

Created with OpenAI Codex for LLamasTwitchin. Extended in this repository without replacing the learning lab.

