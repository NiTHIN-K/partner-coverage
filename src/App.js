// import React, { useState, useEffect } from 'react';
// import USAMap from "react-usa-map";
// import Papa from 'papaparse'; // Assuming you are using PapaParse for CSV parsing
// import Select from 'react-select'; // You may need to install react-select

// const carrierColors = {
//   "International Bridge": "#FF5733",  // Red
//   "Courier Express": "#FFC300",  // Yellow
//   "Hackbarth": "#DAF7A6",  // Light Green
//   "LSO": "#581845",  // Dark Purple
//   "GLS": "#C70039",  // Maroon
//   "IntelliQuick Delivery": "#900C3F",  // Dark Red
//   "OnTrac": "#FFC0CB",  // Pink
//   "LaserShip": "#3498DB",  // Blue
//   "Pitt Ohio": "#1ABC9C",  // Turquoise
//   "Spee-Dee Delivery": "#2ECC71", // Green
//   "United Delivery Service": "#F1C40F", // Mustard
//   "Carrier12": "#A569BD", // Purple
//   "Carrier13": "#34495E", // Dark Blue
//   "Carrier14": "#7D3C98"  // Violet
// };


// function App() {
//   // State for the selected carrier and the custom map configuration
//   const [selectedCarrier, setSelectedCarrier] = useState('');
//   const [customConfig, setCustomConfig] = useState({});
//   const [carrierStateMapping, setCarrierStateMapping] = useState({});
//   const [carriers, setCarriers] = useState([]);

//   useEffect(() => {
//     const csvFilePath = 'https://partner-coverage.vercel.app/CarrierStateMapping.csv';
//     Papa.parse(csvFilePath, {
//       download: true,
//       header: true,
//       skipEmptyLines: true,
//       complete: (result) => {
//         const mapping = {};
//         const carriersSet = new Set();

//         result.data.forEach(row => {
//           const carrierList = row.Carriers.replace(/\([^)]*\)/g, '').split(',').map(c => c.trim());
//           carrierList.forEach(carrier => {
//             if (!mapping[carrier]) {
//               mapping[carrier] = [];
//             }
//             mapping[carrier].push(row.code);
//             carriersSet.add(carrier);
//           });
//         });

//         setCarrierStateMapping(mapping);
//         setSelectedCarrier(Array.from(carriersSet)[0]);
//         setCarriers(Array.from(carriersSet)); // Update the carriers state
//         // console.log(Array.from(carriersSet)); // Log the carriers to ensure they're set
//       }
//     });
//   }, []);

//   // Update the map when a new carrier is selected
//   useEffect(() => {
//     if (!selectedCarrier || !carrierStateMapping[selectedCarrier]) return;

//     const statesToHighlight = carrierStateMapping[selectedCarrier];
//     const newConfig = { ...customConfig };

//     statesToHighlight.forEach(state => {
//       // Directly assign the carrier's color to the state
//       newConfig[state] = { fill: carrierColors[selectedCarrier] };
//     });

//     setCustomConfig(newConfig);
//   }, [selectedCarrier, carrierStateMapping]);

//   // Dropdown change handler
//   const handleCarrierChange = (event) => {
//     setSelectedCarrier(event.target.value);
//   };

//   return (
//     <div>
//       {/* <select onChange={handleCarrierChange} value={selectedCarrier}>
//         {Object.keys(carrierStateMapping).map(carrier => (

//           <option key={carrier} value={carrier}>{carrier}</option>
//         ))}
//       </select> */}
//       <select onChange={handleCarrierChange} value={selectedCarrier}>
//         {carriers.map(carrier => ( // Use the carriers state here
//           <option key={carrier} value={carrier}>{carrier}</option>
//         ))}
//       </select>
//       <USAMap customize={customConfig} />
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import USAMap from "react-usa-map";
import Papa from 'papaparse';
import Select from 'react-select'; // Ensure you have installed react-select

