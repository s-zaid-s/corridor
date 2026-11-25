# CORRIDOR — 105-Ticket AI Engineering Roadmap

> **Project:** Corridor (100% Offline, Pure-TypeScript Autonomous Drone Airspace Management (UTM), 4D Conflict Resolution & Airspace Clearing Monorepo)
> **Scope:** 105 implementation tickets across 10 epics (~3–4 hours of AI programmer effort per ticket)
> **Constraints:** Strict TypeScript only, Node.js built-ins only, zero external runtime dependencies, 100% offline execution.

---

## Epic Index

| Epic | Focus Area | Ticket Range |
| :--- | :--- | :--- |
| **1** | Epic 1: 4D Airspace Geometry, Kinematics & Fixed-Point Math | `CRD-001` – `CRD-010` (10 tickets) |
| **2** | Epic 2: Cryptographic Auth, Drone PKI & Zero-Trust Clearances | `CRD-011` – `CRD-020` (10 tickets) |
| **3** | Epic 3: Partitioned WAL Event Broker & Messaging | `CRD-021` – `CRD-030` (10 tickets) |
| **4** | Epic 4: 4D Spatio-Temporal Indexing & Collision Physics | `CRD-031` – `CRD-040` (10 tickets) |
| **5** | Epic 5: Distributed 4D Corridor Locking & Priority Preemption | `CRD-041` – `CRD-050` (10 tickets) |
| **6** | Epic 6: Double-Entry Airspace Billing & Financial Settlement | `CRD-051` – `CRD-060` (10 tickets) |
| **7** | Epic 7: Drone Fleet Simulator & High-Throughput Telemetry Ingestor | `CRD-061` – `CRD-070` (10 tickets) |
| **8** | Epic 8: Kinematic Spoof Detection & Airspace Security | `CRD-071` – `CRD-080` (10 tickets) |
| **9** | Epic 9: Airspace Controller, Flight-Plan Sagas & Automated Rerouting | `CRD-081` – `CRD-090` (10 tickets) |
| **10** | Epic 10: Control Plane API, Observability, Chaos & Release Verification | `CRD-091` – `CRD-105` (15 tickets) |

---

## Epic 1: 4D Airspace Geometry, Kinematics & Fixed-Point Math

### [CRD-001] Implement WGS-84 Geodesic to Local ENU Coordinate Transformer
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/geodesic-enu.ts`

#### Description
Convert latitude/longitude/altitude (WGS-84) coordinates to local East-North-Up (ENU) meters with sub-centimeter accuracy for urban drone sectors. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/geodesic-enu.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Round-trip LLA -> ENU -> LLA error < 1cm across 50km sector radius; handles pole/antimeridian bounds.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement WGS-84 Geodesic to Local ENU Coordinate Transformer` in `packages/domain-core/src/geodesic-enu.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/geodesic-enu.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-001`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `geodesic-enu.test.ts: verifies London/Manchester/Edinburgh origins and sub-centimeter round-trip precision.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-002] Build 3D Wind-Vector Drift & Groundspeed Energy Penalty Model
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/wind-model.ts`

#### Description
Model headwind/crosswind vectors by altitude layer to compute true groundspeed, crab angle, and adjusted battery Wh consumption. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/wind-model.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Strong headwind increases energy consumption non-linearly; rejects flights where headwind exceeds airframe max speed.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build 3D Wind-Vector Drift & Groundspeed Energy Penalty Model` in `packages/domain-core/src/wind-model.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/wind-model.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-002`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `wind-model.test.ts: verifies 0m/s vs 12m/s headwind energy curves and impossible-headwind rejection.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-003] Implement Smooth Cubic Bezier & Dubins 4D Turn-Radius Trajectory Generator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/dubins-path.ts`

#### Description
Smooth sharp waypoint corners into kinematically feasible 3D curves respecting drone minimum turn radius and bank-angle limits. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/dubins-path.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Generated curves never exceed max lateral acceleration; preserves exact start/end timestamps.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Smooth Cubic Bezier & Dubins 4D Turn-Radius Trajectory Generator` in `packages/domain-core/src/dubins-path.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/dubins-path.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-003`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `dubins-path.test.ts: validates curvature bounds on 90-degree urban street corners and monotonic timestamps.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-004] Add Multi-Currency FX Rate Snapshot & Cross-Border Airspace Toll Converter
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/fx-converter.ts`

#### Description
Support deterministic BigInt FX conversion (GBP/EUR/USD) with basis-point spreads and banker's rounding for cross-border cargo flights. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/fx-converter.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero floating-point ops; rejects stale FX snapshots beyond TTL; spread invariants hold.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Multi-Currency FX Rate Snapshot & Cross-Border Airspace Toll Converter` in `packages/domain-core/src/fx-converter.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/fx-converter.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-004`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `fx-converter.test.ts: converts GBP->EUR->GBP within spread bounds, throws on invalid/expired rates.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-005] Build Deterministic Seeded PRNG & Virtual Simulation Clock
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/sim-clock.ts`

#### Description
Implement Mulberry32/Xoshiro128** PRNG and controllable virtual SimulationClock for 100% reproducible offline UTM chaos runs. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/sim-clock.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Identical seeds yield bit-identical flight and weather streams; supports pause/step/fast-forward.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Deterministic Seeded PRNG & Virtual Simulation Clock` in `packages/domain-core/src/sim-clock.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/sim-clock.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-005`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `sim-clock.test.ts: two runs with seed 99 produce identical 10,000-step sequences.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-006] Implement 3D Urban Obstacle & No-Fly-Zone (NOTAM) Polygon Primitives
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/notam-zones.ts`

#### Description
Model cylindrical and extruded-polygon No-Fly Zones (airports, stadiums, temporary emergency cordons) with altitude floor/ceiling and time windows. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/notam-zones.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Point-in-polygon and segment-intersection checks run in O(vertices) with exact boundary handling.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement 3D Urban Obstacle & No-Fly-Zone (NOTAM) Polygon Primitives` in `packages/domain-core/src/notam-zones.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/notam-zones.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-006`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `notam-zones.test.ts: detects trajectory piercing airport cylinder and allows flight safely above/outside window.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-007] Build Zero-Dependency Strict Runtime Schema Validator Library
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/validator.ts`

#### Description
Create a composable TypeScript runtime validator (string, number, bigint, object, array, union) with static type inference and JSON-path errors. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/validator.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero external packages; rejects malformed flight plans with exact field paths.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Zero-Dependency Strict Runtime Schema Validator Library` in `packages/domain-core/src/validator.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/validator.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-007`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `validator.test.ts: validates FlightPlanRequest and rejects negative altitudes or malformed BigInt tolls.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-008] Implement Battery Thermal Cold-Weather Derating & Reserve Guardrails
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/battery-cold.ts`

#### Description
Model LiPo capacity loss in sub-zero temperatures and enforce mandatory return-to-launch (RTL) energy margins. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/battery-cold.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: At -10C usable capacity drops realistically; blocks clearances lacking RTL margin to nearest vertiport.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Battery Thermal Cold-Weather Derating & Reserve Guardrails` in `packages/domain-core/src/battery-cold.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/battery-cold.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-008`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `battery-cold.test.ts: compares 20C vs -10C range and asserts RTL reserve enforcement.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-009] Add Acoustic Noise Footprint & Curfew Weighting Calculator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/noise-model.ts`

#### Description
Estimate ground-level decibel (dBA) footprint by altitude and airframe class, applying residential night-curfew route penalties. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/noise-model.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Higher altitude reduces ground dBA by inverse-square law; flags curfew violations over residential zones.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Acoustic Noise Footprint & Curfew Weighting Calculator` in `packages/domain-core/src/noise-model.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/noise-model.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-009`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `noise-model.test.ts: verifies 60m vs 120m dBA attenuation and 23:00-06:00 curfew flagging.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-010] Build Vertiport Landing-Pad Capacity & Turnaround Slot Model
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/vertiport-slots.ts`

#### Description
Model physical vertiport pads, charging docks, and minimum wake-turbulence turnaround intervals between landings. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/vertiport-slots.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Prevents double-booking the same landing pad within turnaround buffer.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Vertiport Landing-Pad Capacity & Turnaround Slot Model` in `packages/domain-core/src/vertiport-slots.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/vertiport-slots.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-010`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `vertiport-slots.test.ts: rejects overlapping landing slots within 90s buffer, accepts adjacent non-overlapping slots.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 2: Cryptographic Auth, Drone PKI & Zero-Trust Clearances

### [CRD-011] Implement Offline Aviation Drone Certificate Authority (Root -> Sector -> UAV)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/drone-ca.ts`

