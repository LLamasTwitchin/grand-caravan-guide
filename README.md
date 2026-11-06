# 2012 Dodge Grand Caravan Interactive Learning Lab

A self-contained troubleshooting and electrical learning guide with a real-time WebGL vehicle scene.

- Orbit, pan, zoom, reset, and auto-orbit the approximate 3D minivan model.
- Switch between exterior and under-hood learning views; select labeled components and trace a simplified training path.
- Work through four clearly simulated diagnostic cases with meter, scan, wiring, repair, and verification interactions.
- Search 58 user-screenshot fuse references and consult the separate Mopar J12 cavity reference.
- Read expanded symptom guides, circuit lessons, owner safety notes, and print/save the guide as PDF.

## Accuracy and limits

The model is procedural educational geometry, not factory CAD or exact trim representation. Component placement, wiring paths, meter readings, faults, and scan results are illustrative. The guide does not connect to a vehicle. Use the vehicle's fuse-cover label and official service information for repairs. Screenshot lookup numbers are kept separate from the molded J/M fuse cavity labels.

The active profile is the 2012 Dodge Grand Caravan, with trim and options unverified. See [VEHICLE_PROFILE_SCHEMA.md](./VEHICLE_PROFILE_SCHEMA.md) for the versioned structure used to add future vehicle profiles. No VIN or owner documents are included in this repository.

The WebGL viewer and OrbitControls are bundled locally under `assets/`, so the page does not load third-party scripts at runtime. See [third-party notices](./assets/THIRD_PARTY_NOTICES.md) and the included MIT license.

Primary vehicle reference: [2012 Dodge Grand Caravan Owner Guide](https://vehicleinfo.mopar.com/assets/publications/en-us/Dodge/2012/Grand_Caravan/328.pdf).

## Live guide

https://llamastwitchin.github.io/grand-caravan-guide/

Created with OpenAI Codex for LLamasTwitchin.

