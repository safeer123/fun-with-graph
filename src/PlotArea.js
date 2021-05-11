import React from "react";
import { get, isNumber } from "lodash";

const MAX_COUNT_TO_COMPUTE = 3;
const DELAY = 1000;

const Point = ({ style }) => {
  return (
    <div className="point-root" style={style}>
      <div className="point-circle" />
    </div>
  );
};

const Labels = ({ xMin, xMax, yMin, yMax, mouseX, mouseY }) => {
  return (
    <>
      <div className="x-min-label">{xMin}</div>
      <div className="x-max-label">{xMax}</div>
      <div className="y-min-label">{yMin}</div>
      <div className="y-max-label">{yMax}</div>
      <div className="mouse-label">
        X : {xMin + mouseX * (xMax - xMin)} | Y :{" "}
        {yMin + mouseY * (yMax - yMin)}
      </div>
    </>
  );
};

export default function PlotArea({ data = {} }) {
  const [points, setPoints] = React.useState([]);
  const [xMin, setXMin] = React.useState(undefined);
  const [xMax, setXMax] = React.useState(undefined);
  const [yMin, setYMin] = React.useState(undefined);
  const [yMax, setYMax] = React.useState(undefined);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [processing, setProcessing] = React.useState(false);

  const computeY = (x, graphFunction) => {
    try {
      // console.log(pts);
      if (Number.isFinite(x)) {
        const y = graphFunction(x);
        return y;
      }
      return undefined;
    } catch (err) {
      return undefined;
    }
  };
  const computeYandPlot = (pts, graphFunction) => {
    const xMinVal = pts[0];
    const xMaxVal = pts[pts.length - 1];
    let yMinVal = undefined;
    let yMaxVal = undefined;
    setTimeout(() => {
      const plotData = [];
      pts.forEach((x) => {
        const y = computeY(x, graphFunction);
        if (Number.isFinite(y)) {
          plotData.push([x, y]);
          if (yMaxVal === undefined || (yMaxVal !== undefined && y > yMaxVal)) {
            yMaxVal = y;
          }
          if (yMinVal === undefined || (yMinVal !== undefined && y < yMinVal)) {
            yMinVal = y;
          }
        }
      });
      // console.log(plotData);
      // console.log(pts, xMinVal, xMaxVal, yMinVal, yMaxVal);
      setXMin(xMinVal);
      setXMax(xMaxVal);
      setYMin(yMinVal);
      setYMax(yMaxVal);
      setPoints(plotData);
    }, 0);
  };

  React.useEffect(() => {
    // console.log(get(data, "config.function"));
    const graphConfig = get(data, "config");
    if (graphConfig) {
      const { startVal, endVal, step } = graphConfig;
      const pts = [];
      let x = startVal;
      for (; x <= endVal; x += step) {
        pts.push(x);
      }
      if (x > endVal) pts.push(endVal);
      const graphFunction = get(data, "config.function");
      if (graphFunction && pts && pts.length > 0) {
        computeYandPlot(pts, graphFunction);
      }
    }
    // process data and create points
  }, [data]);

  const pointToCoord = (pt) => {
    if (xMax > xMin && yMax > yMin) {
      return {
        left: `${(100 * (pt[0] - xMin)) / (xMax - xMin)}%`,
        top: `${100 - (100 * (pt[1] - yMin)) / (yMax - yMin)}%`
      };
    }
    return null;
  };

  const handleMouseHover = (e) => {
    // console.log(e.target.offsetWidth, e.target.offsetHeight);
    setMousePos({
      x: e.nativeEvent.offsetX / e.target.offsetWidth,
      y: 1 - e.nativeEvent.offsetY / e.target.offsetHeight
    });
  };

  const func = get(data, "config.function");
  console.log(func);
  return (
    <div className="plot-area-root">
      <div className="code-bg">
        <pre>{func && func.toString()}</pre>
      </div>
      <div className="plot-area" onMouseMove={handleMouseHover}>
        {points.map((pt) => {
          // console.log(pointToCoord(pt));
          const coord = pointToCoord(pt);
          if (coord) return <Point key={`${pt[0]}`} style={coord} />;
          else return null;
        })}
        <Labels
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
        />
      </div>
      {/* <div>
        {JSON.stringify(data)}
        <br />
        {JSON.stringify(points)}
      </div> */}
    </div>
  );
}
