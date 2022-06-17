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
const allBtns = document.querySelectorAll("button");
const numberBtns = document.querySelectorAll(".number");
const operationBtns = document.querySelectorAll(".operation");
const clearBtn = document.getElementById("clear");
const changeSignBtn = document.getElementById("change-sign");
const percentageBtn = document.getElementById("percentage");


// ---------- BACKEND CALCULATIONS ---------- //
let nums, symbol, currentNum, heldResult;

const calculate = function(num1, num2, symbol) {
  const operation = operationMap.get(symbol);
  return operation(num1, num2);
};

const updateAfterCalc = function(result) {
  nums = [];
  heldResult = result;
};


// ---------- CALCULATOR FUNCTIONALITY ---------- //

// update calculator screen with inputted values and results
const updateDisplay = value => display.textContent = value;

// highlight buttons clicked
const highlightBtnClicked = btn => btn.classList.add("operation-clicked");

// reduce number by rounding if it is too large to be displayed properly
const reduceNumber = function(num, sign = "") {
  if (sign === "-") num = Number(String(num).slice(1));
  const [integers, decimals] = String(num).split(".");
  if (decimals !== undefined && decimals.includes("e")) {
    const [number, exponent] = String(num).split("e");
    return String(Number(number).toFixed(4)) + "e" + exponent;
  }
  const decimalPlaces = 9 - integers.length;
  return sign + (decimalPlaces >= 0 ? num.toFixed(decimalPlaces) : num.toExponential(5).replace("+", ""));
};

// add comma separators to large non-decimal numbers
const addCommas = (num, sign = "") => {
  if (sign === "-") num = num.replace("-", "");
  let [integers, decimals] = num.split(".");
  const digits = integers.split("");
  digits.reverse();
  let commaCount = 0;
  for (let i = 0; i + commaCount < digits.length; i++) {
    if (i > 0 && i % 3 === 0) {
      digits.splice((i + commaCount), 0, ",");
      commaCount++;
    }
  }
  return sign + (decimals === undefined ? digits.reverse().join("") : [...digits.reverse(), ".", ...decimals].join(""));
};

// change display font-size properties depending on number
const formatFontSize = () => {
  const maxWidth = 262;
  const displayWidth = display.offsetWidth;
  if (displayWidth > maxWidth) {
    const currFontSize = Number(display.style.fontSize.replace("rem", ""));
    display.style.fontSize = `${currFontSize * (maxWidth / displayWidth)}rem`;
  };
};

// function to perform calculation and update display
const performCalculation = function(btnClicked) {
  let result = calculate(...nums, symbol);
  updateAfterCalc(result);

  if (btnClicked === "=") {
    currentNum = String(result);
  } else {
    nums.push(result);
  }

  let stringResult = String(result);
  if (result < 0) stringResult = stringResult.slice(1);

  if (stringResult.length > 9) result = reduceNumber(Number(stringResult), result < 0 ? "-" : "");
  result = addCommas(String(result), Number(result) < 0 ? "-" : "");
  updateDisplay(result);
  formatFontSize();
};

// reset calculator when clear button clicked
const resetCalculator = function() {
  nums = [];
  symbol = "+";
  currentNum = "";
  heldResult = undefined;
  display.style.fontSize = "4rem";
  updateDisplay(0);
};

resetCalculator();

// ---------- BUTTON EVENT LISTENERS ---------- //

// removes a buttons highlight when another button is clicked
allBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    operationBtns.forEach(function(opBtn) {
      opBtn.classList.remove("operation-clicked");
    });
  });
});

// update nums array and display when numbers are clicked
numberBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    const numWithoutDecPlace = currentNum.replace(".", "");
    if (numWithoutDecPlace.length === 9) return;

    const numClicked = this.textContent;

    if (heldResult !== undefined && nums.length === 0) {
      currentNum = numClicked;
      heldResult = undefined;
    } else {
      if (numClicked === "." && currentNum.includes(".")) return;
      currentNum += numClicked;
    }

    if (currentNum === ".") currentNum = "0.";

    const formattedNum = addCommas(currentNum);
    updateDisplay(formattedNum);
    formatFontSize();
  });
});

// perform calculator operations
operationBtns.forEach(function(btn) {

  if (btn.value === "=") {

    // perform calculation if equals button clicked
    btn.addEventListener("click", function() {
      if (nums.length && currentNum !== "") nums.push(Number(currentNum));
      if (nums.length === 2) {
        performCalculation(this.value);
      }
    });
  } else {

    // update symbol when operation button clicked, perform calculation if nums array is full
    btn.addEventListener("click", function() {

      highlightBtnClicked(btn);

      if (currentNum !== "") nums.push(Number(currentNum));
      currentNum = "";
      const opClicked = this.value;

      if (nums.length === 2) {
        performCalculation(opClicked);
      }
      symbol = opClicked;
    });
  }
});

clearBtn.addEventListener("click", () => resetCalculator());

changeSignBtn.addEventListener("click", function() {
  currentNum = `${-Number(currentNum)}`;
  const updatedDisplayContent = display.textContent.startsWith("-") ? display.textContent.slice(1) : "-" + display.textContent;
  updateDisplay(updatedDisplayContent);
});
