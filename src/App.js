import React from "react";

import GraphInputs from "./GraphInputs";
import PlotArea from "./PlotArea";
import "./styles.css";

export default function App() {
  const [graphInputData, setGraphInputData] = React.useState(undefined);
  const onChangeGraphInputs = (graphData) => {
    setGraphInputData(graphData);
  };
  return (
    <div className="app-area">
      <GraphInputs onChange={onChangeGraphInputs} />
      <PlotArea data={graphInputData} />
    </div>
  );
}
