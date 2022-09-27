import React from "react";
import { get } from "lodash";
import { Button, Popover } from "antd";
import {
  QuestionCircleOutlined,
} from '@ant-design/icons';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import FunctionsSlides from "./FunctionsSlides";
import functions from "./FunctionsSlides/functions";
import { FunctionEditorHelp } from "./helperContent";

const MAX_FUNC_DESC_LENGTH_TO_DISPLAY = 100;

export default function GraphInputs({ onChange }) {
  const [showInputPopover, setShowInputPopover] = React.useState(false);

  const [inputValidation, setInputValidation] = React.useState({
    function: eval(functions[0].function),
    startVal: eval(functions[0].startVal),
    endVal: eval(functions[0].endVal),
    step: eval(functions[0].step),
    functionDesc: functions[0].function,
    polar: functions[0].polar
  });

  const [inputs, setInputs] = React.useState(functions[0]);

  React.useEffect(() => {
    done();
  }, [])

  const handleChangeFunc = (val) => {
    // console.log(val);
    setInputs({
      ...inputs,
      function: val
    });
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
    setInputs({
      ...inputs,
      [inputKey]: e.target.value
    });
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

  const handleChangePolar = (e) => {
    setInputs({
      ...inputs,
      polar: e.target.checked
    });
    setInputValidation({
      ...inputValidation,
      polar: e.target.checked
    });
  };

  const allGood = () => {
    const invalidInputs = [
      inputValidation.function,
      inputValidation.startVal,
      inputValidation.endVal,
      inputValidation.step
    ].some((v) => v === false);
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

  const onSelectFunction = (f) => {
    setInputValidation({
      function: eval(f.function),
      startVal: eval(f.startVal),
      endVal: eval(f.endVal),
      step: eval(f.step),
      functionDesc: f.function,
      polar: f.polar
    });
    setInputs(f);
  };

  return (
    <>
      <div
        className="header"
        
      >
        <Button
          onClick={() => setShowInputPopover(!showInputPopover)}
          size="small"
          type="primary"
        >
          Function Editor 
        </Button>
      </div>

      <div
        className={showInputPopover ? "inputAreaRoot" : "inputAreaRoot-closed"}
        style={{ opacity: showInputPopover ? 1 : 0 }}
      >
        <FunctionsSlides onSelect={onSelectFunction} />

        <div className="inputItem">
          <div className="inputItemTitle">
            <span>Function Editor</span>
            <Popover content={FunctionEditorHelp.content} title={FunctionEditorHelp.title}>
              <QuestionCircleOutlined className="helper-icon-editor"/>
            </Popover>
            </div>
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
            value={inputs.function}
            //defaultValue={inputValidation.functionDesc}
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
              value={inputs.startVal}
              // defaultValue={inputValidation.startVal}
            />
          </div>
          <div className="inputSubItem">
            <div className="inputItemTitle">End Value</div>
            <input
              className="inputField"
              onChange={handleChangeEndVal}
              value={inputs.endVal}
              // defaultValue={inputValidation.endVal}
            />
          </div>
          <div className="inputSubItem">
            <div className="inputItemTitle">Step Size</div>
            <input
              className="inputField"
              onChange={handleChangeStepSize}
              value={inputs.step}
              // defaultValue={inputValidation.step}
            />
          </div>
          <div className="inputSubItem inline-items">
            <input
              type="checkbox"
              className="checkbox-input"
              onChange={handleChangePolar}
              checked={inputs.polar}
              // defaultValue={inputValidation.step}
            />
            <div className="checkbox-label">Polar Function</div>
          </div>
          <div className="inputSubItem">
            <span>
              <button disabled={!allGood()} className="editor-action-button" onClick={done}>
                Render Graph
              </button>
              <button className="editor-action-button" onClick={() => setShowInputPopover(false)}>Close</button>
            </span>

          </div>
        </div>
      </div>
    </>
  );
}