#### Description
Build an Ed25519 certificate hierarchy issuing signed JSON airworthiness certificates bound to droneId, operatorId, and allowed sectors. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/drone-ca.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Verifies full 3-tier chain; rejects expired, tampered, or out-of-sector drone certificates.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Offline Aviation Drone Certificate Authority (Root -> Sector -> UAV)` in `packages/crypto-auth/src/drone-ca.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/drone-ca.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-011`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `drone-ca.test.ts: issues 100 drone certs, verifies valid chains, rejects tampered operator claims.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-012] Add Signed Certificate Revocation List (CRL) & Grounding Broadcasts
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/revocation-store.ts`

#### Description
Support immediate cryptographic grounding of rogue or unairworthy drones via signed delta CRLs propagated on the event bus. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/revocation-store.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Revoked drones fail clearance verification in <1ms; unsigned CRL updates are rejected.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Signed Certificate Revocation List (CRL) & Grounding Broadcasts` in `packages/crypto-auth/src/revocation-store.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/revocation-store.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-012`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `revocation-store.test.ts: revokes active drone cert, confirms immediate rejection, blocks unsigned CRLs.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-013] Implement Dual-Key Grace-Period Rotation for Clearance Signer
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/key-rotation.ts`

#### Description
Extend FlightClearanceSigner with keyId headers and overlapping verification windows for zero-downtime key rotation. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/key-rotation.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: In-flight clearances signed by previous key remain valid during grace window; retired keys fail.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Dual-Key Grace-Period Rotation for Clearance Signer` in `packages/crypto-auth/src/key-rotation.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/key-rotation.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-013`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `key-rotation.test.ts: rotates key mid-flight, validates both keys in grace period, rejects retired key.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-014] Build Rotating Bloom-Filter + LRU Nonce Replay Guard
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/replay-guard.ts`

#### Description
Replace unbounded Map nonce tracking with a time-bucketed rotating Bloom filter + exact LRU for bounded memory at 50k msg/s. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/replay-guard.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero false negatives on replay within TTL; memory strictly capped under 1M clearances.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Rotating Bloom-Filter + LRU Nonce Replay Guard` in `packages/crypto-auth/src/replay-guard.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/replay-guard.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-014`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `replay-guard.test.ts: catches 100% of replayed clearances, prunes expired buckets, bounds RAM.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-015] Implement Per-Drone HKDF + HMAC-SHA256 Telemetry Authentication
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/telemetry-mac.ts`

#### Description
Authenticate inbound drone position frames using per-drone HKDF-derived keys and constant-time HMAC verification. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/telemetry-mac.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Uses crypto.timingSafeEqual; rejects altered GPS coordinates or altitude values.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Per-Drone HKDF + HMAC-SHA256 Telemetry Authentication` in `packages/crypto-auth/src/telemetry-mac.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/telemetry-mac.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-015`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `telemetry-mac.test.ts: detects 1-bit flip in telemetry coordinates and verifies per-drone key isolation.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-016] Build Scoped RBAC Bearer Token Engine for UTM Operators & Regulators
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/rbac-tokens.ts`

#### Description
Implement offline Ed25519-signed bearer tokens with scopes (airspace:read, flight:file, notam:publish, emergency:halt). Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/rbac-tokens.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Validates signature, exp, nbf, and scope claims; rejects revoked tokens.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Scoped RBAC Bearer Token Engine for UTM Operators & Regulators` in `packages/crypto-auth/src/rbac-tokens.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/rbac-tokens.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-016`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `rbac-tokens.test.ts: grants regulator emergency:halt, denies commercial operator with 403.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-017] Implement Tamper-Evident SHA-256 Hash-Chained Aviation Audit Log
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/audit-chain.ts`

#### Description
Record all flight clearances, emergency preemptions, NOTAM publications, and grounding orders in a hash-chained log. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/audit-chain.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Any historical mutation breaks chain verification and pinpoints the exact altered entry index.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Tamper-Evident SHA-256 Hash-Chained Aviation Audit Log` in `packages/crypto-auth/src/audit-chain.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/audit-chain.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-017`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `audit-chain.test.ts: appends 1,000 aviation events, verifies chain, detects mid-log tampering.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-018] Add Encrypted Offline Key Vault (scrypt + AES-256-GCM)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/secret-vault.ts`

#### Description
Encrypt sector CA private keys and master HMAC seeds at rest using scrypt KDF and AES-256-GCM with fresh random IVs. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/secret-vault.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Wrong passphrase fails GCM auth tag; every save rotates IV.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Encrypted Offline Key Vault (scrypt + AES-256-GCM)` in `packages/crypto-auth/src/secret-vault.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/secret-vault.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-018`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `secret-vault.test.ts: round-trips Ed25519 private key, fails on wrong password or flipped ciphertext byte.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-019] Implement Signed Geofence & Emergency NOTAM Broadcast Verifier
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/notam-signer.ts`

#### Description
Cryptographically sign temporary No-Fly Zones so drones and controllers only enforce authentic authority-issued NOTAMs. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/notam-signer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Rejects forged NOTAMs from unauthorized keys; enforces NOTAM effective/expiry timestamps.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Signed Geofence & Emergency NOTAM Broadcast Verifier` in `packages/crypto-auth/src/notam-signer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/notam-signer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-019`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `notam-signer.test.ts: signs/verifies emergency fire-zone NOTAM, rejects forged polygon expansion.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-020] Build Batch-Clearance Merkle Tree Signer for Swarm/Corridor Updates
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/merkle-clearance.ts`

#### Description
Sign 5,000 simultaneous reroute clearances with one Ed25519 root signature and O(log N) Merkle inclusion proofs. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/merkle-clearance.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Cuts signing CPU by >95% during mass weather reroutes; each drone verifies its own leaf proof.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Batch-Clearance Merkle Tree Signer for Swarm/Corridor Updates` in `packages/crypto-auth/src/merkle-clearance.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/merkle-clearance.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-020`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `merkle-clearance.test.ts: builds 2,048-leaf reroute tree, verifies valid proofs, rejects forged waypoints.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 3: Partitioned WAL Event Broker & Messaging

### [CRD-021] Implement Binary Framed Segment WAL with CRC32 Integrity Checks
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/segment-wal.ts`

#### Description
Upgrade NDJSON WAL to length-prefixed binary segments with automatic rotation and CRC32 frame verification. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/segment-wal.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Detects torn tail writes on crash recovery and truncates safely to last valid frame.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Binary Framed Segment WAL with CRC32 Integrity Checks` in `packages/event-bus/src/segment-wal.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/segment-wal.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-021`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `segment-wal.test.ts: writes 10,000 events across 3 segments, simulates torn write, recovers cleanly.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-022] Build Crash-Safe Consumer Offset Checkpoint Store
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/offset-store.ts`

#### Description
Persist consumer group offsets atomically using write-temp-and-rename so restarted UTM services resume without missing events. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/offset-store.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Resumes at committedOffset + 1; supports seekToBeginning and seekToTimestamp.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Crash-Safe Consumer Offset Checkpoint Store` in `packages/event-bus/src/offset-store.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/offset-store.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-022`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `offset-store.test.ts: commits offsets, reloads from disk, verifies exact replay boundary.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-023] Implement Sticky Cooperative Consumer Group Rebalancer
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/rebalancer.ts`

#### Description
Distribute topic partitions evenly across multiple consumer instances with minimal reassignment during scale-out/failover. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/rebalancer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero unowned or double-owned partitions across 1->4->2 consumer transitions.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Sticky Cooperative Consumer Group Rebalancer` in `packages/event-bus/src/rebalancer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/rebalancer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-023`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `rebalancer.test.ts: rebalances 16 partitions across dynamic worker sets and verifies sticky assignments.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-024] Add Per-Partition Bounded Backpressure Queue with Watermarks
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/backpressure.ts`

#### Description
Prevent memory exhaustion when slow consumers lag by pausing producers at high watermark and resuming at low watermark. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/backpressure.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero dropped messages; strict per-partition ordering preserved under backpressure.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Per-Partition Bounded Backpressure Queue with Watermarks` in `packages/event-bus/src/backpressure.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/backpressure.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-024`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `backpressure.test.ts: throttles fast publisher against slow consumer and verifies 100% ordered delivery.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-025] Build Non-Blocking Exponential Backoff Retry Scheduler
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/retry-scheduler.ts`

#### Description
Route transient handler failures to delayed retry buckets with jittered backoff before Dead Letter Queue (DLQ) escalation. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/retry-scheduler.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Failing event does not head-of-line block partition; retries fire at 100ms, 400ms, 1600ms.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Non-Blocking Exponential Backoff Retry Scheduler` in `packages/event-bus/src/retry-scheduler.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/retry-scheduler.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-025`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `retry-scheduler.test.ts: transient failure recovers on attempt 3; permanent failure routes to DLQ.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-026] Implement DLQ Inspector & Selective Replay Utility
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/dlq-replay.ts`

#### Description
Inspect dead-lettered events by topic/error and selectively replay repaired messages with incremented replayCount. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/dlq-replay.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Preserves original traceId; removes replayed items from DLQ.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement DLQ Inspector & Selective Replay Utility` in `packages/event-bus/src/dlq-replay.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/dlq-replay.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-026`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `dlq-replay.test.ts: sends 6 poison events, replays 4 matching filter, leaves 2 in DLQ.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-027] Add Keyed Log Compaction for Drone-Profile & Quarantine Topics
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/log-compactor.ts`

