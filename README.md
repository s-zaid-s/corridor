# CORRIDOR — Pure TypeScript Offline Autonomous Drone Airspace (UTM) Monorepo

Corridor is a zero-external-dependency, 100% TypeScript backend monorepo implementing a distributed Unmanned Traffic Management (UTM) system: 4D spatial-temporal flight-path conflict resolution, atomic airspace voxel locking, kinematic GPS-spoofing detection, durable flight-plan clearance Sagas, and an ACID double-entry airspace billing & penalty ledger.

## Offline-First Design
Every infrastructure primitive—event broker, 4D spatial index, distributed voxel lease manager, Ed25519 clearance signer, and double-entry financial ledger—is implemented natively in strict TypeScript using only Node.js built-in modules (`node:http`, `node:crypto`, `node:fs`, `node:test`).

## Quick Start (100% Offline)
1. Install TypeScript devDependencies once: `pnpm install --offline`
2. Compile the entire monorepo: `pnpm run build`
3. Boot the simulated airspace & Control Plane API: `pnpm run start:offline`
4. Run the end-to-end integration test suite: `pnpm test`

See `roadmap.md` for the complete 105-ticket engineering backlog.
