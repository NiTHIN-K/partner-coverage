# Partner Coverage

Partner Coverage is a client-side coverage explorer for comparing regional delivery carriers across United States states. It loads a versioned CSV fixture, converts it into a carrier-to-state map in the browser, and lets visitors overlay one or more carriers on a responsive state grid.

## Highlights

- Reads coverage data from the local `public/CarrierStateMapping.csv` fixture.
- Normalizes carrier notes while preserving the underlying state mapping.
- Supports multi-carrier selection with accessible toggle controls.
- Shows a live count of covered states.
- Keeps parsing and map configuration logic covered by focused tests.

## Run locally

Requires Node.js 18 or newer.

```bash
npm ci
npm start
```

## Verify

```bash
npm test -- --watchAll=false
npm run build
```

## Data notes

Coverage information is only as current as the included CSV fixture. Update and review the dataset before making operational decisions from the visual.

## License

Released under the [MIT License](LICENSE).