#### Description
Compact historical log segments retaining only the latest value per droneId plus deletion tombstones. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/log-compactor.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reduces disk footprint while preserving exact latest state for every active drone.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Keyed Log Compaction for Drone-Profile & Quarantine Topics` in `packages/event-bus/src/log-compactor.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/log-compactor.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-027`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `log-compactor.test.ts: writes 500 updates across 25 drones + 2 tombstones, compacts to 27 records.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-028] Implement Idempotent Producer Sequence Deduplication
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/idempotent-producer.ts`

#### Description
Deduplicate retried publishes using monotonic (producerId, seq) pairs before appending to the WAL. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/idempotent-producer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Duplicate sequence numbers return original offset without duplicate WAL writes.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Idempotent Producer Sequence Deduplication` in `packages/event-bus/src/idempotent-producer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/idempotent-producer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-028`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `idempotent-producer.test.ts: publishes seq 1,2,2,3 -> WAL contains exactly 3 records.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-029] Build Atomic Multi-Topic Transactional Publish (2PC Marker Log)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/tx-broker.ts`

#### Description
Support atomic multi-topic commits with BEGIN/COMMIT/ABORT markers and read_committed consumer isolation. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/tx-broker.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Aborted transactions are invisible to read_committed consumers.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Atomic Multi-Topic Transactional Publish (2PC Marker Log)` in `packages/event-bus/src/tx-broker.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/tx-broker.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-029`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `tx-broker.test.ts: verifies committed vs aborted multi-topic visibility under read_committed.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-030] Add W3C Trace Context Propagation & In-Memory Span Profiler
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/trace-context.ts`

#### Description
Propagate traceparent/spanId across every event hop and collect flamegraph spans for offline latency analysis. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/trace-context.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Unbroken parent-child span tree from flight filing -> voxel lock -> clearance -> billing.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add W3C Trace Context Propagation & In-Memory Span Profiler` in `packages/event-bus/src/trace-context.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/trace-context.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-030`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `trace-context.test.ts: asserts 4-hop trace continuity and accurate durationMs.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 4: 4D Spatio-Temporal Indexing & Collision Physics

### [CRD-031] Implement Hierarchical 3D Octree + Time-Bucket Spatial Index
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/spatial-index/src/octree-4d.ts`

#### Description
Replace linear sector scans with an adaptive 3D Octree partitioned by time slices for O(log N) neighbor and conflict queries. Implement this module in strict TypeScript inside `packages/spatial-index` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/spatial-index/src/octree-4d.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Range query across 10,000 active drones completes in <2ms.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/spatial-index/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Hierarchical 3D Octree + Time-Bucket Spatial Index` in `packages/spatial-index/src/octree-4d.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/spatial-index/src/octree-4d.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/spatial-index/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-031`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `octree-4d.test.ts: inserts 10,000 drones, verifies exact k-nearest and bounding-box results vs brute force.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-032] Build Continuous Swept-Capsule 4D Trajectory Intersection Engine
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/spatial-index/src/swept-capsule.ts`

#### Description
Detect exact mid-air separation breaches between two piecewise-linear 4D trajectories without missing fast crossings between voxel steps. Implement this module in strict TypeScript inside `packages/spatial-index` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/spatial-index/src/swept-capsule.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Catches head-on 40m/s relative-speed crossing even if discrete 5s samples fall on opposite sides.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/spatial-index/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Continuous Swept-Capsule 4D Trajectory Intersection Engine` in `packages/spatial-index/src/swept-capsule.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/spatial-index/src/swept-capsule.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/spatial-index/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-032`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `swept-capsule.test.ts: tests head-on crossing, parallel safe offset, and vertical 20m separation.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-033] Implement 4D A* Conflict-Free Airspace Pathfinding & Auto-Rerouter
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/spatial-index/src/astar-4d.ts`

#### Description
Compute collision-free, NOTAM-avoiding 4D detours around occupied voxels and temporary weather cells using weighted A* search. Implement this module in strict TypeScript inside `packages/spatial-index` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/spatial-index/src/astar-4d.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Finds valid detour around blocked corridor in <50ms; never enters NOTAM or occupied voxels.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/spatial-index/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement 4D A* Conflict-Free Airspace Pathfinding & Auto-Rerouter` in `packages/spatial-index/src/astar-4d.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/spatial-index/src/astar-4d.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/spatial-index/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-033`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `astar-4d.test.ts: blocks direct corridor with NOTAM + occupied voxels, verifies valid 4D detour.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-034] Add Dynamic Weather Cell & Microburst Hazard Layer
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/spatial-index/src/weather-layer.ts`

#### Description
Track moving 3D storm/turbulence polygons over time and flag all active flight plans intersecting forecast storm paths. Implement this module in strict TypeScript inside `packages/spatial-index` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/spatial-index/src/weather-layer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Predicts storm intersection 10 minutes ahead and emits affected flightPlanIds.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/spatial-index/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Dynamic Weather Cell & Microburst Hazard Layer` in `packages/spatial-index/src/weather-layer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/spatial-index/src/weather-layer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/spatial-index/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-034`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `weather-layer.test.ts: advances moving storm cell, detects intersecting flight plan, ignores clear routes.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-035] Implement Terrain Elevation DEM & Building-Height Clearance Grid
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/spatial-index/src/terrain-grid.ts`

#### Description
Maintain a local offline 2.5D urban building-height map ensuring every flight waypoint maintains >=15m clearance above structures. Implement this module in strict TypeScript inside `packages/spatial-index` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/spatial-index/src/terrain-grid.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Rejects trajectories clipping skyscraper heights; validates safe rooftop vertiport approaches.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/spatial-index/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Terrain Elevation DEM & Building-Height Clearance Grid` in `packages/spatial-index/src/terrain-grid.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/spatial-index/src/terrain-grid.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/spatial-index/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-035`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `terrain-grid.test.ts: loads synthetic city skyline, rejects building collision, clears overflight.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-036] Build Sector Congestion Heatmap & Dynamic Density Estimator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/spatial-index/src/congestion-map.ts`

#### Description
Compute real-time voxel occupancy density per sector and altitude band to drive dynamic congestion toll pricing. Implement this module in strict TypeScript inside `packages/spatial-index` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/spatial-index/src/congestion-map.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Density updates in O(1) on lease acquire/release; triggers surge multiplier above 70% occupancy.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/spatial-index/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Sector Congestion Heatmap & Dynamic Density Estimator` in `packages/spatial-index/src/congestion-map.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/spatial-index/src/congestion-map.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/spatial-index/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-036`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `congestion-map.test.ts: fills 75% of sector band, verifies surge pricing multiplier activation.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-037] Implement Historical 4D Flight-Track Time-Series Recorder (Gorilla Codec)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/spatial-index/src/track-recorder.ts`

#### Description
Persist compressed 4D drone flight tracks locally for post-flight distance verification, dispute resolution, and black-box replay. Implement this module in strict TypeScript inside `packages/spatial-index` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/spatial-index/src/track-recorder.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Bit-exact decompression with >=60% compression ratio; fast range query by droneId + time.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/spatial-index/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Historical 4D Flight-Track Time-Series Recorder (Gorilla Codec)` in `packages/spatial-index/src/track-recorder.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/spatial-index/src/track-recorder.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/spatial-index/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-037`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `track-recorder.test.ts: records 10,000 telemetry points, verifies compression ratio and exact replay.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-038] Add Out-of-Order Telemetry Watermark & Trajectory Smoother
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/spatial-index/src/ooo-tracker.ts`

#### Description
Handle delayed drone packets arriving up to 10s out of order without causing false velocity spikes or missed conflicts. Implement this module in strict TypeScript inside `packages/spatial-index` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/spatial-index/src/ooo-tracker.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reorders late frames within watermark cleanly; drops stale frames past watermark.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/spatial-index/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Out-of-Order Telemetry Watermark & Trajectory Smoother` in `packages/spatial-index/src/ooo-tracker.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/spatial-index/src/ooo-tracker.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/spatial-index/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-038`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ooo-tracker.test.ts: feeds shuffled timestamps within 8s skew, verifies smooth ordered track.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-039] Implement Automated Tactical Deconfliction Solver (Altitude Step / Speed Adjust)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/spatial-index/src/tactical-solver.ts`

#### Description
When two airborne drones converge toward a CPA breach, compute minimal-cost tactical avoidance (e.g., +20m climb or 10s hold). Implement this module in strict TypeScript inside `packages/spatial-index` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/spatial-index/src/tactical-solver.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Resolved trajectories guarantee >=50m horizontal or >=15m vertical separation.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/spatial-index/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Automated Tactical Deconfliction Solver (Altitude Step / Speed Adjust)` in `packages/spatial-index/src/tactical-solver.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/spatial-index/src/tactical-solver.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/spatial-index/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-039`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `tactical-solver.test.ts: feeds converging pair, applies solver output, asserts zero CPA conflict.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-040] Add Spatial Index Query Profiler & Memory Budget Guard
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/spatial-index/src/spatial-profiler.ts`

#### Description
Track octree depth, voxel count, conflict-scan latency p99, and enforce LRU pruning of expired time slices. Implement this module in strict TypeScript inside `packages/spatial-index` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/spatial-index/src/spatial-profiler.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Expired time slices are automatically evicted; p99 scan latency stays <5ms.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/spatial-index/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Spatial Index Query Profiler & Memory Budget Guard` in `packages/spatial-index/src/spatial-profiler.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/spatial-index/src/spatial-profiler.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/spatial-index/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-040`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `spatial-profiler.test.ts: simulates 2 hours of flights, verifies old slices pruned and metrics accurate.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 5: Distributed 4D Corridor Locking & Priority Preemption

