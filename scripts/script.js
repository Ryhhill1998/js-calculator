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

// ---------- DOM OBJECTS ---------- //
const display = document.querySelector(".display");
const numberBtns = document.querySelectorAll(".number");
const operationBtns = document.querySelectorAll(".operation");



// ---------- BACKEND CALCULATIONS ---------- //
let nums = [];
let symbol = "+";
let currentNum = "";

const calculate = function(num1 = 0, num2 = 0, symbol) {
  const operation = operationMap.get(symbol);
  return operation(num1, num2);
};

const updateNumsAfterCalc = function(result, array) {
  array.pop();
  array[0] = result;
};


// ---------- CALCULATOR FUNCTIONALITY  ---------- //
const updateDisplay = value => display.textContent = value;

numberBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {

    if (display.textContent.length === 8) return;
    const numClicked = this.textContent;
    currentNum += numClicked;
    updateDisplay(currentNum);
  });
});

for (const btn of operationBtns) {
  if (btn.textContent === "=") {
    btn.addEventListener("click", function() {
      nums.push(Number(currentNum));
      currentNum = "";
      const result = calculate(...nums, symbol);
      updateNumsAfterCalc(result, nums);
      updateDisplay(result);
    });
  } else {
    btn.addEventListener("click", function() {

      nums.push(Number(currentNum));
      currentNum = "";
      const opClicked = this.textContent;

      if (nums.length === 2) {
        const result = calculate(...nums, symbol);
        updateNumsAfterCalc(result, nums);
        updateDisplay(result);
      }
      symbol = opClicked;
    });
  }
}
