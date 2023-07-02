// require readline to connetc with the terminal
import readline from "readline";

// define readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
// result is for returning the result of the calculation
let result = 0;
// display is for displaying the current state of the calculator
let display = 0;
// operators is for checking if the input has an operator
const operators = ['+', '-', '*', '/'];


// helper function to perform calculation when command has operators, and no '='
function calculate(num) {
    if (typeof result === "number") {
        // conidition to avoid the erro of Octal literals are not allowed in strict mode.
        if (result === 0) {
            // if calculated result if 0 anyways, just assign the result to the number
            result = eval(num);
            return;
        } else {
            // if it is not 0, convert the result to string and concat the operator with number to it
            result = result.toString().concat(num);
        }
    } else {
        // if result is not a number, assign the number to result
        result = eval(num);
        return;
    }
    // assign the evaluated result to result
    result = eval(result);
}

function startCalculator() {
    // a helper function to get the last number in the command when no "=" is present
    function lastNum(command) {
        // loop to look for operators in the command
        for (let i = command.length - 1; i >= 0; i--) {
            // if operator is found, slice the command from the operator to the end of the command
            if (operators.includes(command[i])) {
                // assign the sliced last number to display
                display = command.slice(i+1);
                return display;
            }
        }
        // if no operator is found, that means there is no operation being performed 
        // and we can just assign the command to display and result
        display = command;
        result = command;
        return display;
    }
    // prompt the user for input
    rl.question(`${display}\n`, (command) => {
    // condition where user wants to exit the calculator application
    if (command === 'exit') {
      rl.close();
      return;
    } 
    // condition where user wants to clear the calculator
    else if (command === 'c') {
        result = 0;
        display = 0;
        startCalculator();
        return;
    } 
    // check if the command only contains numbers and operators, edge case eradication
    // has to be done after checking for 'exit' and 'c' because they are not numbers or operators
    else if (/^[(+=\-*/.)0-9]*$/.test(`${command}`) !== true) {
        // prompt the user for a valid input
        console.log("Invalid input");
        // start the calculator again
        startCalculator();
        return;
    } // condition where user wants to see the calculated the result aka where a '=' is present
    else if (command.slice(-1) === '=') {
        // condition where user just entered a '=' without any calculation or numbers
        if (command === '=') {
            // display the result
            display = result;
            startCalculator();
            return;
        } // condition where user wants to see the result of the calculation immediately 
        else {
            // if the use encouters this condition in its first ever command
            if (result === 0) {
                // check for operators in the command , slice the command and not evaluate the result
                for (let i = command.length - 1; i >= 0; i--) {
                    if (operators.includes(command[i])) {
                        result = eval(command.slice(0, -1));
                        display = result;
                        startCalculator();
                        return;
                    }   
                }
            }
            else {
                // if the user has already performed a calculation, check for operators in the command
                // and include result in the evaluation
                for (let i = command.length - 1; i >= 0; i--) {
                    if (operators.includes(command[i])) {
                        result = eval(result + command.slice(0, -1));
                        display = result;
                        startCalculator();
                        return;
                    }
                }
                
            }
            // condition where the loop did not find any operator and user just want to see the number entered
            result = command.slice(0, -1);
            display = result;
            startCalculator();
            return;
        }
    } // condition where user just enters without anything input
    else if (command === '') {
        startCalculator();
        return;
    }
    // condition where user wants to continue the calculation without seeing the result
    else {
        // invoke the lastNum helper function to get the last number in the command and display it
        lastNum(command);
        // invoke the calculate helper function to update the result variable
        calculate(command);
        startCalculator();
        return;
    }
  });
}

startCalculator();
