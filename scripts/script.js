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

const calculate = function(num1 = 0, num2 = 0, symbol = "+") {
  const operation = operationMap.get(symbol);
  return operation(num1, num2);
};

const updateAfterCalc = function(result) {
  nums = [];
  heldResult = result;
};


// ---------- CALCULATOR FUNCTIONALITY ---------- //
const updateDisplay = value => display.textContent = value;

const highlightBtnClicked = function(btn) {
  btn.classList.add("operation-clicked");
};

const reduceResult = function(result) {
  const part1 = String(result).split(".")[0];
  const decimalPlaces = 8 - part1.length;
  return decimalPlaces >= 0 ? result.toFixed(decimalPlaces) : result;
};

const addCommaSeparators = function(result) {
  let [part1, part2] = String(result).split(".");
  if (part2) part2 = "." + part2;
  if (part1.length <= 3) return result;
  const integerDigits = part1.split("");
  integerDigits.reverse();
  let commaCount = 0;
  for (let i = 0; i < integerDigits.length; i++) {
    if (i > 0 && i % 3 === 0 && i + commaCount < integerDigits.length) {
      integerDigits.splice(i + commaCount, 0, ",");
      commaCount++;
    }
  }
  integerDigits.reverse();
  return [...integerDigits, part2].join("");
};

const performCalculation = function(btnClicked) {
  let result = calculate(...nums, symbol);
  updateAfterCalc(result);

  if (btnClicked === "=") {
    currentNum = result;
  } else {
    nums.push(result);
  }

  if (String(result).length > 8) result = reduceResult(result);
  const commasAdded = addCommaSeparators(result);
  updateDisplay(commasAdded);
};



const resetCalculator = function() {
  nums = [];
  symbol = "+";
  currentNum = "";
  heldResult = undefined;
  updateDisplay(0);
};

resetCalculator();

// ---------- BUTTON EVENT LISTENERS ---------- //
allBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    operationBtns.forEach(function(opBtn) {
      opBtn.classList.remove("operation-clicked");
    });
  });
});

numberBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    if (currentNum.length === 8) return;
    const numClicked = this.textContent;
    if (heldResult !== undefined && nums.length === 0) {
      currentNum = numClicked;
      heldResult = undefined;
    } else {
      currentNum += numClicked;
    }
    updateDisplay(addCommaSeparators(currentNum));
  });
});

operationBtns.forEach(function(btn) {
  if (btn.textContent === "=") {
    btn.addEventListener("click", function() {
      if (currentNum !== "") nums.push(Number(currentNum));
      if (nums.length === 2) {
        performCalculation(this.textContent);
      }
    });
  } else {
    btn.addEventListener("click", function() {

      highlightBtnClicked(btn);

      if (currentNum !== "") nums.push(Number(currentNum));
      currentNum = "";
      const opClicked = this.textContent;

      if (nums.length === 2) {
        performCalculation(this.textContent);
      }
      symbol = opClicked;
    });
  }
});

clearBtn.addEventListener("click", () => resetCalculator());

changeSignBtn.addEventListener("click", function() {
  currentNum = `${-Number(currentNum)}`;
  updateDisplay(currentNum);
});