### [CRD-041] Implement 5-Shard Quorum Corridor Lock Manager (Redlock-Style)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/corridor-lock/src/quorum-lock.ts`

#### Description
Simulate 5 independent airspace lock shards requiring 3/5 quorum acquisition with automatic rollback on partial lock failure. Implement this module in strict TypeScript inside `packages/corridor-lock` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/corridor-lock/src/quorum-lock.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Survives 2 failed shards; 3 failed shards cleanly abort with zero leaked voxel locks.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/corridor-lock/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement 5-Shard Quorum Corridor Lock Manager (Redlock-Style)` in `packages/corridor-lock/src/quorum-lock.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/corridor-lock/src/quorum-lock.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/corridor-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-041`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `quorum-lock.test.ts: kills 2 shards -> succeeds; kills 3 shards -> fails cleanly with 0 leaks.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-042] Add In-Flight Corridor Lease Extension & Watchdog Renewal
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/corridor-lock/src/lease-watchdog.ts`

#### Description
Allow delayed drones (e.g., headwind slowdown) to extend downstream voxel leases safely using their fencing token. Implement this module in strict TypeScript inside `packages/corridor-lock` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/corridor-lock/src/lease-watchdog.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Rejects stale fencing tokens; extends TTL atomically when no higher-priority conflict exists.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/corridor-lock/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add In-Flight Corridor Lease Extension & Watchdog Renewal` in `packages/corridor-lock/src/lease-watchdog.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/corridor-lock/src/lease-watchdog.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/corridor-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-042`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `lease-watchdog.test.ts: extends active flight lease 3 times, rejects stale token extension.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-043] Implement Preemption Cascade Notifier & Reroute Callback Hook
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/corridor-lock/src/preemption-hook.ts`

#### Description
When an EMERGENCY_MED flight preempts commercial voxels, emit structured preemption events so affected drones receive immediate HOLD/REROUTE clearances. Implement this module in strict TypeScript inside `packages/corridor-lock` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/corridor-lock/src/preemption-hook.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Preempted commercial flight receives HOLD clearance within 50ms of emergency lock.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/corridor-lock/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Preemption Cascade Notifier & Reroute Callback Hook` in `packages/corridor-lock/src/preemption-hook.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/corridor-lock/src/preemption-hook.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/corridor-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-043`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `preemption-hook.test.ts: medical drone preempts cargo drone; verifies callback fires with exact preempted tokens.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-044] Build Persistent Disk-Backed Voxel Lease Journal for Failover
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/corridor-lock/src/lease-journal.ts`

#### Description
Journal active voxel reservations and monotonic fencing counter to disk so restarted controllers never double-book occupied airspace. Implement this module in strict TypeScript inside `packages/corridor-lock` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/corridor-lock/src/lease-journal.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Fencing counter strictly increments across restarts; non-expired corridors reload intact.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/corridor-lock/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Persistent Disk-Backed Voxel Lease Journal for Failover` in `packages/corridor-lock/src/lease-journal.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/corridor-lock/src/lease-journal.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/corridor-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-044`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `lease-journal.test.ts: locks corridor with token #5, restarts manager, next token is #6 and voxels stay locked.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-045] Implement Fair Priority-Weighted Wait Queue with AbortSignal
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/corridor-lock/src/priority-queue.ts`

#### Description
Queue contested commercial corridor requests by priority and filing time with timeout/AbortSignal cancellation. Implement this module in strict TypeScript inside `packages/corridor-lock` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/corridor-lock/src/priority-queue.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Higher priority dequeues first; aborted waiters purge cleanly without leaking slots.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/corridor-lock/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Fair Priority-Weighted Wait Queue with AbortSignal` in `packages/corridor-lock/src/priority-queue.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/corridor-lock/src/priority-queue.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/corridor-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-045`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `priority-queue.test.ts: queues 3 flights, cancels #2, grants corridor in strict priority order.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-046] Add Sector Airspace Capacity Cap & Safety Buffer Semaphore
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/corridor-lock/src/sector-semaphore.ts`

#### Description
Enforce hard per-sector concurrent airborne drone limits (e.g., max 500 drones in LDN-CORE) reserving 10% capacity exclusively for emergency flights. Implement this module in strict TypeScript inside `packages/corridor-lock` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/corridor-lock/src/sector-semaphore.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Blocks commercial flights at 90% sector cap while still admitting EMERGENCY_MED flights.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/corridor-lock/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Sector Airspace Capacity Cap & Safety Buffer Semaphore` in `packages/corridor-lock/src/sector-semaphore.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/corridor-lock/src/sector-semaphore.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/corridor-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-046`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `sector-semaphore.test.ts: fills 90% commercial cap, rejects commercial #91, admits emergency flight.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-047] Implement Monotonic Fencing-Token Guard Middleware for Drones
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/corridor-lock/src/fencing-guard.ts`

#### Description
Track highest seen fencingToken per droneId so drones ignore delayed clearances from partitioned zombie controllers. Implement this module in strict TypeScript inside `packages/corridor-lock` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/corridor-lock/src/fencing-guard.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Clearance with fencingToken 8 rejected after drone accepted fencingToken 9.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/corridor-lock/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Monotonic Fencing-Token Guard Middleware for Drones` in `packages/corridor-lock/src/fencing-guard.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/corridor-lock/src/fencing-guard.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/corridor-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-047`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `fencing-guard.test.ts: verifies monotonic acceptance and strict rejection of stale tokens.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-048] Build Airspace Contention & Bottleneck Voxel Analyzer
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/corridor-lock/src/bottleneck-analyzer.ts`

#### Description
Track lock conflict rates per voxel and altitude band to identify urban airspace chokepoints. Implement this module in strict TypeScript inside `packages/corridor-lock` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/corridor-lock/src/bottleneck-analyzer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Returns top-10 most contested voxels and conflict percentage per sector.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/corridor-lock/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Airspace Contention & Bottleneck Voxel Analyzer` in `packages/corridor-lock/src/bottleneck-analyzer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/corridor-lock/src/bottleneck-analyzer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/corridor-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-048`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `bottleneck-analyzer.test.ts: simulates 200 overlapping requests, verifies hotspot ranking.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-049] Implement Hierarchical Sector/Altitude-Band Maintenance Lock Tree
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/corridor-lock/src/band-lock.ts`

#### Description
Support intention locks (IS/IX) on sectors/altitude bands so authorities can lock an entire altitude layer (e.g., 80m-120m) for manned helicopter transit. Implement this module in strict TypeScript inside `packages/corridor-lock` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/corridor-lock/src/band-lock.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Exclusive altitude-band lock blocks new drone corridors in that band while allowing flights below 80m.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/corridor-lock/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Hierarchical Sector/Altitude-Band Maintenance Lock Tree` in `packages/corridor-lock/src/band-lock.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/corridor-lock/src/band-lock.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/corridor-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-049`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `band-lock.test.ts: locks 80-120m band, rejects 100m flight, permits 50m flight.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-050] Add Deterministic Lock-Delay & Clock-Skew Chaos Injector
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/corridor-lock/src/lock-chaos.ts`

#### Description
Inject simulated GC pauses and shard clock skew to prove fencing tokens prevent double-clearance under split-brain. Implement this module in strict TypeScript inside `packages/corridor-lock` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/corridor-lock/src/lock-chaos.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zombie leader delayed past TTL fails fencing validation cleanly.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/corridor-lock/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Deterministic Lock-Delay & Clock-Skew Chaos Injector` in `packages/corridor-lock/src/lock-chaos.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/corridor-lock/src/lock-chaos.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/corridor-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-050`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `lock-chaos.test.ts: simulates 5s pause past TTL, asserts zero conflicting airborne clearances.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 6: Double-Entry Airspace Billing & Financial Settlement

### [CRD-051] Implement Append-Only Hash-Chained Ledger Store on Disk
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/ledger-store.ts`

#### Description
Persist every JournalEntry to a SHA-256 hash-chained file and rebuild BigInt balances deterministically on restart. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/ledger-store.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reloading reproduces exact balances; altering any byte fails startup integrity check.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Append-Only Hash-Chained Ledger Store on Disk` in `packages/ledger-engine/src/ledger-store.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/ledger-store.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-051`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ledger-store.test.ts: posts 500 billing entries, restarts ledger, verifies balances and chain integrity.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-052] Build Optimistic Concurrency Control (OCC) Transaction Retry Engine
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/occ-transaction.ts`

#### Description
Version LedgerAccounts and retry concurrent write conflicts automatically with exponential backoff. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/occ-transaction.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: 50 concurrent flight billings on the same operator wallet conserve every micro-unit.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Optimistic Concurrency Control (OCC) Transaction Retry Engine` in `packages/ledger-engine/src/occ-transaction.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/occ-transaction.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-052`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `occ-transaction.test.ts: runs 50 concurrent debits, verifies zero lost updates and exact final balance.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-053] Implement Immutable Reversing Entries for Disputed Flight Penalties
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/reversal-engine.ts`

#### Description
Allow regulator-approved dispute refunds strictly via linked reversing journal entries without mutating history. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/reversal-engine.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reversal balances original entry to 0; duplicate reversal attempts throw.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Immutable Reversing Entries for Disputed Flight Penalties` in `packages/ledger-engine/src/reversal-engine.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/reversal-engine.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-053`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `reversal-engine.test.ts: bills penalty, reverses it, confirms net 0 and blocks second reversal.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-054] Add Dynamic Congestion Surge, Night-Noise Surcharge & VAT Calculator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/toll-calculator.ts`

