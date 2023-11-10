import React, { useState, useEffect } from 'react';
import USAMap from "react-usa-map";
import Papa from 'papaparse'; // Assuming you are using PapaParse for CSV parsing

function App() {
  // State for the selected carrier and the custom map configuration
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [customConfig, setCustomConfig] = useState({});
  const [carrierStateMapping, setCarrierStateMapping] = useState({});
  const [carriers, setCarriers] = useState([]);

  useEffect(() => {
    const csvFilePath = 'https://partner-coverage.vercel.app/CarrierStateMapping.csv';
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const mapping = {};
        const carriersSet = new Set();

        result.data.forEach(row => {
          const carrierList = row.Carriers.split(',').map(c => c.trim());
          carrierList.forEach(carrier => {
            if (!mapping[carrier]) {
              mapping[carrier] = [];
            }
            mapping[carrier].push(row.code);
            carriersSet.add(carrier);
          });
        });

        setCarrierStateMapping(mapping);
        setSelectedCarrier(Array.from(carriersSet)[0]);
        setCarriers(Array.from(carriersSet)); // Update the carriers state
        // console.log(Array.from(carriersSet)); // Log the carriers to ensure they're set
      }
    });
  }, []);



  // Update the map when a new carrier is selected
  useEffect(() => {
    if (!selectedCarrier || !carrierStateMapping[selectedCarrier]) return;

    const statesToHighlight = carrierStateMapping[selectedCarrier];
    const newConfig = statesToHighlight.reduce((config, state) => {
      config[state] = { fill: "blue" }; // Choose your highlight color
      return config;
    }, {});

    setCustomConfig(newConfig);
  }, [selectedCarrier, carrierStateMapping]);

  // Dropdown change handler
  const handleCarrierChange = (event) => {
    setSelectedCarrier(event.target.value);
  };

  return (
    <div>
      {/* <select onChange={handleCarrierChange} value={selectedCarrier}>
        {Object.keys(carrierStateMapping).map(carrier => (

          <option key={carrier} value={carrier}>{carrier}</option>
        ))}
      </select> */}
      <select onChange={handleCarrierChange} value={selectedCarrier}>
        {carriers.map(carrier => ( // Use the carriers state here
          <option key={carrier} value={carrier}>{carrier}</option>
        ))}
      </select>
      <USAMap customize={customConfig} />
    </div>
  );
}

export default App;