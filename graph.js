import React from 'react'

const graph = () => {


function parseEquation(input){
    // Important that white spaces are removed first
    input = input.replace(/\s+/g,""); // remove whitespaces
    input = input.replace(/([\-\+])([xy])/g,"$11$2"); // convert -x -y or +x +y to -1x -1y or +1x +1y
                                                      // just to make the logic below a little simpler
    var newTerm = () => {term = { val : null, scalar : 1, left : left, };} // create a new term
    var pushTerm = () => {terms.push(term); term = null;} // push term and null current
    // regExp [xy=] gets "x","y", or "="" or [\-\+]??[0-9\.]+  gets +- number with decimal
    var reg =/[xy=]|[\-\+]??[0-9\.eE]+/g;   // regExp to split the input string into parts
    var parts = input.match(reg);           // get all the parts of the equation
    var terms = [];     // an array of all terms parsed
    var term = null;    // Numbers as constants and variables with scalars are terms
    var left = true;    // which side of equation a term is
    parts.forEach( p=> { 
        if (p === "x" || p === "y") {
            if (term !== null && term.val !== null) {  // is the variable defined
                 pushTerm(); // yes so push to the stack and null 
            }
            if (term === null) { newTerm(); }  // do we need a new term?
            term.val = p;
        } else if( p === "=") {                // is it the equals sign
            if (!left) { throw new SyntaxError("Unxpected `=` in equation."); }
            if (term === null) { throw new SyntaxError("No left hand side of equation."); }// make sure that there is a left side
            terms.push(term);   // push the last left side term onto the stack
            term = null;
            left = false;       // everything on the right from here on in
        } else {                // all that is left are numbers (we hope)
            if (isNaN(p)){ throw new SyntaxError("Unknown value '"+p+"' in equation");  }//check that there is a number
            if (term !== null && (p[0] === "+" || p[0] === "-")) { // check if number is a new term
                 pushTerm();    // yes so push to the stack and null 
            }
            if (term === null) { newTerm(); } // do we need a new term?
            term.scalar *= Number(p);         // set the scalar to the new value
        }
    });

    if (term !== null) { // there may or may not be a term left to push to the stack
        pushTerm();
    }
    // now simplify the equation getting the scalar for left and right sides . x on left y on right
    var scalarX = 0;
    var scalarY = 0
    var valC = 0; // any constants 
    terms.forEach(t => {
        t.scalar *= !t.left ? -1 : 1; // everything on right is negative
        if (t.val === "y") {
            scalarY += -t.scalar; // reverse sign
        } else if (t.val === "x") {
            scalarX += t.scalar; 
        } else {
            valC += t.scalar;
        }
    })
    // now build the code string for the equation to solve for x and return y
    var code = "return (" + scalarX + " * x  + (" + valC + ")) / "+scalarY +";\n";
    var equation = new Function("x",code); // create the function
    return equation;
    function plot(equation) {
    var graph;
    var xPadding = 30;
    var yPadding = 30;

    var data = {
        values : [{
                X : "1",
                Y : 15
            }, {
                X : "2",
                Y : 35
            }, {
                X : "3",
                Y : 60
            }, {
                X : "4",
                Y : 14
            }, {
                X : "5",
                Y : 20
            }, {
                X : "6",
                Y : -30
            },
        ]
    };

    // Returns the max Y value in our data list
    function getMaxY() {
        var max = 0;

        for (var i = 0; i < data.values.length; i++) {
            if (data.values[i].Y > max) {
                max = data.values[i].Y;
            }
        }

        max += 10 - max % 10;
        return max;
    }
    var scaleA = 1.4;
    // Return the x pixel for a graph point
    function getXPixel(val) {
        return ((graph.width() / scaleA  - xPadding) / data.values.length) * val + (xPadding * 1.5);
    }

    // Return the y pixel for a graph point
    function getYPixel(val) {
        return graph.height() / scaleA  - (((graph.height() / scaleA  - yPadding) / getMaxY()) * val) - yPadding;
    }

    graph = $('#graph');
    var c = graph[0].getContext('2d');
    c.clearRect(0,0,graph[0].width,graph[0].height);
    c.lineWidth = 2;
    c.strokeStyle = '#333';
    c.font = 'italic 8pt sans-serif'; 
    c.textAlign = "center";

    // Draw the axises
    c.beginPath();
    c.moveTo(xPadding, 0);
    c.lineTo(xPadding, graph.height() / scaleA  - yPadding);
    c.lineTo(graph.width(), graph.height() / scaleA  - yPadding);
    c.stroke();

    // Draw the X value texts
    for (var i = 0; i < data.values.length; i++) {
        c.fillText(data.values[i].X, getXPixel(i), graph.height() / scaleA  - yPadding + 20);
    }

    // Draw the Y value texts
    c.textAlign = "right"
        c.textBaseline = "middle";

    for (var i = 0; i < getMaxY(); i += 10) {
        c.fillText(i, xPadding - 10, getYPixel(i));
    }

    c.strokeStyle = '#f00';

    // Draw the line graph
    c.beginPath();
    c.moveTo(getXPixel(0), getYPixel(equation(0)));
    for (var i = 1; i < data.values.length; i++) {
        c.lineTo(getXPixel(i), getYPixel(equation(i)));
    }
    c.stroke();

    // Draw the dots
    c.fillStyle = '#333';

    for (var i = 0; i < data.values.length; i++) {
        c.beginPath();
        c.arc(getXPixel(i), getYPixel(equation(i)), 4, 0, Math.PI * 2, true);
        c.fill();
    }
}
var codeText = "";
function parseEquation(input){
    // Important that white spaces are removed first
    input = input.replace(/\s+/g,""); // remove whitespaces
    input = input.replace(/([\-\+])([xy])/g,"$11$2"); // convert -x -y or +x +y to -1x -1y or +1x +1y
                                                      // just to make the logic below a little simpler
    var newTerm = () => {term = { val : null, scalar : 1, left : left, };} // create a new term
    var pushTerm = () => {terms.push(term); term = null;} // push term and null current
    // regExp [xy=] gets "x","y", or "="" or [\-\+]??[0-9\.]+  gets +- number with decimal
    var reg =/[xy=]|[\-\+]??[0-9\.eE]+/g;   // regExp to split the input string into parts
    var parts = input.match(reg);           // get all the parts of the equation
    var terms = [];     // an array of all terms parsed
    var term = null;    // Numbers as constants and variables with scalars are terms
    var left = true;    // which side of equation a term is
    parts.forEach(p=>{ 
         if (p === "x" || p === "y") {
            if (term !== null && term.val !== null) {  // is the variable defined
                 pushTerm(); // yes so push to the stack and null 
            }
            if (term === null) { newTerm(); }  // do we need a new term?
            term.val = p;
        } else if( p === "="){                // is it the equals sign
            if (!left) { throw new SyntaxError("Unxpected `=` in equation."); }
            if (term === null) { throw new SyntaxError("No left hand side of equation."); }// make sure that there is a left side
            terms.push(term);   // push the last left side term onto the stack
            term = null;
            left = false;       // everything on the right from here on in
        } else {                // all that is left are numbers (we hope)
            if (isNaN(p)){ throw new SyntaxError("Unknown value '"+p+"' in equation");  }//check that there is a number
            if (term !== null && (p[0] === "+" || p[0] === "-")){ // check if number is a new term
                 pushTerm();    // yes so push to the stack and null 
            }
            if(term === null){ newTerm(); } // do we need a new term?
            term.scalar *= Number(p);       // set the scalar to the new value
        }
    });
    
    if(term !== null){// there may or may not be a term left to push to the stack
        pushTerm();
    }
    // now simplify the equation getting the scalar for left and right sides . x on left y on right
    var scalarX = 0;
    var scalarY = 0
    var valC = 0; // any constants 
    terms.forEach(t => {
        t.scalar *= !t.left ? -1 : 1; // everything on right is negative
        if (t.val === "y") {
            scalarY += -t.scalar; // reverse sign
        } else if (t.val === "x") {
            scalarX += t.scalar; 
        } else {
            valC += t.scalar;
        }
    })
    // now build the code string for the equation to solve for x and return y
    var code = "return (" + scalarX + " * x  + (" + valC + ")) / "+scalarY +";\n";
    codeText = code;
    var equation = new Function("x",code); // create the function
    
    return equation;
}


function parseAndPlot(){
  var input = eqInput.value;
  try{
     var equation = parseEquation(input);
     plot(equation);
     error.textContent ="Plot of "+input+ " as 'function(x){ "+codeText+"}'";      
  }catch(e){
     error.textContent = "Error parsing equation. " + e.message;      
  }
  
} 


var button = document.getElementById("plot");
var eqInput = document.getElementById("equation-text");
var error = document.getElementById("status");
button.addEventListener("click",parseAndPlot);
parseAndPlot();
}
    return (
        <div>
            <p>{parseEquation("x + 9 = y")}</p>
            <canvas id="graph" width="200" height="150"></canvas>
            <p>Enter a linear equation : </p><input id="equation-text" value="x2 + 5y = 250" type="text"></input><input id="plot" value="plot" type={button}></input><div id="status"></div>
        </div>
    )
}

export default graph