#### Description
Compute exact BigInt flight tolls incorporating sector density multipliers, night noise fees, and 20% UK VAT. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/toll-calculator.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Base toll + surge + noise fee + VAT === total operator debit to the exact micro-unit.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Dynamic Congestion Surge, Night-Noise Surcharge & VAT Calculator` in `packages/ledger-engine/src/toll-calculator.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/toll-calculator.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-054`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `toll-calculator.test.ts: tests off-peak, 2x surge peak, and night-curfew surcharge math.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-055] Build Operator Account Statement & Cursor-Paginated History API
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/statement-service.ts`

#### Description
Generate itemized operator billing statements with opening balance, postings, and closing balance across paginated cursors. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/statement-service.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: opening + credits - debits === closing for every page.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Operator Account Statement & Cursor-Paginated History API` in `packages/ledger-engine/src/statement-service.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/statement-service.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-055`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `statement-service.test.ts: paginates 200 flight charges and verifies continuous running balance.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-056] Implement Pre-Flight Toll Escrow Hold & Post-Flight Release/Capture
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/toll-escrow.ts`

#### Description
Hold estimated flight toll in escrow upon corridor lock; capture actual flown toll on landing and refund unused remainder. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/toll-escrow.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Insufficient wallet balance blocks commercial flight filing; cancelled flights refund 100%.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Pre-Flight Toll Escrow Hold & Post-Flight Release/Capture` in `packages/ledger-engine/src/toll-escrow.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/toll-escrow.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-056`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `toll-escrow.test.ts: holds £2.00, captures £1.65 on landing, refunds £0.35 atomically.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-057] Add Multi-Currency Cross-Border Airspace Settlement & FX Bridge
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/fx-settlement.ts`

#### Description
Settle EUR/GBP cross-border corridor fees using balanced FX bridge accounts with realized FX gain/loss lines. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/fx-settlement.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Each currency sub-ledger independently satisfies SUM(debits) === SUM(credits).
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Multi-Currency Cross-Border Airspace Settlement & FX Bridge` in `packages/ledger-engine/src/fx-settlement.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/fx-settlement.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-057`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `fx-settlement.test.ts: settles EUR flight from GBP operator wallet with balanced bridge entries.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-058] Build Daily Merkle Root Financial Reconciliation Snapshotter
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/ledger-merkle.ts`

#### Description
Compute daily SHA-256 Merkle roots over all operator balances for aviation authority audits. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/ledger-merkle.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Generates O(log N) balance inclusion proofs; 1-micro-unit change invalidates root.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Daily Merkle Root Financial Reconciliation Snapshotter` in `packages/ledger-engine/src/ledger-merkle.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/ledger-merkle.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-058`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ledger-merkle.test.ts: snapshots 1,000 accounts, verifies proof, detects 1-micro-unit tamper.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-059] Implement Automated Operator Invoice & Monthly Volume Rebate Engine
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/volume-rebates.ts`

#### Description
Calculate tiered monthly volume rebates for high-compliance operators (>99.5% on-corridor adherence) and credit wallets atomically. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/volume-rebates.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Applies correct tier bps; skips operators with high deviation rates.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Automated Operator Invoice & Monthly Volume Rebate Engine` in `packages/ledger-engine/src/volume-rebates.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/volume-rebates.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-059`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `volume-rebates.test.ts: credits compliant operator 5% rebate, excludes non-compliant operator.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-060] Build 1M-Line Billing Stress & Invariant Audit Benchmark
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/ledger-benchmark.ts`

#### Description
Benchmark 1,000,000 billing lines across 5,000 operator accounts and verify zero-drift audit in <2 seconds. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/ledger-benchmark.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero invariant violations; prints throughput and audit duration.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build 1M-Line Billing Stress & Invariant Audit Benchmark` in `packages/ledger-engine/src/ledger-benchmark.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/ledger-benchmark.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-060`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ledger-benchmark.test.ts: runs 100k-line CI benchmark and asserts zero drift.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 7: Drone Fleet Simulator & High-Throughput Telemetry Ingestor

### [CRD-061] Implement Worker-Thread Sharded Drone Fleet Simulator (10k+ UAVs)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/drone-fleet-simulator/src/worker-fleet.ts`

#### Description
Partition 10,000+ simulated drones across Node.js `worker_threads` for parallel kinematic ticking and clearance verification. Implement this module in strict TypeScript inside `apps/drone-fleet-simulator` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/drone-fleet-simulator/src/worker-fleet.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Sustains 10,000 drones ticking at 2 Hz with <350MB RAM.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/drone-fleet-simulator/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Worker-Thread Sharded Drone Fleet Simulator (10k+ UAVs)` in `apps/drone-fleet-simulator/src/worker-fleet.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/drone-fleet-simulator/src/worker-fleet.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/drone-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-061`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `worker-fleet.test.ts: spawns 4 workers with 2,500 drones each and aggregates synchronized telemetry.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-062] Add Realistic Urban Delivery Mission Generator & Vertiport Traffic
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/drone-fleet-simulator/src/mission-gen.ts`

#### Description
Generate continuous realistic cargo, medical emergency, and infrastructure inspection missions between urban vertiports. Implement this module in strict TypeScript inside `apps/drone-fleet-simulator` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/drone-fleet-simulator/src/mission-gen.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Deterministic under SimClock seed; produces realistic peak-hour traffic waves.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/drone-fleet-simulator/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Realistic Urban Delivery Mission Generator & Vertiport Traffic` in `apps/drone-fleet-simulator/src/mission-gen.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/drone-fleet-simulator/src/mission-gen.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/drone-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-062`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `mission-gen.test.ts: generates 500 missions across 4 sectors with valid kinematic profiles.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-063] Build Adversarial Attack Simulator (GPS Spoof, Replay, Rogue Intruder)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/drone-fleet-simulator/src/attack-sim.ts`

#### Description
Inject scheduled GPS-spoofing, unfiled rogue drone intrusions, and replayed clearance packets into live runs. Implement this module in strict TypeScript inside `apps/drone-fleet-simulator` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/drone-fleet-simulator/src/attack-sim.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Activates/deactivates attacks dynamically without restarting the simulator.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/drone-fleet-simulator/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Adversarial Attack Simulator (GPS Spoof, Replay, Rogue Intruder)` in `apps/drone-fleet-simulator/src/attack-sim.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/drone-fleet-simulator/src/attack-sim.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/drone-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-063`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `attack-sim.test.ts: injects 5% spoofers + 10 rogue drones and verifies detection rate.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-064] Implement Local Loopback TCP/NDJSON Framed Telemetry Transport
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/tcp-transport.ts`

#### Description
Stream drone telemetry over local `node:net` TCP sockets with length-prefixed framing, reconnects, and backpressure. Implement this module in strict TypeScript inside `apps/drone-fleet-simulator` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/tcp-transport.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Handles arbitrary TCP chunk splits with zero dropped or corrupted frames.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/drone-fleet-simulator/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Local Loopback TCP/NDJSON Framed Telemetry Transport` in `apps/telemetry-ingestor/src/tcp-transport.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/tcp-transport.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/drone-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-064`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `tcp-transport.test.ts: streams 20,000 frames over 127.0.0.1 with fragmented buffers.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-065] Build Adaptive Ring-Buffer Ingestor with Size & Latency Flush Triggers
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/ring-batcher.ts`

#### Description
Flush buffered drone telemetry on maxBatchSize or maxWaitMs (whichever fires first) with clean SIGTERM draining. Implement this module in strict TypeScript inside `apps/drone-fleet-simulator` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/ring-batcher.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Low traffic flushes within maxWaitMs; shutdown flushes 100% of buffered frames.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/drone-fleet-simulator/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Adaptive Ring-Buffer Ingestor with Size & Latency Flush Triggers` in `apps/telemetry-ingestor/src/ring-batcher.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/ring-batcher.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/drone-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-065`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ring-batcher.test.ts: validates timer flush, burst size flush, and graceful drain.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-066] Add Per-Drone Token-Bucket Telemetry Flood Rate Limiter
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/drone-rate-limiter.ts`

