import react from "react"

const FunctionEditorHelp = {
    content: <div>
        Write a javascript function y = f(x) <br /><br />
        What is the input to the function?: the x value <br /><br />
        What should it return?: <br />
        if f(x) is single valued, return just y value,<br />
        {"Or you can return an object { value: yValue, color: '#F5A'}"}<br /><br />
        What if f(x) is multi-valued, return an array of y values (for a given x value),<br />
        Otherwise, It can be an array of objects corresponding to each y value and it's color<br />
        {"[ { value: yValue1, color: '#F5A' }, { value: yValue2, color: '#6FD' }]"}<br /><br />

        Render a polar function output?, check the checkbox 'Polar Function'<br />
        Now your function should be,<br />
        {"r = f(θ)"}
        
    </div>,
    title: "How to write a math function?"

}

export {
    FunctionEditorHelp
}