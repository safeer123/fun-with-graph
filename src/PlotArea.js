import React from "react";
import { get } from "lodash";

const polarToXY = (t, r) => [r * Math.cos(t), r * Math.sin(t)];

const Point = ({ style, color }) => {
  return (
    <div className="point-root" style={style}>
      <div className="point-circle" style={{ backgroundColor: color }} />
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
  const ref = React.useRef(null);

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

  const computeYandPlot = (pts, graphFunction, polar) => {
    let xMinVal = undefined;
    let xMaxVal = undefined;
    let yMinVal = undefined;
    let yMaxVal = undefined;
    const pushVals = (list, x0, y0, color) => {
      let xy = [x0, y0];
      if (polar) {
        xy = polarToXY(x0, y0);
      }
      list.push([xy[0], xy[1], color]);
      xMaxVal = xMaxVal === undefined ? xy[0] : Math.max(xy[0], xMaxVal);
      xMinVal = xMinVal === undefined ? xy[0] : Math.min(xy[0], xMinVal);
      yMaxVal = yMaxVal === undefined ? xy[1] : Math.max(xy[1], yMaxVal);
      yMinVal = yMinVal === undefined ? xy[1] : Math.min(xy[1], yMinVal);
    };
    const pushObj = (list, x0, { value, color }) => {
      pushVals(list, x0, value, color);
    };
    setTimeout(() => {
      const plotData = [];
      pts.forEach((x) => {
        const y = computeY(x, graphFunction);
        const yType = typeof y;
        if (yType === "number" && Number.isFinite(y)) {
          pushVals(plotData, x, y);
        } else if (yType === "object" && y.length > 0) {
          y.forEach((yVal) => {
            if (typeof yVal === "number" && Number.isFinite(yVal)) {
              pushVals(plotData, x, yVal);
            } else if (
              typeof yVal === "object" &&
              Number.isFinite(yVal.value)
            ) {
              pushObj(plotData, x, yVal);
            }
          });
        } else if (yType === "object" && Number.isFinite(y.value)) {
          pushObj(plotData, x, y);
        }
      });
      // console.log(plotData);
      // console.log(pts, xMinVal, xMaxVal, yMinVal, yMaxVal);
      if (polar) {
        const ar = getAspectRatio();
        const maxFromAll = Math.max(
          Math.abs(xMinVal),
          Math.abs(xMaxVal),
          Math.abs(yMinVal),
          Math.abs(yMaxVal)
        );
        setXMin(-ar * maxFromAll);
        setXMax(+ar * maxFromAll);
        setYMin(-maxFromAll);
        setYMax(+maxFromAll);
      } else {
        setXMin(xMinVal);
        setXMax(xMaxVal);
        setYMin(yMinVal);
        setYMax(yMaxVal);
      }
      setPoints(plotData);
    }, 0);
  };

  React.useEffect(() => {
    const graphConfig = get(data, "config");
    // console.log(graphConfig);
    if (graphConfig) {
      const { startVal, endVal, step, polar } = graphConfig;
      const pts = [];
      let x = startVal;
      for (; x <= endVal; x += step) {
        pts.push(x);
      }
      if (x > endVal) pts.push(endVal);
      const graphFunction = get(data, "config.function");
      if (graphFunction && pts && pts.length > 0) {
        computeYandPlot(pts, graphFunction, polar);
      }
      // console.log(pts);
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

  const getAspectRatio = () => {
    const width = get(ref, "current.clientWidth");
    const height = get(ref, "current.clientHeight");
    if (width > 0 && height > 0) {
      return width / height;
    }
    return 1;
  };

  const func = get(data, "config.function");
  // console.log(func);
  return (
    <div className="plot-area-root">
      <div className="code-bg">
        <pre>{func && func.toString()}</pre>
      </div>
      <div className="plot-area" ref={ref} onMouseMove={handleMouseHover}>
        {points.map((pt) => {
          // console.log(pointToCoord(pt));
          const coord = pointToCoord(pt);
          if (coord)
            return (
              <Point key={`${pt[0]}_${pt[1]}`} style={coord} color={pt[2]} />
            );
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
