"use strict";
// Import stylesheets
import "./style.css";

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Ahmad Saleh",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const createUsername = function(accounts) {
  accounts.forEach(account => {
    // Create new property 'username' for each
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map(word => word[0])
      .join("");
  });
};
createUsername(accounts);

const displayMovments = function(movements, sort = false) {
  containerMovements.innerHTML = "";

  // we use slice() to make a copy of the original array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}</div>
        <div class="movements__value">${mov.toFixed(2)}\$</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, current) => acc + current, 0);
  // Update UI
  labelBalance.textContent = `${acc.balance.toFixed(2)}\$`;
};

// Note:  0 is the inital value - the 2nd parameter of reduce method
// array.reduce(function(acc, currentValue, currentIndex, arr), initialValue)

// filter - map - reduce
const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}﹩`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}﹩`;

  // interest (1.2): ex. 500 * 1.2 / 100 = 6
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1) // exclude intrests less than $1
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}﹩`;
};

const updateUI = account => {
  displayMovments(account.movements); // Display movements
  calcDisplayBalance(account); // Display balance
  calcDisplaySummary(account); // Display summary
};

// Event Handler: - Login
let currentAccount;
btnLogin.addEventListener("click", function(event) {
  event.preventDefault();
  // find the user that matches the input
  // find() method returns the first element that passes a test
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // Check if account actually exists using the optional chaining (?)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); // lose focus

    updateUI(currentAccount);

    console.log(currentAccount);
  }
});

// Transfer amounts from an account to another
btnTransfer.addEventListener("click", function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  // find() method returns the first element that passes a test
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

// Close an account
btnClose.addEventListener("click", function(e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // Loop throgh accounts array and find the user
    // The findIndex() method returns the index of the first element in an array that pass a test
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

// Request a loan
btnLoan.addEventListener("click", function(e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  // Accept loans only if any deposit >= 10% of the request
  // for example: I can request 10,000 if I have at least 1000 as a deposit
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    inputLoanAmount.value = "";
  }
});

let sorted = false;
btnSort.addEventListener("click", function(e) {
  e.preventDefault();
  displayMovments(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// const max = Math.max(...account1.movements);
// console.log(max);

// includes - some - every
console.log(account1.movements.includes(-130));
// The some() method checks if any of the elements in an array pass a test
console.log(account1.movements.some(mov => mov > 1000));
// The every() method checks if all elements in an array pass a test
console.log(account1.movements.every(mov => mov > 0));

/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"]
]);

/////////////////////////////////////////////////
// ----- flat() - flatMap()
const movements = accounts.map(acc => acc.movements);
console.log(movements);

const allMovements = movements.flat();
console.log(allMovements);

const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// flatMap is a combination of map and flat(1)
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

///////////////////////////////////////
// ---- Array.from() -------/
/**
 * Array.from() lets you create Arrays from:
 * array-like objects (objects with a length property and indexed elements); or
 * iterable objects (objects such as Map and Set).
 * Syntax: Array.from(arrayLike, mapFn, thisArg)
 */
// Create an array from a NodeList
// querySelectorAll does NOT create an array. It creates a NodeList
labelBalance.addEventListener("click", function() {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    el => Number(el.textContent.replace("$", ""))
  );
  console.log(movementsUI);

  // OR you can do this:
  const movementsUI2 = [...document.querySelectorAll(".movements__value")].map(
    el => Number(el.textContent.replace("$", ""))
  );
  console.log(movementsUI2);
});

// More on Array methods
// Ex. 1 Calculate all the deposits
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);

// Ex. 2 Count how many movements >= 1000
/**
 * The initial value of the accumulator is 0 (sum = 0)
 * if the cur >= 1000 add 1 to the sum
 * ++sum is different than sum++
 * See exampl bellow
 */
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((sum, cur) => (cur >= 1000 ? ++sum : sum), 0);
console.log(numDeposits1000); // 6

// ------ THE prefixed ++ Operator -------- //
let plus = 1;
console.log(plus++); // still 1
console.log(++plus); // It's 3 now
// the plus++ increments 1 but it doesn't return the new value
// However, the ++plus increments and returns the new value

// Ex. 3 Create an obj that contains the sum of the deposits and the sum of withdrawals
// Here the initial value is an object
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      // cur > 0 ? (sum.deposits += cur) : (sum.withdrawls += -cur);  // OR:
      sum[cur > 0 ? "deposits" : "withdrawals"] += Math.abs(cur);
      return sum;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);