#### Description
Prevent malfunctioning or malicious drones from flooding telemetry at 500 Hz using per-drone token buckets. Implement this module in strict TypeScript inside `apps/drone-fleet-simulator` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/drone-rate-limiter.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Throttles flooding drone while keeping compliant drones at 100% ingest.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/drone-fleet-simulator/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Per-Drone Token-Bucket Telemetry Flood Rate Limiter` in `apps/telemetry-ingestor/src/drone-rate-limiter.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/drone-rate-limiter.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/drone-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-066`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `drone-rate-limiter.test.ts: floods 1 drone at 500Hz, verifies throttling and neighbor isolation.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-067] Implement Telemetry Sequence-Number Gap & Duplicate Filter
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/seq-dedup.ts`

#### Description
Drop duplicate retransmitted telemetry frames and track packet-loss gaps per drone. Implement this module in strict TypeScript inside `apps/drone-fleet-simulator` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/seq-dedup.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Duplicates dropped before spatial index update; gap metrics incremented accurately.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/drone-fleet-simulator/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Telemetry Sequence-Number Gap & Duplicate Filter` in `apps/telemetry-ingestor/src/seq-dedup.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/seq-dedup.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/drone-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-067`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `seq-dedup.test.ts: feeds seq 1,2,2,6 -> accepts 1,2,6, counts 1 dup and 3 missing.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-068] Build Firmware Telemetry Schema Upcaster (v1 -> v2 Normalizer)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/upcaster.ts`

#### Description
Normalize legacy v1 drone telemetry packets (feet/knots) into canonical v2 SI units (meters/m/s). Implement this module in strict TypeScript inside `apps/drone-fleet-simulator` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/upcaster.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Accurate feet->meters and knots->m/s conversion with zero dropped frames.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/drone-fleet-simulator/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Firmware Telemetry Schema Upcaster (v1 -> v2 Normalizer)` in `apps/telemetry-ingestor/src/upcaster.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/upcaster.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/drone-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-068`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `upcaster.test.ts: ingests mixed v1/v2 frames and asserts canonical SI output.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-069] Implement Malformed Telemetry Quarantine Ring-Log
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/malformed-store.ts`

#### Description
Capture rejected telemetry frames with structured validation errors for operator diagnostics. Implement this module in strict TypeScript inside `apps/drone-fleet-simulator` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/malformed-store.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Malformed packets never crash ingestor and are queryable by droneId.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/drone-fleet-simulator/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Malformed Telemetry Quarantine Ring-Log` in `apps/telemetry-ingestor/src/malformed-store.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/malformed-store.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/drone-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-069`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `malformed-store.test.ts: injects NaN coordinates and battery=150%, verifies quarantine capture.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-070] Add Ingestion Throughput & p99 Latency Benchmark Harness
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/ingest-bench.ts`

#### Description
Benchmark sustained frames/sec and p99 ingestion latency against SpatialVoxelGrid4D + EventBroker. Implement this module in strict TypeScript inside `apps/drone-fleet-simulator` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/ingest-bench.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reports throughput and p99 latency; fails if p99 > 50ms.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/drone-fleet-simulator/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Ingestion Throughput & p99 Latency Benchmark Harness` in `apps/telemetry-ingestor/src/ingest-bench.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/ingest-bench.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/drone-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-070`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ingest-bench.test.ts: pushes 50,000 frames and validates SLA report.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 8: Kinematic Spoof Detection & Airspace Security

### [CRD-071] Implement Kalman-Filter Position Predictor & Residual Anomaly Detector
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/spoof-detector/src/kalman-detector.ts`

#### Description
Run a lightweight 3D constant-velocity Kalman filter per drone to flag subtle GPS-spoofing drift that stays below hard speed limits. Implement this module in strict TypeScript inside `apps/spoof-detector` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/spoof-detector/src/kalman-detector.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Catches gradual 15m/s spoofed drift within 3 seconds with <0.5% false positives.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/spoof-detector/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Kalman-Filter Position Predictor & Residual Anomaly Detector` in `apps/spoof-detector/src/kalman-detector.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/spoof-detector/src/kalman-detector.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/spoof-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-071`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `kalman-detector.test.ts: smooth flight passes; gradual spoofed offset triggers residual alert.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-072] Build Cross-Drone RF/ADS-B Neighbor Witness Verification
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/spoof-detector/src/neighbor-witness.ts`

#### Description
Cross-check a drone's claimed position against nearby witness drones' simulated RF-ranging pings to catch phantom GPS spoofing. Implement this module in strict TypeScript inside `apps/spoof-detector` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/spoof-detector/src/neighbor-witness.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Flags drone claiming to be at (X,Y) when local witnesses report zero RF presence.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/spoof-detector/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Cross-Drone RF/ADS-B Neighbor Witness Verification` in `apps/spoof-detector/src/neighbor-witness.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/spoof-detector/src/neighbor-witness.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/spoof-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-072`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `neighbor-witness.test.ts: flags phantom spoofer; clears honestly observed drone.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-073] Implement Corridor-Tube Conformance & Off-Track Deviation Monitor
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/spoof-detector/src/conformance-monitor.ts`

#### Description
Continuously measure cross-track and vertical error against each drone's cleared 4D waypoints and count billable deviations. Implement this module in strict TypeScript inside `apps/spoof-detector` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/spoof-detector/src/conformance-monitor.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Flags >25m horizontal or >10m vertical deviation and emits deviation events for billing.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/spoof-detector/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Corridor-Tube Conformance & Off-Track Deviation Monitor` in `apps/spoof-detector/src/conformance-monitor.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/spoof-detector/src/conformance-monitor.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/spoof-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-073`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `conformance-monitor.test.ts: on-track flight=0 deviations; 40m lateral drift increments deviation counter.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-074] Add Quarantine Hysteresis FSM (HEALTHY -> SUSPECT -> QUARANTINED -> CLEARED)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/spoof-detector/src/quarantine-fsm.ts`

#### Description
Prevent false-positive grounding from single GPS glitches by requiring sustained violations before full quarantine. Implement this module in strict TypeScript inside `apps/spoof-detector` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/spoof-detector/src/quarantine-fsm.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Single glitch enters SUSPECT; 3 consecutive violations trigger QUARANTINED.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/spoof-detector/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Quarantine Hysteresis FSM (HEALTHY -> SUSPECT -> QUARANTINED -> CLEARED)` in `apps/spoof-detector/src/quarantine-fsm.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/spoof-detector/src/quarantine-fsm.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/spoof-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-074`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `quarantine-fsm.test.ts: verifies state transitions and operator-authorized rehabilitation.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-075] Build Coordinated Swarm-Spoofing & Ghost-Fleet Entropy Detector
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/spoof-detector/src/swarm-spoof.ts`

#### Description
Detect coordinated GPS spoofing attacks where multiple drones in a sector simultaneously exhibit identical anomalous velocity vectors. Implement this module in strict TypeScript inside `apps/spoof-detector` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/spoof-detector/src/swarm-spoof.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Flags regional jamming/spoofing zone and alerts AirspaceController to switch to dead-reckoning.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/spoof-detector/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Coordinated Swarm-Spoofing & Ghost-Fleet Entropy Detector` in `apps/spoof-detector/src/swarm-spoof.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/spoof-detector/src/swarm-spoof.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/spoof-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-075`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `swarm-spoof.test.ts: injects 20 drones with identical offset jump; flags regional spoofing alert.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-076] Implement Real-Time Geofence & Dynamic NOTAM Intrusion Detector
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/spoof-detector/src/geofence-monitor.ts`

#### Description
Evaluate every inbound position frame against active 3D NOTAM polygons and trigger immediate EMERGENCY_LAND clearances on breach. Implement this module in strict TypeScript inside `apps/spoof-detector` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/spoof-detector/src/geofence-monitor.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Detects intrusion within 1 frame and publishes CRITICAL geofence alert.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/spoof-detector/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Real-Time Geofence & Dynamic NOTAM Intrusion Detector` in `apps/spoof-detector/src/geofence-monitor.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/spoof-detector/src/geofence-monitor.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/spoof-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-076`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `geofence-monitor.test.ts: flies drone into active stadium NOTAM, asserts immediate CRITICAL alert.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-077] Add Battery-Tampering & Endurance-Lie Detector
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/spoof-detector/src/battery-audit.ts`

#### Description
Detect drones reporting artificially static or rising battery % while cruising at high speed. Implement this module in strict TypeScript inside `apps/spoof-detector` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/spoof-detector/src/battery-audit.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Flags physically impossible zero-drain flight after 60s of cruising.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/spoof-detector/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Battery-Tampering & Endurance-Lie Detector` in `apps/spoof-detector/src/battery-audit.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/spoof-detector/src/battery-audit.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/spoof-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-077`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `battery-audit.test.ts: honest battery drain passes; frozen 95% battery during cruise triggers alert.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-078] Build Pluggable Security Rule Engine with Hot-Reloadable Policies
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/spoof-detector/src/rule-engine.ts`

#### Description
Allow runtime registration and threshold updates of spoof/safety rules per sector without service restart. Implement this module in strict TypeScript inside `apps/spoof-detector` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/spoof-detector/src/rule-engine.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Updated altitude ceiling or speed threshold applies on the very next telemetry frame.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/spoof-detector/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Pluggable Security Rule Engine with Hot-Reloadable Policies` in `apps/spoof-detector/src/rule-engine.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/spoof-detector/src/rule-engine.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/spoof-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-078`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `rule-engine.test.ts: lowers sector ceiling from 120m to 80m at runtime, verifies immediate enforcement.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-079] Implement Pre-Alert Black-Box Evidence Recorder for Incident Audits
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/spoof-detector/src/evidence-recorder.ts`

#### Description
Snapshot the 20 telemetry frames preceding any CRITICAL spoof or geofence alert for aviation authority investigation. Implement this module in strict TypeScript inside `apps/spoof-detector` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/spoof-detector/src/evidence-recorder.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Retrieves full 20-frame evidence bundle by alertId.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/spoof-detector/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Pre-Alert Black-Box Evidence Recorder for Incident Audits` in `apps/spoof-detector/src/evidence-recorder.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/spoof-detector/src/evidence-recorder.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/spoof-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-079`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `evidence-recorder.test.ts: triggers spoof alert and asserts 20-frame bundle persisted.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-080] Build Labeled Precision/Recall Evaluation Harness for Spoof Detector
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/spoof-detector/src/eval-harness.ts`

