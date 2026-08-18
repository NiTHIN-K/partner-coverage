import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import './App.css';

const PALETTE = ['#0d9488', '#2563eb', '#9333ea', '#db2777', '#d97706', '#65a30d', '#0891b2'];

export function buildCarrierStateMapping(rows) {
  return rows.reduce((mapping, row) => {
    if (!row.code || !row.Carriers) {
      return mapping;
    }

    row.Carriers.split(',')
      .map((carrier) => carrier.replace(/\([^)]*\)/g, '').replace(/\u00a0/g, ' ').trim())
      .filter((carrier) => carrier && carrier !== 'N/A')
      .forEach((carrier) => {
        mapping[carrier] = [...new Set([...(mapping[carrier] || []), row.code.trim()])];
      });

    return mapping;
  }, {});
}

export function colorForCarrier(carrier, carriers) {
  return PALETTE[carriers.indexOf(carrier) % PALETTE.length];
}

export function buildMapConfig(selectedCarriers, mapping, carriers) {
  return selectedCarriers.reduce((config, carrier) => {
    (mapping[carrier] || []).forEach((state) => {
      config[state] = { fill: colorForCarrier(carrier, carriers) };
    });
    return config;
  }, {});
}

function App() {
  const [mapping, setMapping] = useState({});
  const [selectedCarriers, setSelectedCarriers] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    Papa.parse(`${process.env.PUBLIC_URL}/CarrierStateMapping.csv`, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length) {
          setStatus('error');
          return;
        }
        setMapping(buildCarrierStateMapping(data));
        setStatus('ready');
      },
      error: () => setStatus('error'),
    });
  }, []);

  const carriers = useMemo(() => Object.keys(mapping).sort(), [mapping]);
  const mapConfig = useMemo(
    () => buildMapConfig(selectedCarriers, mapping, carriers),
    [selectedCarriers, mapping, carriers],
  );
  const coveredStateCount = useMemo(
    () => new Set(selectedCarriers.flatMap((carrier) => mapping[carrier] || [])).size,
    [selectedCarriers, mapping],
  );
  const allStates = useMemo(
    () => [...new Set(Object.values(mapping).flat())].sort(),
    [mapping],
  );

  const toggleCarrier = (carrier) => {
    setSelectedCarriers((selected) => (
      selected.includes(carrier)
        ? selected.filter((item) => item !== carrier)
        : [...selected, carrier]
    ));
  };

  return (
    <main className="coverage-page">
      <section className="coverage-hero" aria-labelledby="coverage-heading">
        <p className="eyebrow">Coverage explorer</p>
        <h1 id="coverage-heading">Compare regional delivery coverage at a glance.</h1>
        <p>Select one or more carriers to see their reported state coverage. The underlying data is included in this repository as a CSV fixture.</p>
      </section>

      <section className="coverage-workspace" aria-label="Carrier coverage map">
        <div className="coverage-controls">
          <div className="control-heading">
            <div>
              <h2>Carriers</h2>
              <p>{status === 'ready' ? `${carriers.length} available` : 'Loading coverage data…'}</p>
            </div>
            {selectedCarriers.length > 0 && (
              <button className="clear-button" type="button" onClick={() => setSelectedCarriers([])}>Clear</button>
            )}
          </div>
          {status === 'error' && <p className="status-message" role="alert">Coverage data could not be loaded.</p>}
          <div className="carrier-list" aria-label="Carrier selection">
            {carriers.map((carrier) => {
              const isSelected = selectedCarriers.includes(carrier);
              return (
                <button
                  className={`carrier-button${isSelected ? ' selected' : ''}`}
                  key={carrier}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleCarrier(carrier)}
                >
                  <span style={{ background: colorForCarrier(carrier, carriers) }} aria-hidden="true" />
                  {carrier}
                </button>
              );
            })}
          </div>
        </div>

        <div className="map-panel">
          <div className="map-summary">
            <div>
              <span>Selection</span>
              <strong>{selectedCarriers.length || 'No'} {selectedCarriers.length === 1 ? 'carrier' : 'carriers'}</strong>
            </div>
            <div>
              <span>Covered states</span>
              <strong>{coveredStateCount}</strong>
            </div>
          </div>
          <div className="state-grid" aria-label="United States state coverage grid">
            {allStates.map((state) => (
              <div
                className={`state-tile${mapConfig[state] ? ' covered' : ''}`}
                key={state}
                style={mapConfig[state] ? { backgroundColor: mapConfig[state].fill } : undefined}
              >
                {state}
              </div>
            ))}
          </div>
          <p className="map-note">Where coverage overlaps, the most recently selected carrier color is displayed.</p>
        </div>
      </section>
    </main>
  );
}

export default App;
