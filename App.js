import React from 'react';
import graph from './graph';

function App() {
let parens = /\(([0-9+\-*/\^ .]+)\)/             // Regex for identifying parenthetical expressions
let exp = /(\d+(?:\.\d+)?) ?\^ ?(\d+(?:\.\d+)?)/ // Regex for identifying exponentials (x ^ y)
let mul = /(\d+(?:\.\d+)?) ?\* ?(\d+(?:\.\d+)?)/ // Regex for identifying multiplication (x * y)
let div = /(\d+(?:\.\d+)?) ?\/ ?(\d+(?:\.\d+)?)/ // Regex for identifying division (x / y)
let add = /(\d+(?:\.\d+)?) ?\+ ?(\d+(?:\.\d+)?)/ // Regex for identifying addition (x + y)
let sub = /(\d+(?:\.\d+)?) ?- ?(\d+(?:\.\d+)?)/  // Regex for identifying subtraction (x - y)

/**
 * Takes in a string argument and outputs the numerical answer to the equation
 * Follows standard order of operations
 * @param {String} expr Numerical expression input
 * @returns {Number} Result of expression
 */
function amd(expr)
{
    if(isNaN(Number(expr)))
    {
        if(parens.test(expr))
        {
            let newExpr = expr.replace(parens, function(match, subExpr) {
                return amd(subExpr);
            });
            return amd(newExpr);
        }
        else if(exp.test(expr))
        {
            let newExpr = expr.replace(exp, function(match, base, pow) {
                return Math.pow(Number(base), Number(pow));
            });
            return amd(newExpr);
        }
        else if(mul.test(expr))
        {
            let newExpr = expr.replace(mul, function(match, a, b) {
                return Number(a) * Number(b);
            });
            return amd(newExpr);
        }
        else if(div.test(expr))
        {
            let newExpr = expr.replace(div, function(match, a, b) {
                if(b != 0)
                    return Number(a) / Number(b);
                else
                    throw new Error('Division by zero');
            });
            return amd(newExpr);
        }
        else if(add.test(expr))
        {
            let newExpr = expr.replace(add, function(match, a, b) {
                return Number(a) + Number(b);
            });
            return amd(newExpr);
        }
        else if(sub.test(expr))
        {
            let newExpr = expr.replace(sub, function(match, a, b) {
                return Number(a) - Number(b);
            });
            return amd(newExpr);
        }
        else
        {
            return expr;
        }
    }
    return Number(expr);
}

  return (
    <div>
      <div>
       
        <p> {amd((5+8)*3/8+3)}</p>
        <graph />
      </div>
    </div>
  );
}

export default App;
