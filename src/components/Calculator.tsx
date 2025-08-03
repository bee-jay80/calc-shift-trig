import { useState } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [inputMode, setInputMode] = useState(false);
  const [activeInput, setActiveInput] = useState<'a' | 'b' | 'c'>('a');
  const [inputValues, setInputValues] = useState({ a: '', b: '', c: '' });

  const handleNumberClick = (num: string) => {
    if (inputMode) {
      setInputValues(prev => ({
        ...prev,
        [activeInput]: prev[activeInput] + num
      }));
    } else {
      setDisplay(prev => prev === '0' ? num : prev + num);
    }
  };

  const handleOperatorClick = (operator: string) => {
    const mathSymbols: { [key: string]: string } = {
      '/': '÷',
      '*': '×',
      '-': '−',
      '+': '+'
    };
    
    const symbol = mathSymbols[operator] || operator;
    
    if (inputMode) {
      setInputValues(prev => ({
        ...prev,
        [activeInput]: prev[activeInput] + symbol
      }));
    } else {
      setDisplay(prev => prev + symbol);
    }
  };

  const handleFunctionClick = (func: string) => {
    const value = func + '(';
    if (inputMode) {
      setInputValues(prev => ({
        ...prev,
        [activeInput]: prev[activeInput] + value
      }));
    } else {
      setDisplay(prev => prev === '0' ? value : prev + value);
    }
  };

  const handleClear = () => {
    if (inputMode) {
      setInputValues({ a: '', b: '', c: '' });
    } else {
      setDisplay('0');
    }
  };

  const handleDelete = () => {
    if (inputMode) {
      setInputValues(prev => ({
        ...prev,
        [activeInput]: prev[activeInput].slice(0, -1)
      }));
    } else {
      setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    }
  };

  const toggleInputMode = () => {
    setInputMode(prev => !prev);
  };

  const toggleFocus = () => {
    const inputOrder: ('a' | 'b' | 'c')[] = ['a', 'b', 'c'];
    const currentIndex = inputOrder.indexOf(activeInput);
    const nextIndex = (currentIndex + 1) % inputOrder.length;
    setActiveInput(inputOrder[nextIndex]);
  };

  const getNextInput = () => {
    const inputOrder: ('a' | 'b' | 'c')[] = ['a', 'b', 'c'];
    const currentIndex = inputOrder.indexOf(activeInput);
    const nextIndex = (currentIndex + 1) % inputOrder.length;
    return inputOrder[nextIndex];
  };

  const handleInputClick = (input: 'a' | 'b' | 'c') => {
    setActiveInput(input);
  };

  const solveQuadratic = () => {
    try {
      // Parse coefficients from input values
      const a = parseFloat(inputValues.a) || 0;
      const b = parseFloat(inputValues.b) || 0;
      const c = parseFloat(inputValues.c) || 0;

      if (a === 0) {
        setDisplay('Not a quadratic equation (a = 0)');
        return;
      }

      // Calculate discriminant
      const discriminant = b * b - 4 * a * c;

      if (discriminant > 0) {
        // Two real solutions
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        setDisplay(`x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`);
      } else if (discriminant === 0) {
        // One real solution
        const x = -b / (2 * a);
        setDisplay(`x = ${x.toFixed(4)}`);
      } else {
        // Complex solutions
        const realPart = (-b / (2 * a)).toFixed(4);
        const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
        setDisplay(`x₁ = ${realPart} + ${imaginaryPart}i, x₂ = ${realPart} - ${imaginaryPart}i`);
      }
    } catch (error) {
      setDisplay('Error solving equation');
    }
  };

  const calculateResult = () => {
    if (inputMode) {
      // Solve quadratic equation when in input mode
      solveQuadratic();
    } else {
      // Regular calculator evaluation
      try {
        // Convert mathematical symbols back to JavaScript operators for evaluation
        let expression = display
          .replace(/÷/g, '/')
          .replace(/×/g, '*')
          .replace(/−/g, '-')
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(');
        
        const result = eval(expression);
        setDisplay(result.toString());
      } catch (error) {
        setDisplay('Error');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md">
        {!inputMode ? (
          // Main Calculator Display
          <div className="bg-calculator-screen rounded-xl p-6 mb-6 min-h-20 flex items-center justify-end">
            <div className="text-calculator-screen-text text-3xl font-mono break-all text-right">
              {display}
            </div>
          </div>
        ) : (
          // Three Input Fields and Main Display
          <div className="mb-6 space-y-4">
            {/* Main Display Screen */}
            <div className="bg-calculator-screen rounded-xl p-6 min-h-20 flex items-center justify-end">
              <div className="text-calculator-screen-text text-3xl font-mono break-all text-right">
                {display}
              </div>
            </div>
            
            {/* Three Input Fields */}
            <div className="grid grid-cols-3 gap-4">
              {(['a', 'b', 'c'] as const).map((inputKey) => (
                <div
                  key={inputKey}
                  className={`bg-calculator-screen rounded-xl p-4 min-h-20 cursor-pointer transition-all ${
                    activeInput === inputKey ? 'ring-2 ring-calculator-operator' : ''
                  }`}
                  onClick={() => handleInputClick(inputKey)}
                >
                  <div className="text-calculator-screen-text text-sm mb-1 font-mono">
                    {inputKey}
                  </div>
                  <div className="text-calculator-screen-text text-lg font-mono break-all">
                    {inputValues[inputKey] || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className="bg-calculator-clear hover:bg-calculator-clear-hover text-calculator-clear-text rounded-xl p-4 font-semibold transition-colors"
          >
            AC
          </button>
          <button
            onClick={handleDelete}
            className="bg-calculator-function hover:bg-calculator-function-hover text-calculator-function-text rounded-xl p-4 font-semibold transition-colors"
          >
            DEL
          </button>
          <button
            onClick={toggleInputMode}
            className="bg-calculator-toggle hover:bg-calculator-toggle-hover text-calculator-toggle-text rounded-xl p-4 font-semibold transition-colors"
          >
            {inputMode ? 'CALC' : 'ABC'}
          </button>
          <button
            onClick={() => handleOperatorClick('/')}
            className="bg-calculator-operator hover:bg-calculator-operator-hover text-calculator-operator-text rounded-xl p-4 font-semibold transition-colors"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleFunctionClick('sin')}
            className="bg-calculator-function hover:bg-calculator-function-hover text-calculator-function-text rounded-xl p-4 font-semibold transition-colors text-sm"
          >
            sin
          </button>
          <button
            onClick={() => handleNumberClick('7')}
            className="bg-calculator-button hover:bg-calculator-button-hover text-calculator-button-text rounded-xl p-4 font-semibold transition-colors"
          >
            7
          </button>
          <button
            onClick={() => handleNumberClick('8')}
            className="bg-calculator-button hover:bg-calculator-button-hover text-calculator-button-text rounded-xl p-4 font-semibold transition-colors"
          >
            8
          </button>
          <button
            onClick={() => handleNumberClick('9')}
            className="bg-calculator-button hover:bg-calculator-button-hover text-calculator-button-text rounded-xl p-4 font-semibold transition-colors"
          >
            9
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleFunctionClick('cos')}
            className="bg-calculator-function hover:bg-calculator-function-hover text-calculator-function-text rounded-xl p-4 font-semibold transition-colors text-sm"
          >
            cos
          </button>
          <button
            onClick={() => handleNumberClick('4')}
            className="bg-calculator-button hover:bg-calculator-button-hover text-calculator-button-text rounded-xl p-4 font-semibold transition-colors"
          >
            4
          </button>
          <button
            onClick={() => handleNumberClick('5')}
            className="bg-calculator-button hover:bg-calculator-button-hover text-calculator-button-text rounded-xl p-4 font-semibold transition-colors"
          >
            5
          </button>
          <button
            onClick={() => handleNumberClick('6')}
            className="bg-calculator-button hover:bg-calculator-button-hover text-calculator-button-text rounded-xl p-4 font-semibold transition-colors"
          >
            6
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleFunctionClick('tan')}
            className="bg-calculator-function hover:bg-calculator-function-hover text-calculator-function-text rounded-xl p-4 font-semibold transition-colors text-sm"
          >
            tan
          </button>
          <button
            onClick={() => handleNumberClick('1')}
            className="bg-calculator-button hover:bg-calculator-button-hover text-calculator-button-text rounded-xl p-4 font-semibold transition-colors"
          >
            1
          </button>
          <button
            onClick={() => handleNumberClick('2')}
            className="bg-calculator-button hover:bg-calculator-button-hover text-calculator-button-text rounded-xl p-4 font-semibold transition-colors"
          >
            2
          </button>
          <button
            onClick={() => handleNumberClick('3')}
            className="bg-calculator-button hover:bg-calculator-button-hover text-calculator-button-text rounded-xl p-4 font-semibold transition-colors"
          >
            3
          </button>

          {/* Row 5 */}
          {inputMode && (
            <button
              onClick={toggleFocus}
              className="bg-calculator-toggle hover:bg-calculator-toggle-hover text-calculator-toggle-text rounded-xl p-4 font-semibold transition-colors"
            >
              {getNextInput()}
            </button>
          )}
          {!inputMode && (
            <button
              onClick={() => handleNumberClick('(')}
              className="bg-calculator-function hover:bg-calculator-function-hover text-calculator-function-text rounded-xl p-4 font-semibold transition-colors"
            >
              (
            </button>
          )}
          <button
            onClick={() => handleNumberClick('0')}
            className="bg-calculator-button hover:bg-calculator-button-hover text-calculator-button-text rounded-xl p-4 font-semibold transition-colors"
          >
            0
          </button>
          <button
            onClick={() => handleNumberClick('.')}
            className="bg-calculator-button hover:bg-calculator-button-hover text-calculator-button-text rounded-xl p-4 font-semibold transition-colors"
          >
            .
          </button>
          {!inputMode && (
            <button
              onClick={() => handleNumberClick(')')}
              className="bg-calculator-function hover:bg-calculator-function-hover text-calculator-function-text rounded-xl p-4 font-semibold transition-colors"
            >
              )
            </button>
          )}
          {inputMode && (
            <button
              onClick={() => handleOperatorClick('+')}
              className="bg-calculator-operator hover:bg-calculator-operator-hover text-calculator-operator-text rounded-xl p-4 font-semibold transition-colors"
            >
              +
            </button>
          )}

          {/* Row 6 */}
          <button
            onClick={() => handleOperatorClick('*')}
            className="bg-calculator-operator hover:bg-calculator-operator-hover text-calculator-operator-text rounded-xl p-4 font-semibold transition-colors"
          >
            ×
          </button>
          <button
            onClick={() => handleOperatorClick('-')}
            className="bg-calculator-operator hover:bg-calculator-operator-hover text-calculator-operator-text rounded-xl p-4 font-semibold transition-colors"
          >
            −
          </button>
          <button
            onClick={() => handleOperatorClick('+')}
            className="bg-calculator-operator hover:bg-calculator-operator-hover text-calculator-operator-text rounded-xl p-4 font-semibold transition-colors"
          >
            +
          </button>
          <button
            onClick={calculateResult}
            className="bg-calculator-operator hover:bg-calculator-operator-hover text-calculator-operator-text rounded-xl p-4 font-semibold transition-colors"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;