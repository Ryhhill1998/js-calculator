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

const calcBtns = document.querySelector(".calculator-buttons");
const funcBtns = document.querySelector(".function-btns");
const numBtns = document.querySelector(".number-btns");
const opBtns = document.querySelector(".operation-btns");

const allBtns = document.querySelectorAll("button");
const numberBtns = document.querySelectorAll(".number");
const operationBtns = document.querySelectorAll(".operation");

const clearBtn = document.getElementById("clear");
const changeSignBtn = document.getElementById("change-sign");
const powerBtn = document.getElementById("power");


// ---------- BACKEND CALCULATIONS ---------- //
let nums, symbol, currentNum, heldResult;

let powerOn = false;

const calculate = (num1, num2, symbol) => {
  const operation = operationMap.get(symbol);
  return operation(num1, num2);
};

const updateAfterCalc = result => {
  nums = [];
  heldResult = result;
};


// ---------- CALCULATOR FUNCTIONALITY ---------- //

// update calculator screen with inputted values and results
const updateDisplay = value => display.textContent = value;

// highlight buttons clicked
const highlightBtnClicked = btn => btn.classList.add("operation-clicked");

// click animation
const buttonClicked = btn => {
  btn.classList.add("button-clicked");
  setTimeout(() => btn.classList.remove("button-clicked"), 100);
};

// reduce number by rounding if it is too large to be displayed properly
const reduceNumber = num => {
  const integers = String(num).split(".")[0];
  return (integers.length > 9 || String(num).includes("e")) ? num.toExponential(5) : num.toPrecision(9);
};

// change display font-size properties depending on number
const formatFontSize = () => {
  display.style.fontSize = "4rem";
  const [maxWidth, maxHeight] = [262, 110];
  const [displayWidth, displayHeight] = [display.offsetWidth, display.offsetHeight];
  if (displayWidth > maxWidth) display.style.fontSize = `${4 * (maxWidth / displayWidth)}rem`;
  if (displayHeight > maxHeight) display.style.fontSize = `${4 * (maxHeight / displayHeight)}rem`;
};

// display number functio1n
const displayNum = num => {
  const stringNum = String(num);
  let reducedNum = stringNum.length > 9 ? reduceNumber(num) : stringNum;
  if (!reducedNum.includes("e")) {
    const options = {
      minimumSignificantDigits: reducedNum.replace(".", "").replace("-", "").length,
    };
    reducedNum = new Intl.NumberFormat("en-GB", options).format(reducedNum);
  }
  updateDisplay(reducedNum);
  formatFontSize();
};

// function to perform calculation and update display
const performCalculation = btnClicked => {
  let result = calculate(...nums, symbol);
  updateAfterCalc(result);
  if (btnClicked === "=") {
    currentNum = String(result);
  } else {
    nums.push(result);
  }
  displayNum(result);
};

// reset calculator when clear button clicked
const resetCalculator = () => {
  nums = [];
  symbol = "+";
  currentNum = "";
  heldResult = undefined;
  display.style.fontSize = "4rem";
  updateDisplay(0);
};

// power off calculator
const powerOffCalculator = () => {
  powerOn = false;
  resetCalculator();
  allBtns.forEach(btn => {
    if (btn.id !== "power") btn.disabled = true;
  });
  display.style.opacity = 0;
};

powerOffCalculator();

// power on calculator
const powerOnCalculator = () => {
  powerOn = true;
  allBtns.forEach(btn => {
    if (btn.id !== "power") btn.disabled = false;
  });
  display.style.opacity = 1;
};


// ---------- BUTTON EVENT LISTENERS ---------- //

// removes highlight from all buttons when another button is clicked
calcBtns.addEventListener("click", e => {
  operationBtns.forEach(function(opBtn) {
    opBtn.classList.remove("operation-clicked");
  });
  buttonClicked(e.target);
});

// update nums array and display when numbers are clicked
numBtns.addEventListener("click", e => {
  const numWithoutDecPlace = currentNum.replace(".", "");
  if (numWithoutDecPlace.length === 9) return;

  const numClicked = e.target.textContent;

  if (heldResult !== undefined && nums.length === 0) {
    currentNum = numClicked;
    heldResult = undefined;
  } else if (numClicked === ".") {
    if (currentNum.includes(".")) return;
    if (currentNum === "") {
      currentNum = "0.";
    } else {
      currentNum += numClicked;
    }
    return updateDisplay(currentNum);
  } else {
    currentNum += numClicked;
    displayNum(+currentNum);
  }

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

// clear screen and calculator data if clear button clicked
clearBtn.addEventListener("click", () => resetCalculator());

// change sign of current num and display num
changeSignBtn.addEventListener("click", function() {
  currentNum = `${-Number(currentNum)}`;
  const updatedDisplayContent = display.textContent.startsWith("-") ? display.textContent.slice(1) : "-" + display.textContent;
  updateDisplay(updatedDisplayContent);
  formatFontSize();
});

// toggle power on calculator
powerBtn.addEventListener("click", () => powerOn ? powerOffCalculator() : powerOnCalculator());
