const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '`~!@#$%^&*()_-+={[}]|:;"<>,.?/';

let password = "";
let passwordLength = 10;
let checkCount =0;
handleSlider();

// set strength circle color to grey
setIndicator("#ccc");

// Function to update the password length display and slider value
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min) ) + "% 100%"
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInt(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInt(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInt(65, 91));
}

function generateSymbol() {
  const randNum = getRandomInt(0, symbols.length);
  return symbols.charAt(randNum);
}

function shufflePassword(array) {
  // Fisher-Yates shuffle algorithm
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random() * (i+1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
    return str;
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  }
  catch(e){
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active"); // to make copy walla span visible
  setTimeout( () => {
    copyMsg.classList.remove("active"); // after 2 seconds remove the visible class
  },2000);
}


function hanldeCheckBox(){
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if(checkbox.checked) {
      checkCount++;
    }
  });

  // Special condtion for check count
  if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change' , hanldeCheckBox); 
});

inputSlider.addEventListener('input' , (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener('click' , () => {
  if(password.length > 0){
    copyContent();
  }
});

generateBtn.addEventListener('click' , () => {
  // none of the checkbox is checked
  if(checkCount <= 0) return;

  if(passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // Let's start the password generation
  password = "";    // remove old password


  let funcArr = [];

  if(uppercaseCheck.checked) 
    funcArr.push(generateUpperCase);
  if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);
  if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);
  if(symbolsCheck.checked)
    funcArr.push(generateSymbol);

  // Compulsory addition
  for(let i=0;i<funcArr.length;i++){
    password += funcArr[i]();
  }


  // Remaining addition
  for(let i=0;i<(passwordLength - funcArr.length);i++){
    let randomIndex = getRandomInt(0, funcArr.length);
    password += funcArr[randomIndex]();
  }

  // Shuffle the password
  password = shufflePassword(Array.from(password));


  // Show password in UI
  passwordDisplay.value = password;


  // Calculate strength
  calcStrength();
});