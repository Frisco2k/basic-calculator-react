import "./styles.css"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import { useReducer } from "react"


export const ACTIONS ={
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite:false,
        }
      }
      if(payload.digit === "0" && state.currentOperand ==="0") {
        return state;
      }
      if(payload.digit === "." && state.currentOperand.includes(".")){
       return state;
      }
      return{
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentOperand == null && state.previousOperand == null){
          return state
        }

        if(state.currentOperand == null){
          return {
            ...state,
            operation: payload.operation,
          }
        }

        if(state.previousOperand == null ){
          return{
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          }
        }

          return{
            ...state,
            overwrite:true,
            previousOperand: evaluate(state),
            operation: payload.operation,
            currentOperand: null
          }

        

      case ACTIONS.CLEAR:
        return {}
      case ACTIONS.EVALUATE:
        if(state.operation == null || state.currentOperand == null || state.previousOperand == null) {
          return state 
        }

        return{
          ...state,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
          overwrite:true
        }

        
        case ACTIONS.DELETE_DIGIT:
          if(state.overwrite){
            return{
              ...state,
              overwrite:false,
              currentOperand: null
            }
          }
          if(state.currentOperand == null){
            return state
          }

          if(state.currentOperand.length == 1){
            return {
              ...state,
              currentOperand: null
            }
          }

          return{
            ...state,
            currentOperand: state.currentOperand.slice(0, -1)
          }

  }

}


function evaluate({currentOperand, previousOperand, operation}){
  const curr = parseFloat(currentOperand)
  const prev = parseFloat(previousOperand)
  if(isNaN(prev) || isNaN(curr)){
    return ""
  }
  let computation = ""

  switch (operation){
    case "+":
      computation = prev + curr;
      break;
      case "-":
        computation = prev - curr;
        break;
      case "÷":
        computation = prev / curr;
        break;
      case "*":
        computation = prev * curr;
        break;
  }

  return computation.toString();
}

const formatter = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0}) 

function formatOperand(operand){
  if(operand == null)
    return
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return formatter.format(integer)
    return `${formatter.format(integer)}.${decimal}`
}

function App() {
  const[{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer,{})

  
  return(
    <div className="calculator-panel">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div> 
        <div className="curr-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() =>dispatch({type: ACTIONS.CLEAR})}> AC</button>
      <button onClick={() =>dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch ={dispatch} />
      <DigitButton digit ="1" dispatch ={dispatch} />
      <DigitButton digit ="2" dispatch ={dispatch} />
      <DigitButton digit ="3" dispatch ={dispatch} />
      <OperationButton operation="*" dispatch ={dispatch} />
      <DigitButton digit ="4" dispatch ={dispatch} />
      <DigitButton digit ="5" dispatch ={dispatch} />
      <DigitButton digit ="6" dispatch ={dispatch} />
      <OperationButton operation="+" dispatch ={dispatch} /> 
      <DigitButton digit ="7" dispatch ={dispatch} />
      <DigitButton digit ="8" dispatch ={dispatch} />
      <DigitButton digit ="9" dispatch ={dispatch} /> 
      <OperationButton operation="-" dispatch ={dispatch} />
      <DigitButton digit ="." dispatch ={dispatch} />
      <DigitButton digit ="0" dispatch ={dispatch} />
      <button className="span-two" onClick={() =>dispatch({type: ACTIONS.EVALUATE})}>=</button> 

      <div className="banner">
        Simple Beginner React Calculator made by <a href="https://github.com/Frisco2k">Frisco (Github) 💙</a>
      </div>

    </div>

    


  )
}

export default App;
