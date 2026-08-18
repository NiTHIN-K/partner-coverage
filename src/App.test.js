import { buildCarrierStateMapping, buildMapConfig, colorForCarrier } from './App';

const rows = [
  { code: 'CA', Carriers: 'Northwind (legacy), Southwind' },
  { code: 'OR', Carriers: 'Northwind, N/A' },
];

test('builds a carrier-to-state mapping from the CSV rows', () => {
  expect(buildCarrierStateMapping(rows)).toEqual({
    Northwind: ['CA', 'OR'],
    Southwind: ['CA'],
  });
});

test('builds map colors for selected carriers', () => {
  const mapping = buildCarrierStateMapping(rows);
  const carriers = Object.keys(mapping).sort();

  expect(buildMapConfig(['Northwind'], mapping, carriers)).toEqual({
    CA: { fill: colorForCarrier('Northwind', carriers) },
    OR: { fill: colorForCarrier('Northwind', carriers) },
  });
});
