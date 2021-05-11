import React from "react";
import { get } from "lodash";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const MAX_FUNC_DESC_LENGTH_TO_DISPLAY = 100;
const DEFAULT_FUNC = `
(r) => {
  const y = x => r*x*(1-x);
  let y0 = 0.4;
  for(let i=0; i<1000+((r*1000)%7); i+=1) {
    y0 = y(y0);
  }
  return y0;
}
`;
export default function GraphInputs({ onChange }) {
  const [showInputPopover, setShowInputPopover] = React.useState(false);

  const [inputValidation, setInputValidation] = React.useState({
    function: (r) => {
      const y = (x) => r * x * (1 - x);
      let y0 = 0.4;
      for (let i = 0; i < 1000 + ((r * 1000) % 7); i += 1) {
        y0 = y(y0);
      }
      return y0;
    },
    startVal: 1,
    endVal: 4.2,
    step: 0.0005,
    functionDesc: DEFAULT_FUNC
  });

  const handleChangeFunc = (val) => {
    // console.log(val);
    try {
      const func = eval(val);
      const inputType = typeof func;
      if (inputType === "function") {
        const functionDesc = func
          .toString()
          .substr(0, MAX_FUNC_DESC_LENGTH_TO_DISPLAY);
        // console.log(func, typeof func, functionDesc);
        setInputValidation({
          ...inputValidation,
          function: func,
          functionDesc
        });
      } else {
        setInputValidation({
          ...inputValidation,
          function: false,
          functionDesc: ""
        });
      }
    } catch (err) {
      console.log(err);
      setInputValidation({
        ...inputValidation,
        function: false,
        functionDesc: ""
      });
    }
  };

  const numberFieldChangeHandler = (inputKey) => (e) => {
    try {
      const val = eval(e.target.value);
      const inputType = typeof val;
      // console.log(func, typeof func);
      if (inputType === "number" && Number.isFinite(+val)) {
        setInputValidation({
          ...inputValidation,
          [inputKey]: +val
        });
      } else {
        setInputValidation({
          ...inputValidation,
          [inputKey]: false
        });
      }
    } catch (err) {
      console.log(err);
      setInputValidation({
        ...inputValidation,
        [inputKey]: false
      });
    }
  };

  const handleChangeStartVal = numberFieldChangeHandler("startVal");
  const handleChangeEndVal = numberFieldChangeHandler("endVal");
  const handleChangeStepSize = numberFieldChangeHandler("step");

  const allGood = () => {
    const invalidInputs = Object.values(inputValidation).some(
      (v) => v === false
    );
    if (!invalidInputs) {
      if (inputValidation.endVal > inputValidation.startVal) {
        const xSpan = inputValidation.endVal - inputValidation.startVal;
        if (inputValidation.step < xSpan) {
          return true;
        }
      }
    }
    return false;
  };

  const done = (e) => {
    if (allGood()) {
      const graphDataCreated = {
        config: inputValidation
      };
      onChange(graphDataCreated);
      setShowInputPopover(false);
    } else {
      onChange(undefined);
    }
  };

  return (
    <>
      <div
        className="header"
        onClick={() => setShowInputPopover(!showInputPopover)}
      >
        {inputValidation.functionDesc}
      </div>

      <div
        className={showInputPopover ? "inputAreaRoot" : "inputAreaRoot-closed"}
        style={{ opacity: showInputPopover ? 1 : 0 }}
      >
        <div className="inputItem">
          <div className="inputItemTitle">Function</div>
          {/* <textarea
            className="textAreaBox"
            rows={8}
            cols={40}
            onChange={(e) => handleChangeFunc(e.target.value)}
            defaultValue={inputValidation.functionDesc}
          /> */}
          <AceEditor
            placeholder="Function Definition"
            mode="javascript"
            theme="github"
            name="function-editor"
            height={"300px"}
            // onLoad={this.onLoad}
            onChange={handleChangeFunc}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            defaultValue={inputValidation.functionDesc}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2
            }}
          />
        </div>

        <div className="inputItem">
          <div className="inputSubItem">
            <div className="inputItemTitle">Start Value</div>
            <input
              className="inputField"
              onChange={handleChangeStartVal}
              defaultValue={inputValidation.startVal}
            />
          </div>
          <div className="inputSubItem">
            <div className="inputItemTitle">End Value</div>
            <input
              className="inputField"
              onChange={handleChangeEndVal}
              defaultValue={inputValidation.endVal}
            />
          </div>
          <div className="inputSubItem">
            <div className="inputItemTitle">Step Size</div>
            <input
              className="inputField"
              onChange={handleChangeStepSize}
              defaultValue={inputValidation.step}
            />
          </div>
        </div>

        <div className="inputItem">
          <div />
          <div className="inputSubItem">
            <button disabled={!allGood()} className="doneButton" onClick={done}>
              DONE
            </button>
          </div>
          <div />
        </div>
      </div>
    </>
  );
}
