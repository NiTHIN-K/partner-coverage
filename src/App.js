import React, { useState } from 'react';
import USAMap from "react-usa-map";
// import stateData from "./CarrierStateMapping.csv"

function App() {

  // const csvString = stateData; // Import the CSV as a string
  // const lines = csvString.split('\n');

  // const originalData = {};

  // for (const line of lines) {
  //   const [key, value] = line.split(',');
  //   originalData[key] = value;
  //   console.log(key + " : " + value);
  // }

  // console.log("OGDATA" + originalData);
  // Initialize the state for the custom configurations
  const [customConfig, setCustomConfig] = useState({});

  // Define the statesCustomConfig function using the customConfig state
  const statesCustomConfig = () => {
    return customConfig;
  };

  // Define the mapHandler function to handle map clicks and update the state
  const mapHandler = (event) => {
    // Get the name of the clicked state
    const stateName = event.target.dataset.name;

    // Update the customConfig state to change the color of the clicked state
    setCustomConfig(prevConfig => ({
      ...prevConfig,
      [stateName]: { fill: "navy" } // Change the color to navy (or any desired color)
    }));
  };

  return (
    <div>
      <USAMap customize={statesCustomConfig()} onClick={mapHandler} />
    </div>
  );
}

export default App;