#### Description
Score detector TP/FP/TN/FN, Precision, Recall, and F1 against synthetic attack-injected flight streams. Implement this module in strict TypeScript inside `apps/spoof-detector` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/spoof-detector/src/eval-harness.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Achieves Recall >= 0.98 and FPR < 0.005 on standard benchmark.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/spoof-detector/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Labeled Precision/Recall Evaluation Harness for Spoof Detector` in `apps/spoof-detector/src/eval-harness.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/spoof-detector/src/eval-harness.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/spoof-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-080`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `eval-harness.test.ts: runs 5,000-frame labeled benchmark and asserts F1 >= 0.98.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 9: Airspace Controller, Flight-Plan Sagas & Automated Rerouting

### [CRD-081] Implement Automated Conflict-Free Trajectory Negotiator (Alt/Time Shift)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/airspace-controller/src/negotiator.ts`

#### Description
When a filed flight plan conflicts with occupied voxels, automatically propose up to 3 conflict-free alternatives (altitude shift +25m or departure delay +30s). Implement this module in strict TypeScript inside `apps/airspace-controller` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/airspace-controller/src/negotiator.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Resolves >80% of contested filings automatically without human intervention.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/airspace-controller/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Automated Conflict-Free Trajectory Negotiator (Alt/Time Shift)` in `apps/airspace-controller/src/negotiator.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/airspace-controller/src/negotiator.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/airspace-controller/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-081`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `negotiator.test.ts: files conflicting flight, verifies valid +25m or +30s conflict-free alternative returned.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-082] Build ClearanceAck Watchdog & Automatic Hold-on-Timeout Safety Net
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/airspace-controller/src/ack-watchdog.ts`

#### Description
Monitor ClearanceAck within 500ms of issuing a REROUTE or HOLD; if unacknowledged, escalate to neighbor-drone tactical avoidance. Implement this module in strict TypeScript inside `apps/airspace-controller` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/airspace-controller/src/ack-watchdog.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Protects nearby drones when a target drone suffers link loss mid-reroute.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/airspace-controller/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build ClearanceAck Watchdog & Automatic Hold-on-Timeout Safety Net` in `apps/airspace-controller/src/ack-watchdog.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/airspace-controller/src/ack-watchdog.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/airspace-controller/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-082`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ack-watchdog.test.ts: drops ACK from drone A, verifies watchdog escalates protective reroute to drone B.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-083] Implement Dynamic Weather NOTAM Mass-Reroute Orchestrator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/airspace-controller/src/mass-rerouter.ts`

#### Description
When a sudden storm NOTAM activates, identify all affected airborne flights, lock new detour corridors, and fan out signed REROUTE clearances. Implement this module in strict TypeScript inside `apps/airspace-controller` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/airspace-controller/src/mass-rerouter.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reroutes 100 affected airborne drones in <300ms with zero new separation conflicts.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/airspace-controller/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Dynamic Weather NOTAM Mass-Reroute Orchestrator` in `apps/airspace-controller/src/mass-rerouter.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/airspace-controller/src/mass-rerouter.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/airspace-controller/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-083`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `mass-rerouter.test.ts: activates storm polygon over 50 flying drones, verifies 100% conflict-free reroute.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-084] Build Emergency Medical Corridor Green-Wave Preemptor
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/airspace-controller/src/green-wave.ts`

#### Description
Clear a priority 4D expressway for EMERGENCY_MED organ/defibrillator drones by preempting commercial corridors and issuing synchronized HOLD clearances. Implement this module in strict TypeScript inside `apps/airspace-controller` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/airspace-controller/src/green-wave.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Medical drone achieves zero-delay clearance; all preempted commercial drones safely hold.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/airspace-controller/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Emergency Medical Corridor Green-Wave Preemptor` in `apps/airspace-controller/src/green-wave.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/airspace-controller/src/green-wave.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/airspace-controller/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-084`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `green-wave.test.ts: files EMERGENCY_MED through congested corridor, verifies express clearance + commercial holds.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-085] Implement Persistent Disk-Backed Flight-Plan Saga Store & Crash Recovery
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/flight-plan-saga/src/saga-recovery.ts`

#### Description
Persist every FlightSagaRecord transition to disk and recover interrupted in-flight sagas on startup by releasing orphaned voxel locks. Implement this module in strict TypeScript inside `apps/airspace-controller` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/flight-plan-saga/src/saga-recovery.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Simulated crash after CORRIDOR_LOCKED cleanly releases all locked voxels upon restart.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/airspace-controller/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Persistent Disk-Backed Flight-Plan Saga Store & Crash Recovery` in `apps/flight-plan-saga/src/saga-recovery.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/flight-plan-saga/src/saga-recovery.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/airspace-controller/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-085`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `saga-recovery.test.ts: crashes coordinator mid-saga, reloads, confirms zero leaked voxel leases.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-086] Add Multi-Leg Hub-and-Spoke Flight-Plan Chaining Coordinator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/flight-plan-saga/src/multi-leg-saga.ts`

#### Description
Support atomic reservation of multi-leg delivery routes (Origin -> Vertiport A -> Destination) including intermediate charging pad slots. Implement this module in strict TypeScript inside `apps/airspace-controller` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/flight-plan-saga/src/multi-leg-saga.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: All-or-nothing reservation: if leg 2 or pad slot fails, leg 1 corridor is rolled back cleanly.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/airspace-controller/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Multi-Leg Hub-and-Spoke Flight-Plan Chaining Coordinator` in `apps/flight-plan-saga/src/multi-leg-saga.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/flight-plan-saga/src/multi-leg-saga.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/airspace-controller/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-086`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `multi-leg-saga.test.ts: leg 2 conflict triggers full rollback of leg 1 corridor and vertiport slot.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-087] Implement Flight Lifecycle State Machine & Auto-Completion Detector
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/airspace-controller/src/flight-lifecycle.ts`

#### Description
Track each cleared flight from FILED -> AIRBORNE -> LANDED, automatically releasing trailing voxels and emitting `airspace.flight.completed`. Implement this module in strict TypeScript inside `apps/airspace-controller` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/airspace-controller/src/flight-lifecycle.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Landing triggers exact distance computation, lease release, and single billing event.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/airspace-controller/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Flight Lifecycle State Machine & Auto-Completion Detector` in `apps/airspace-controller/src/flight-lifecycle.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/airspace-controller/src/flight-lifecycle.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/airspace-controller/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-087`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `flight-lifecycle.test.ts: completes flight at destination, verifies voxel release and billing trigger.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-088] Build Dynamic Sector Congestion Pricing Engine
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/flight-plan-saga/src/congestion-pricer.ts`

#### Description
Calculate real-time micro-GBP/km corridor tolls based on sector occupancy density, altitude band scarcity, and time of day. Implement this module in strict TypeScript inside `apps/airspace-controller` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/flight-plan-saga/src/congestion-pricer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Prices scale smoothly from 1.0x baseline to 3.0x peak; EMERGENCY_MED always billed at 0.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/airspace-controller/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Dynamic Sector Congestion Pricing Engine` in `apps/flight-plan-saga/src/congestion-pricer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/flight-plan-saga/src/congestion-pricer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/airspace-controller/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-088`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `congestion-pricer.test.ts: verifies 1.0x off-peak, 2.5x congested peak, and 0 toll for emergency flights.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-089] Implement Automated Lost-Link Return-to-Launch (RTL) Corridor Reservation
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/airspace-controller/src/rtl-handler.ts`

#### Description
When a drone stops sending telemetry for >10s, reserve a protective buffer cylinder around its last known trajectory and RTL path. Implement this module in strict TypeScript inside `apps/airspace-controller` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/airspace-controller/src/rtl-handler.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Other drones are routed around the lost-link safety bubble until signal recovers or battery expires.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/airspace-controller/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Automated Lost-Link Return-to-Launch (RTL) Corridor Reservation` in `apps/airspace-controller/src/rtl-handler.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/airspace-controller/src/rtl-handler.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/airspace-controller/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-089`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `rtl-handler.test.ts: silences drone mid-flight, verifies protective bubble blocks intersecting filings.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-090] Build Deterministic Urban Airspace Crisis Scenario Replayer
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/flight-plan-saga/src/crisis-replayer.ts`

