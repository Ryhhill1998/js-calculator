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
let heldResult;

const calculate = function(num1 = 0, num2 = 0, symbol) {
  const operation = operationMap.get(symbol);
  return operation(num1, num2);
};

const updateAfterCalc = function(result) {
  nums = [];
  heldResult = result;
};


// ---------- CALCULATOR FUNCTIONALITY  ---------- //
const updateDisplay = value => display.textContent = value;

numberBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    if (display.textContent.length === 8) return;
    const numClicked = this.textContent;
    if (heldResult === undefined && nums.length === 0) {
      currentNum = numClicked;
      heldResult === undefined;
    } else {
      currentNum += numClicked;
    }
    updateDisplay(currentNum);
  });
});

operationBtns.forEach(function(btn) {
  if (btn.textContent === "=") {
    btn.addEventListener("click", function() {
      nums.push(Number(currentNum));
      const result = calculate(...nums, symbol);
      currentNum = result;
      updateAfterCalc(result);
      updateDisplay(result);
    });
  } else {
    btn.addEventListener("click", function() {

      nums.push(Number(currentNum));
      currentNum = "";
      const opClicked = this.textContent;

      if (nums.length === 2) {
        const result = calculate(...nums, symbol);
        updateAfterCalc(result, nums);
        updateDisplay(result);
      }
      symbol = opClicked;
    });
  }
});
