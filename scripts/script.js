'use strict';

const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => num1 / num2;

const operationMap = new Map([
  ["+", add],
  ["-", subtract],
  ["*", multiply],
  ["/", divide]
]);

const calculate = function(num1, num2, symbol = "+") {
  const operation = operationMap.get(symbol);
  return operation(num1, num2);
}

let nums = [];
let symbol;

const updateNums = function(input) {
  if (symbol === undefined) {
    nums[0] += input;
  } else {
    nums[1] += input;
  }
};

const updateSymbol = function(input) {
  if (nums.length === 2) calculate((...nums), symbol);
}