#### Description
Replay offline JSON airspace crisis scripts (e.g., 'Airport-Closure-Diversion', 'Rush-Hour-Storm-Cell') deterministically. Implement this module in strict TypeScript inside `apps/airspace-controller` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/flight-plan-saga/src/crisis-replayer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Replays multi-event crisis in seconds with 0 mid-air conflicts and 100% balanced ledger.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/airspace-controller/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Deterministic Urban Airspace Crisis Scenario Replayer` in `apps/flight-plan-saga/src/crisis-replayer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/flight-plan-saga/src/crisis-replayer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/airspace-controller/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-090`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `crisis-replayer.test.ts: executes 3-stage storm+emergency script and verifies zero conflicts.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 10: Control Plane API, Observability, Chaos & Release Verification

### [CRD-091] Implement Typed Zero-Dependency REST Router & Middleware Pipeline
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/router.ts`

#### Description
Build a fast HTTP router supporting path params (`/v1/flights/:id`), composable middleware (RBAC auth, rate-limit, CORS), and 1MB body caps. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/router.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Rejects oversized bodies with 413; executes middleware in exact order; returns RFC 7807 errors.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Typed Zero-Dependency REST Router & Middleware Pipeline` in `apps/control-plane-api/src/router.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/router.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-091`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `router.test.ts: tests param extraction, 404/405/413 responses, and auth middleware short-circuiting.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-092] Add Flight-Plan Filing, Cancellation & Status REST Endpoints
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/routes/flights.ts`

#### Description
Expose `POST /v1/flights`, `GET /v1/flights/:id`, and `DELETE /v1/flights/:id` wired directly into FlightPlanSagaCoordinator. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/routes/flights.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Validates payload strictly; returns 201 on clearance, 409 on airspace conflict.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Flight-Plan Filing, Cancellation & Status REST Endpoints` in `apps/control-plane-api/src/routes/flights.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/routes/flights.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-092`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `flights-route.test.ts: files valid flight (201), files conflicting flight (409), cancels flight (200).`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-093] Build Live Server-Sent Events (SSE) Airspace Radar & Alert Stream
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/routes/sse-radar.ts`

#### Description
Stream real-time drone positions, conflict alerts, and NOTAM updates over native HTTP SSE (`text/event-stream`). Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/routes/sse-radar.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Streams heartbeat pings and cleans up broker listeners immediately on client disconnect.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Live Server-Sent Events (SSE) Airspace Radar & Alert Stream` in `apps/control-plane-api/src/routes/sse-radar.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/routes/sse-radar.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-093`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `sse-radar.test.ts: connects HTTP client, publishes spoof alert, verifies SSE delivery and clean close.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-094] Implement Prometheus Text-Format `/metrics` Exporter
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/metrics-exporter.ts`

#### Description
Expose Counters, Gauges, and Histograms (active drones, locked voxels, conflict count, fan-out latency, ledger invariant status). Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/metrics-exporter.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Valid Prometheus exposition text format; exposes `corridor_ledger_invariant_status 1`.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Prometheus Text-Format `/metrics` Exporter` in `apps/control-plane-api/src/metrics-exporter.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/metrics-exporter.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-094`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `metrics-exporter.test.ts: scrapes `/metrics` and asserts required UTM metric families.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-095] Build OpenAPI 3.1 Specification Generator from Route Registry
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/openapi-gen.ts`

#### Description
Auto-generate and serve `GET /v1/openapi.json` directly from Corridor's typed route definitions. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/openapi-gen.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Valid OpenAPI 3.1 JSON covering every registered endpoint and error schema.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build OpenAPI 3.1 Specification Generator from Route Registry` in `apps/control-plane-api/src/openapi-gen.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/openapi-gen.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-095`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `openapi-gen.test.ts: parses generated spec and confirms 100% route coverage.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-096] Implement Regulator Emergency Airspace Ground-Stop API
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/routes/ground-stop.ts`

#### Description
Allow authenticated regulators to trigger `POST /v1/airspace/ground-stop` issuing signed EMERGENCY_LAND clearances to all non-medical drones in a sector. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/routes/ground-stop.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Grounds all commercial drones while keeping EMERGENCY_MED airborne; logs to hash-chained audit log.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Regulator Emergency Airspace Ground-Stop API` in `apps/control-plane-api/src/routes/ground-stop.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/routes/ground-stop.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-096`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ground-stop.test.ts: triggers sector ground-stop, verifies commercial drones land and medical continues.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-097] Build Structured JSON Logger with Secret Redaction & Trace IDs
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/logger.ts`

#### Description
Zero-dependency structured JSON logger with log-level filtering, automatic token/key redaction, and traceId correlation. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/logger.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Redacts Authorization headers and private keys; outputs valid single-line JSON.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Structured JSON Logger with Secret Redaction & Trace IDs` in `apps/control-plane-api/src/logger.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/logger.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-097`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `logger.test.ts: logs sensitive object and asserts `[REDACTED]` output.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-098] Implement Offline Chaos Test Suite (Crash Recovery, Spoof Storm, Replay)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `tests/chaos-suite.ts`

#### Description
Run automated chaos scenarios: mid-saga controller crash, 15% GPS-spoof storm, duplicate billing replays, and emergency preemption. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `tests/chaos-suite.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero mid-air collisions, zero leaked voxel locks, and zero ledger drift across all scenarios.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Offline Chaos Test Suite (Crash Recovery, Spoof Storm, Replay)` in `tests/chaos-suite.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `tests/chaos-suite.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-098`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `chaos-suite.test.ts: executes all 5 chaos scenarios offline with 100% pass rate.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-099] Build Interactive Offline UTM Operator CLI Console (`corridor-cli`)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/cli.ts`

#### Description
Zero-dependency `node:readline` CLI to inspect sector density, file test flights, activate NOTAMs, and run ledger audits live. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/cli.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Supports commands: `sector`, `file`, `notam`, `audit`, `spoofs`, `quit`.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Interactive Offline UTM Operator CLI Console (`corridor-cli`)` in `apps/control-plane-api/src/cli.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/cli.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-099`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `cli.test.ts: pipes scripted commands through mocked streams and asserts formatted output.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-100] Implement Deterministic Performance Regression Gate
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `tests/perf-gate.ts`

#### Description
Measure sustained telemetry ingest throughput, 4D conflict-scan latency, and 100-drone mass reroute speed. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `tests/perf-gate.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Outputs JSON SLA report and exits non-zero if any latency/throughput SLA regresses.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Deterministic Performance Regression Gate` in `tests/perf-gate.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `tests/perf-gate.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-100`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `perf-gate.test.ts: runs CI profile asserting <300ms reroute and <2s ledger audit.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-101] Build Consistent Offline State Snapshot & Point-in-Time Restore Tool
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/backup-restore.ts`

#### Description
Snapshot WAL segments, lease journal, ledger hash chain, and active NOTAMs with a SHA-256 manifest. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/backup-restore.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Restoring into a fresh runtime reproduces exact balances, active corridors, and offsets.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Consistent Offline State Snapshot & Point-in-Time Restore Tool` in `apps/control-plane-api/src/backup-restore.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/backup-restore.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-101`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `backup-restore.test.ts: snapshots, wipes state, restores, asserts identical ledger audit.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-102] Implement Ordered Graceful Shutdown Coordinator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/shutdown.ts`

#### Description
Handle SIGINT/SIGTERM cleanly: stop HTTP ingress -> drain telemetry ring buffer -> flush Outbox -> close WAL handles. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/shutdown.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero lost telemetry frames or uncommitted outbox events during shutdown.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Ordered Graceful Shutdown Coordinator` in `apps/control-plane-api/src/shutdown.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/shutdown.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-102`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `shutdown.test.ts: triggers shutdown mid-ingest and verifies 100% buffer flush.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-103] Build Deterministic Flight-Recorder Incident Replay Debugger
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/flight-recorder.ts`

#### Description
Record a compact event tape (seed + inputs + clock steps) to replay any airspace incident step-by-step offline. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/flight-recorder.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Replaying tape reproduces identical final ledger Merkle root and alert sequence.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Deterministic Flight-Recorder Incident Replay Debugger` in `apps/control-plane-api/src/flight-recorder.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/flight-recorder.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-103`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `flight-recorder.test.ts: records 60s run, replays in fresh runtime, asserts identical final state.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-104] Implement Multi-Tenant Aviation Authority & Fleet Isolation
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/tenant-isolation.ts`

#### Description
Isolate operator fleets, wallets, and API quotas by `tenantId` while sharing unified physical airspace conflict resolution. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/tenant-isolation.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Operator A cannot view Operator B's billing statements or cancel Operator B's flights.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Multi-Tenant Aviation Authority & Fleet Isolation` in `apps/control-plane-api/src/tenant-isolation.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/tenant-isolation.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-104`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `tenant-isolation.test.ts: verifies cross-tenant API isolation alongside shared airspace deconfliction.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [CRD-105] Create Offline Release Packaging & Zero-Dependency Audit Script
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `scripts/verify-offline-release.ts`

#### Description
Verify clean `tsc -b` build, zero external runtime dependencies in all `package.json` files, and full E2E test pass. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@corridor/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `scripts/verify-offline-release.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Exits 0 only when all 13 workspaces compile strictly with 0 external runtime deps.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@corridor/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Create Offline Release Packaging & Zero-Dependency Audit Script` in `scripts/verify-offline-release.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `scripts/verify-offline-release.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `CRD-105`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `verify-offline-release.test.ts: audits all workspace manifests and confirms 0 external runtime deps.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero airspace or ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---