const carrierColors = {
  "International Bridge": "#FF5733",  // Red
  "Courier Express": "#FFC300",  // Yellow
  "Hackbarth": "#DAF7A6",  // Light Green
  "LSO": "#581845",  // Dark Purple
  "GLS": "#C70039",  // Maroon
  "IntelliQuick Delivery": "#900C3F",  // Dark Red
  "OnTrac": "#FFC0CB",  // Pink
  "LaserShip": "#3498DB",  // Blue
  "Pitt Ohio": "#1ABC9C",  // Turquoise
  "Spee-Dee Delivery": "#2ECC71", // Green
  "United Delivery Service": "#F1C40F", // Mustard
  "Carrier12": "#A569BD", // Purple
  "Carrier13": "#34495E", // Dark Blue
  "Carrier14": "#7D3C98"  // Violet
};

function App() {
  const [selectedCarriers, setSelectedCarriers] = useState([]);
  const [customConfig, setCustomConfig] = useState({});
  const [carrierStateMapping, setCarrierStateMapping] = useState({});
  const [carrierOptions, setCarrierOptions] = useState([]);

  // useEffect(() => {
  //   const csvFilePath = 'https://partner-coverage.vercel.app/CarrierStateMapping.csv';
  //   Papa.parse(csvFilePath, {
  //     download: true,
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: (result) => {
  //       const mapping = {};
  //       const carriersSet = new Set();

  //       result.data.forEach(row => {
  //         const carrierList = row.Carriers.replace(/\([^)]*\)/g, '').split(',').map(c => c.trim());
  //         carrierList.forEach(carrier => {

  //           if (!mapping[carrier]) {
  //             mapping[carrier] = [];
  //           }
  //           mapping[carrier].push(row.code);
  //           carriersSet.add(carrier);
  //         });
  //       });

  //       setCarrierStateMapping(mapping);
  //       setCarrierOptions(Array.from(carriersSet).map(carrier => ({ value: carrier, label: carrier }))); // Corrected here
  //     }
  //   });
  // }, []);

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
          const carrierList = row.Carriers.replace(/\([^)]*\)/g, '').split(',').map(c => c.trim());
          carrierList.forEach(carrier => {
            if (carrier !== "N/A") { // Ignore carrier with the name "N/A"
              if (!mapping[carrier]) {
                mapping[carrier] = [];
              }
              mapping[carrier].push(row.code);
              carriersSet.add(carrier);
            }
          });
        });

        setCarrierStateMapping(mapping);
        setCarrierOptions(Array.from(carriersSet).map(carrier => ({ value: carrier, label: carrier }))); // Corrected here
      }
    });
  }, []);

  useEffect(() => {
    let newConfig = {};

    selectedCarriers.forEach(({ value }) => {
      carrierStateMapping[value].forEach(state => {
        newConfig[state] = { fill: carrierColors[value] };
      });
    });

    setCustomConfig(newConfig);
  }, [selectedCarriers, carrierStateMapping]);

  const handleCarrierChange = (carrier) => {
    setSelectedCarriers((prevSelectedCarriers) => {
      // If the carrier is already selected, remove it
      if (prevSelectedCarriers.find((selected) => selected.value === carrier.value)) {
        return prevSelectedCarriers.filter((selected) => selected.value !== carrier.value);
      }
      // Otherwise, add it
      else {
        return [...prevSelectedCarriers, carrier];
      }
    });
  };

  return (
    <div>
      {/* <Select
        // options={carrierOptions}
        // isMulti
        // onChange={handleCarrierChange}
        // value={selectedCarriers}
        // className="multi-select"
  // />*/}
      <div className="carrier-buttons" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {carrierOptions.map((carrier) => (
          <button
            key={carrier.value}
            style={{
              backgroundColor: carrierColors[carrier.value],
              color: 'white',
              border: selectedCarriers.find((selected) => selected.value === carrier.value) ? '2px solid black' : '',
              borderRadius: '20px', // make the button rounded
              padding: '10px 20px', // add some padding
              margin: '5px', // add some margin
              fontSize: '1em', // increase the font size
              transition: 'all 0.3s ease', // add a transition for smooth color change
              outline: 'none', // remove the outline
            }}
            onClick={() => handleCarrierChange(carrier)}
          >
            {carrier.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <USAMap customize={customConfig} />
      </div>    </div>
  );
}

export default App;
